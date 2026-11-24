/**
 * 3-Layer Anti-Prompt-Injection & Strict Topic Scope Guardrails
 *
 * Layer 1: Deterministic input normalization, injection/jailbreak/extraction detection,
 *          and obvious off-topic filtering BEFORE calling Gemini.
 * Layer 2: Conversation history sanitization (prevents history poisoning & role mismatch)
 *          and XML sandboxing (<user_query>) for untrusted input.
 * Layer 3: Output leakage validation before returning the response to the client.
 */

export const MAX_MESSAGE_LENGTH = 600;
export const MAX_HISTORY_TURNS = 8;

const SPANISH_HINT_REGEX =
  /[áéíóúñ¿¡]|\b(hola|que|qué|como|cómo|donde|dónde|cual|cuál|cuanto|cuánto|experiencia|estudios|estudiando|universidad|carrera|certificados|cursos|tecnologias|tecnologías|sueldo|salario|pretension|pretensión|disponibilidad|remoto|contacto|proyectos|trabajo|trabaja|trabajó|habilidades|sobre|carlos|cv|curriculum|currículum|ignora|instrucciones|actua|actúa|dame|escribe|escribeme|escríbeme)\b/i;

export function detectLanguage(text = '') {
  if (!text || typeof text !== 'string') return 'es';
  return SPANISH_HINT_REGEX.test(text) ? 'es' : 'en';
}

export function normalizeText(raw = '') {
  if (typeof raw !== 'string') return '';
  return raw
    .normalize('NFKC')
    // Remove zero-width / bidi override / invisible characters commonly used to evade filters
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '')
    // Strip ASCII control characters except newlines & tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

