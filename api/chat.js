// Vercel Serverless Function for Guardrailed AI Portfolio Assistant
import { GoogleGenAI } from '@google/genai';
import { buildLiveContext, buildSystemPrompt } from './_lib/promptBuilder.js';
import { buildFallbackResponse } from './_lib/fallbackResponder.js';
import { checkRateLimit } from './_lib/rateLimit.js';
import { CALENDAR_TOOL_DECLARATIONS, executeCalendarTool } from './_lib/calendarTools.js';
import {
  inspectUserInput,
  sanitizeHistory,
  validateAssistantOutput,
  wrapUserMessage
} from './_lib/securityGuard.js';

const DEFAULT_MODEL_CASCADE = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3.5-flash-lite'
];

function getModelCascade() {
  const configured = process.env.GEMINI_MODEL?.trim();
  if (!configured) return DEFAULT_MODEL_CASCADE;
  return [configured, ...DEFAULT_MODEL_CASCADE.filter((m) => m !== configured)];
}

function classifyGeminiError(error) {
  const msg = String(error?.message || '').toLowerCase();
  const status = error?.status || error?.statusCode || error?.code;

  if (
    status === 402 ||
    msg.includes('prepayment') ||
    msg.includes('credits are depleted') ||
    msg.includes('billing')
  ) {
    return 'billing_depleted';
  }
  if (status === 429 || msg.includes('quota') || msg.includes('resource_exhausted')) {
    return 'quota_exceeded';
  }
  if (status === 401 || status === 403 || msg.includes('api key') || msg.includes('api_key_invalid')) {
    return 'invalid_key';
  }
  if (status === 404 || msg.includes('not found') || msg.includes('not supported')) {
    return 'model_unavailable';
  }
  return 'provider_error';
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Rate limiting
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]?.trim()) ||
      req.socket?.remoteAddress ||
      'unknown';

    const rateLimitCheck = checkRateLimit(clientIp);
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        error: 'Too many requests. Please try again in a moment.',
        retryAfter: rateLimitCheck.retryAfter
      });
    }

    const { message, conversationHistory = [] } = req.body || {};

    // 2. Layer 1 Security Guard: Input validation, Prompt Injection & Off-topic check
    const inspection = inspectUserInput(message);
    if (!inspection.safe) {
      if (inspection.blocked) {
        return res.status(200).json({
          response: inspection.refusalMessage,
          mode: 'guarded',
          blockedReason: inspection.blockedReason,
          conversationId: Date.now()
        });
      }
      return res.status(inspection.statusCode || 400).json({
        error: inspection.error
      });
    }

    const { sanitizedText, lang } = inspection;

    // Load live context (exchange rate + cached GitHub stats)
    const liveContext = await buildLiveContext();

    // If API key is missing, serve deterministic fallback directly
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return res.status(200).json({
        response: buildFallbackResponse(sanitizedText, lang, liveContext),
        mode: 'fallback',
        fallbackReason: 'missing_key',
        conversationId: Date.now()
      });
    }

    // 3. Layer 2 Security Guard: Sanitized history + XML sandboxing + hardened systemInstruction
    const systemInstruction = await buildSystemPrompt(liveContext);
    const safeHistory = sanitizeHistory(conversationHistory);
    const contents = [
      ...safeHistory,
      {
        role: 'user',
        parts: [{ text: wrapUserMessage(sanitizedText) }]
      }
    ];

    const ai = new GoogleGenAI({ apiKey });
    const models = getModelCascade();
    let lastErrorReason = 'provider_error';

    for (const modelName of models) {
      try {
        const turnContents = [...contents];
        const toolsUsed = [];
        let bookedInterview = null;
        let finalText = '';

        // Bounded tool-calling loop (max 2 tool rounds per user turn)
        for (let round = 0; round < 3; round++) {
          const result = await ai.models.generateContent({
            model: modelName,
            contents: turnContents,
            config: {
              systemInstruction,
              temperature: 0.35,
              topP: 0.85,
              maxOutputTokens: 700,
              tools: [{ functionDeclarations: CALENDAR_TOOL_DECLARATIONS }]
            }
          });

          const calls = result?.functionCalls;
          if (!Array.isArray(calls) || calls.length === 0) {
            finalText = result?.text || '';
            break;
          }

          // Preserve model's functionCall turn
          const modelParts = result?.candidates?.[0]?.content?.parts || calls.map((c) => ({ functionCall: c }));
          turnContents.push({ role: 'model', parts: modelParts });

          // Execute each requested calendar tool safely server-side
          const responseParts = [];
          for (const call of calls.slice(0, 2)) {
            toolsUsed.push(call.name);
            const toolOutput = await executeCalendarTool(call.name, call.args || {}, clientIp);
            if (call.name === 'book_interview' && toolOutput?.ok && toolOutput?.booking) {
              bookedInterview = toolOutput.booking;
            }
            responseParts.push({
              functionResponse: {
                name: call.name,
                response: toolOutput
              }
            });
          }

          turnContents.push({ role: 'user', parts: responseParts });
        }

        // 4. Layer 3 Security Guard: Output leakage check
        const validatedText = validateAssistantOutput(finalText, lang);

        return res.status(200).json({
          response: validatedText,
          mode: 'ai',
          model: modelName,
          ...(toolsUsed.length > 0 ? { toolsUsed } : {}),
          ...(bookedInterview ? { booking: bookedInterview } : {}),
          conversationId: Date.now()
        });
      } catch (modelError) {
        lastErrorReason = classifyGeminiError(modelError);
        console.warn(`[API /api/chat] Model ${modelName} failed (${lastErrorReason}):`, modelError?.message);

        // If billing/key is invalid, trying other Gemini models won't help — jump to fallback immediately
        if (lastErrorReason === 'billing_depleted' || lastErrorReason === 'invalid_key') {
          break;
        }
      }
    }

    // 5. Graceful resilience: deterministic bilingual fallback instead of broken 500/402
    return res.status(200).json({
      response: buildFallbackResponse(sanitizedText, lang, liveContext),
      mode: 'fallback',
      fallbackReason: lastErrorReason,
      conversationId: Date.now()
    });
  } catch (error) {
    console.error('[API /api/chat] Unexpected error:', error?.message);
    return res.status(500).json({
      error: 'An error occurred processing your request. Please try again.'
    });
  }
}
