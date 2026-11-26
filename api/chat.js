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
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite'
];

// Stronger non-lite model prioritized whenever scheduling / tool calling is active
const SCHEDULING_MODEL_CASCADE = [
  'gemini-3.8-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash-lite'
];

const SCHEDULING_INTENT_REGEX =
  /\b(entrevista|interview|agendar|schedule|disponib|availab|calendario|calendar|horario|reservar|book|reuni[oó]n|meeting|llamada|call|confirmo|c[oó]digo|otp|\d{6})\b|@/i;

const FAKE_BOOKING_CLAIM_REGEX =
  /(?:ha sido|fue|qued[oó]|est[aá])\s+(?:agendada|reservada|confirmada|programada)|invitaci[oó]n\s+(?:enviada|fue enviada|ha sido enviada)|has been (?:booked|scheduled|confirmed)|calendar invite (?:has been )?sent/i;

function getModelCascade(preferStrongTools = false) {
  const configured = process.env.GEMINI_MODEL?.trim();
  const base = preferStrongTools ? SCHEDULING_MODEL_CASCADE : DEFAULT_MODEL_CASCADE;
  if (!configured) return base;
  if (preferStrongTools) {
    return ['gemini-3.8-flash', configured, ...base.filter((m) => m !== configured && m !== 'gemini-3.8-flash')];
  }
  return [configured, ...base.filter((m) => m !== configured)];
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

    const { message, conversationHistory = [], otpToken = '' } = req.body || {};

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

    const hasSchedulingContext =
      Boolean(otpToken) ||
      SCHEDULING_INTENT_REGEX.test(sanitizedText) ||
      safeHistory.some((h) => SCHEDULING_INTENT_REGEX.test(h.parts?.[0]?.text || ''));

    const ai = new GoogleGenAI({ apiKey });
    const models = getModelCascade(hasSchedulingContext);
    let lastErrorReason = 'provider_error';

    for (const modelName of models) {
      try {
        const turnContents = [...contents];
        const toolsUsed = [];
        let bookedInterview = null;
        let otpPending = null;
        let activeOtpToken = String(otpToken || '').trim();
        let finalText = '';
        let hallucinationRetryCount = 0;

        // Bounded tool-calling loop (max 3 tool rounds per user turn)
        for (let round = 0; round < 4; round++) {
          const result = await ai.models.generateContent({
            model: modelName,
            contents: turnContents,
            config: {
              systemInstruction,
              temperature: hasSchedulingContext ? 0.15 : 0.35,
              topP: 0.85,
              maxOutputTokens: 750,
              tools: [{ functionDeclarations: CALENDAR_TOOL_DECLARATIONS }]
            }
          });

          const calls = result?.functionCalls;
          if (!Array.isArray(calls) || calls.length === 0) {
            const candidateText = result?.text || '';

            // Anti-hallucination guardrail: NEVER allow claiming a booking succeeded if book_interview didn't succeed!
            if (
              !bookedInterview &&
              FAKE_BOOKING_CLAIM_REGEX.test(candidateText) &&
              hallucinationRetryCount < 1
            ) {
              hallucinationRetryCount++;
              turnContents.push({ role: 'model', parts: [{ text: candidateText }] });
              turnContents.push({
                role: 'user',
                parts: [
                  {
                    text: '[SYSTEM_CORRECTION]: You did NOT call book_interview successfully yet, so NO Google Calendar event was created. Either call the required tool right now (send_verification_code or book_interview) with the details the user provided, OR honestly tell the user what exact information is still missing (interview title/role, full name, email, or 6-digit verification code). Never claim an event is booked unless book_interview returned ok:true.'
                  }
                ]
              });
              continue;
            }

            // Hard fallback if it STILL claims booking without executing book_interview
            if (!bookedInterview && FAKE_BOOKING_CLAIM_REGEX.test(candidateText)) {
              finalText =
                lang === 'en'
                  ? 'I still need to complete the booking in Google Calendar. Please share (or confirm) your **interview title/role**, **full name**, **email**, and **chosen time**, or use the **"Schedule Interview"** button at the top of the page for instant confirmation.'
                  : 'Todavía no se registró el evento en Google Calendar. Por favor confirmame el **motivo/rol de la entrevista**, tu **nombre completo**, **correo** y **horario** (o usá el botón **"Agendar entrevista"** en el inicio para reservar al instante).';
              break;
            }

            finalText = candidateText;
            break;
          }

          // Preserve model's functionCall turn
          const modelParts =
            result?.candidates?.[0]?.content?.parts || calls.map((c) => ({ functionCall: c }));
          turnContents.push({ role: 'model', parts: modelParts });

          // Execute each requested calendar tool safely server-side
          const responseParts = [];
          for (const call of calls.slice(0, 2)) {
            toolsUsed.push(call.name);
            const toolOutput = await executeCalendarTool(call.name, call.args || {}, clientIp, {
              otpToken: activeOtpToken
            });

            if (toolOutput?._otpPending) {
              otpPending = toolOutput._otpPending;
              activeOtpToken = toolOutput._otpPending.otpToken;
            }
            if (call.name === 'book_interview' && toolOutput?.ok && toolOutput?.booking) {
              bookedInterview = toolOutput.booking;
              otpPending = null;
            }

            // Strip internal token before returning tool output to Gemini
            const safeToolOutput = { ...toolOutput };
            delete safeToolOutput._otpPending;

            responseParts.push({
              functionResponse: {
                name: call.name,
                response: safeToolOutput
              }
            });
          }

          turnContents.push({ role: 'user', parts: responseParts });
        }

        // 4. Layer 3 Security Guard: Output leakage check
        const validatedText = validateAssistantOutput(finalText, lang);

        const showCalendar =
          !bookedInterview &&
          !otpPending &&
          (toolsUsed.includes('check_availability') ||
            /\b(disponib|availab|horario|calendario|calendar|agenda|agendar|entrevista|interview|coordinar)\b/i.test(
              sanitizedText
            ));

        return res.status(200).json({
          response: validatedText,
          mode: 'ai',
          model: modelName,
          ...(toolsUsed.length > 0 ? { toolsUsed } : {}),
          ...(bookedInterview ? { booking: bookedInterview } : {}),
          ...(otpPending ? { otpPending } : {}),
          ...(showCalendar ? { showCalendar: true } : {}),
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