const INJECTION_PATTERNS = [
  // Instruction override (EN & ES)
  /\b(ignore|disregard|forget|override|bypass|skip)\b.{0,45}\b(previous|prior|above|all|system|initial|original|earlier)\b.{0,30}\b(instructions?|prompts?|rules?|directions?|guidelines?|constraints?)\b/i,
  /\b(ignora|ignorá|olvida|olvidá|descarta|anula|saltea|salta)\b.{0,45}\b(instrucciones|reglas|indicaciones|prompt|sistema|todo lo anterior|anteriores)\b/i,
  /\b(new|updated|real)\s+(system\s+)?(instructions?|rules?|prompt)\s*:/i,
  /\bnuevas?\s+(instrucciones|reglas)\s*:/i,

  // Persona / Role hijacking & jailbreaks
  /\b(act|behave|respond|pretend|roleplay|play)\s+(as|like)\s+(a|an|my|the)?\s*(?!recruiter|reclutador|interviewer|entrevistador)/i,
  /\b(act[uú]a|comportate|compórtate|finge|simula|simulá|hazte pasar)\s+(como|que eres|que sos)\b/i,
  /\b(you are now|from now on you are|ahora eres|a partir de ahora eres|a partir de ahora sos)\b/i,
  /\b(jailbreak|developer\s*mode|modo\s*desarrollador|god\s*mode|unrestricted\s*mode|do\s*anything\s*now|\bDAN\b)\b/i,

  // System prompt / secret extraction
  /\b(reveal|show|print|output|dump|repeat|leak|expose|tell me|give me)\b.{0,35}\b(system\s*prompt|hidden\s*prompt|initial\s*prompt|internal\s*instructions?|your\s*instructions?|your\s*rules?|api\s*key|env|secrets?)\b/i,
  /\b(muestra|mostrá|muéstrame|mostrame|revela|revelá|dime|decime|imprime|imprimí|repite|repetí|copia|copiá)\b.{0,35}\b(system\s*prompt|prompt\s*(del\s*sistema|inicial|oculto)|tus\s*instrucciones|tus\s*reglas|clave\s*api|api\s*key|variables\s*de\s*entorno)\b/i,
  /\b(GEMINI_API_KEY|GITHUB_TOKEN|REACT_APP_|process\.env)\b/i,

  // Delimiter / fake role injection
  /(<\|im_start\|>|<\|im_end\|>|<\|system\|>|<\|assistant\|>|<\/?user_query>|<\/?system>|<\/?instructions?>)/i,
  /^\s*(###\s*system|\[system\]|system\s*:|assistant\s*:)/im,

  // Encoding evasion attempts
  /\b(base64|rot13|hex\s*decode|decode\s*this|decodifica|decodificá)\b.{0,40}\b(execute|follow|run|instrucciones|instructions|prompt)\b/i
];

// Clearly unrelated tasks when no portfolio/career/academic signal is present
const PORTFOLIO_SIGNAL_REGEX =
  /\b(carlos|charly|charlybot|jesus|jesús|experiencia|experience|trabajo|trabajos|work|job|role|rol|puesto|empresa|company|globons|istea|marfrig|rockstar|bief|proyecto|proyectos|project|projects|github|repo|stack|tecnolog|tech|skill|habilidad|frontend|backend|fullstack|full-stack|full stack|react|react\s+native|expo|next\.?js|node|dotnet|\.net|c#|python|sql|postgres|supabase|rls|docker|aws|s3|gcp|ia|ai|inteligencia artificial|gemini|claude|n8n|automatiz|cuotify|quotify|rocky-spec|kronos|kitchen|rappi|e-learning|elearning|salario|salary|sueldo|pretensi|rate|usd|ars|dolar|dólar|remoto|remote|hibrido|híbrido|hybrid|disponib|availab|cv|resume|curriculum|currículum|descargar|download|contact|contacto|email|mail|linkedin|whatsapp|estudio|estudios|estudia|estudiando|study|studying|education|educaci|academic|académic|universidad|university|utn|kennedy|\buk\b|tecnicatura|carrera|degree|certificad|certificate|curso|cursos|course|bootcamp|taller|workshop|coderhouse|nucba|cac|mentor|mentoring|idioma|ingles|inglés|english|spanish|arquitectura|legacy|wcag|accesibilidad|hola|hello|hi|hey|buenas|perfil|profile|ayuda|help)\b/i;

// Explicit off-topic task requests blocked unconditionally (even if they mention a tech like Python/React)
const STRICT_OFF_TOPIC_TASKS = [
  /\b(escribe|escribí|escribeme|escríbeme|write|generate|create|hazme|haceme|programame)\s+(un|una|a|an|me)?\s*(c[oó]digo|script|programa|ensayo|essay|tarea|homework|bot\s+de\s+scraping|scraper|malware|exploit|sql\s+injection)\b/i
];

const OFF_TOPIC_PATTERNS = [
  /\b(receta|recipe|cocinar|cook|pizza|empanada|horoscopo|horóscopo|horoscope|chiste|joke|poema|poem|cuento|story|cancion|canción|song|letra|lyrics)\b/i,
  /\b(quien\s+gan[oó]|who\s+won|mundial|world\s+cup|partido|clima|weather|pron[oó]stico|noticias|news|pol[ií]tica|politics|presidente|president|elecciones|bitcoin|cripto|crypto|acciones|stocks|apuesta|betting|diagn[oó]stico\s+m[eé]dico|receta\s+m[eé]dica)\b/i
];

export function getScopeRefusalMessage(lang = 'es', isInjection = false) {
  if (lang === 'en') {
    if (isInjection) {
      return 'I\'m CharlyBot and can only act as Carlos Jesús\'s professional assistant, answering questions strictly about his work experience, technical skills, projects, and academic background (past and current). How can I help you evaluate his profile?';
    }
    return 'I\'m CharlyBot, specialized exclusively in Carlos Jesús\'s work experience and academic background (past and current studies, certifications, projects, tech stack, and availability). Feel free to ask anything about his professional profile!';
  }

  if (isInjection) {
    return 'Soy CharlyBot y solo puedo operar como el asistente profesional de Carlos Jesús, respondiendo consultas estrictamente relacionadas con su experiencia laboral, proyectos, stack técnico y formación académica (pasada y actual). ¿Qué te gustaría saber sobre su perfil?';
  }
  return 'Soy CharlyBot y estoy enfocado exclusivamente en la experiencia laboral y la formación académica (pasada y actual) de Carlos Jesús — incluyendo sus proyectos, tecnologías, certificaciones, disponibilidad y contacto. ¡Preguntame lo que necesites sobre su perfil profesional!';
}

export function inspectUserInput(rawMessage) {
  if (typeof rawMessage !== 'string') {
    return {
      safe: false,
      statusCode: 400,
      error: 'Invalid message format.'
    };
  }

  const sanitizedText = normalizeText(rawMessage);
  const lang = detectLanguage(sanitizedText);

  if (!sanitizedText) {
    return {
      safe: false,
      statusCode: 400,
      error: lang === 'es' ? 'El mensaje no puede estar vacío.' : 'Message cannot be empty.'
    };
  }

  if (sanitizedText.length > MAX_MESSAGE_LENGTH) {
    return {
      safe: false,
      statusCode: 400,
      error:
        lang === 'es'
          ? `El mensaje es demasiado largo (máximo ${MAX_MESSAGE_LENGTH} caracteres).`
          : `Message is too long (maximum ${MAX_MESSAGE_LENGTH} characters).`
    };
  }

  // Layer 1A: Prompt injection / jailbreak / secret extraction detection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitizedText)) {
      return {
        safe: false,
        blocked: true,
        blockedReason: 'prompt_injection',
        lang,
        sanitizedText,
        refusalMessage: getScopeRefusalMessage(lang, true)
      };
    }
  }

  // Layer 1B: Unconditional off-topic task requests (e.g., "write me a Python scraper")
  for (const pattern of STRICT_OFF_TOPIC_TASKS) {
    if (pattern.test(sanitizedText)) {
      return {
        safe: false,
        blocked: true,
        blockedReason: 'off_topic',
        lang,
        sanitizedText,
        refusalMessage: getScopeRefusalMessage(lang, false)
      };
    }
  }

  // Layer 1C: Obvious off-topic filter when no portfolio/career/academic signal is present
  const hasPortfolioSignal = PORTFOLIO_SIGNAL_REGEX.test(sanitizedText);
  if (!hasPortfolioSignal) {
    for (const pattern of OFF_TOPIC_PATTERNS) {
      if (pattern.test(sanitizedText)) {
        return {
          safe: false,
          blocked: true,
          blockedReason: 'off_topic',
          lang,
          sanitizedText,
          refusalMessage: getScopeRefusalMessage(lang, false)
        };
      }
    }
  }

  return {
    safe: true,
    lang,
    sanitizedText
  };
}

/**
 * Layer 2A: Sanitize conversation history from client
 * - Drops error/welcome/system messages
 * - Drops poisoned entries matching injection patterns
 * - Enforces strict user <-> model alternation starting with user and ending with model
 *   (because the current incoming user message will be appended next)
 */
export function sanitizeHistory(conversationHistory = []) {
  if (!Array.isArray(conversationHistory)) return [];

  const cleaned = [];

  for (const item of conversationHistory.slice(-(MAX_HISTORY_TURNS * 2))) {
    if (!item || typeof item.content !== 'string') continue;
    if (item.role !== 'user' && item.role !== 'assistant') continue;
    if (item.isWelcome || item.id === 'welcome') continue;

    const text = normalizeText(item.content).slice(0, MAX_MESSAGE_LENGTH);
    if (!text) continue;

    // Prevent history poisoning via fabricated prior turns
    const isPoisoned = INJECTION_PATTERNS.some((pattern) => pattern.test(text));
    if (isPoisoned) continue;

    const geminiRole = item.role === 'user' ? 'user' : 'model';

    // Gemini history MUST start with a 'user' turn
    if (cleaned.length === 0 && geminiRole !== 'user') continue;

    // Enforce strict alternation: merge or skip consecutive identical roles
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === geminiRole) {
      if (geminiRole === 'user') {
        cleaned[cleaned.length - 1].parts[0].text += `\n${text}`;
      }
      continue;
    }

    cleaned.push({
      role: geminiRole,
      parts: [
        {
          text: geminiRole === 'user' ? wrapUserMessage(text) : text
        }
      ]
    });
  }

  // History passed before the new user message must end on 'model' so the new 'user' turn alternates properly
  while (cleaned.length > 0 && cleaned[cleaned.length - 1].role !== 'model') {
    cleaned.pop();
  }

  return cleaned.slice(-MAX_HISTORY_TURNS);
}

/**
 * Layer 2B: XML delimiter sandboxing for untrusted user messages
 */
export function wrapUserMessage(cleanMessage) {
  const escaped = cleanMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<user_query>\n${escaped}\n</user_query>`;
}

const OUTPUT_LEAK_PATTERNS = [
  /SECURITY_POLICY/i,
  /STRICT_TOPIC_SCOPE/i,
  /CRITICAL INSTRUCTIONS:/i,
  /<\/?user_query>/i,
  /GEMINI_API_KEY/i,
  /GITHUB_TOKEN/i,
  /AIza[0-9A-Za-z_-]{20,}/
];

/**
 * Layer 3: Output leakage check
 */
export function validateAssistantOutput(text = '', lang = 'es') {
  const normalized = typeof text === 'string' ? text.trim() : '';
  if (!normalized) {
    return getScopeRefusalMessage(lang, false);
  }

  for (const pattern of OUTPUT_LEAK_PATTERNS) {
    if (pattern.test(normalized)) {
      return getScopeRefusalMessage(lang, true);
    }
  }

  return normalized;
}
