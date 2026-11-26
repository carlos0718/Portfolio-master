import crypto from 'node:crypto';
import dns from 'node:dns/promises';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_OTP_SENDS_PER_HOUR = 4;
const otpSendTracker = new Map();

const COMMON_DOMAIN_TYPOS = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.com.ar': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'icloud.con': 'icloud.com',
  'live.con': 'live.com',
  'protonmial.com': 'protonmail.com'
};

export function suggestEmailTypo(email = '') {
  const clean = String(email || '').trim().toLowerCase();
  const atIndex = clean.lastIndexOf('@');
  if (atIndex <= 0) return null;
  const local = clean.slice(0, atIndex);
  const domain = clean.slice(atIndex + 1);
  const fixedDomain = COMMON_DOMAIN_TYPOS[domain];
  if (!fixedDomain) return null;
  return `${local}@${fixedDomain}`;
}

export function isValidEmailSyntax(email = '') {
  return EMAIL_REGEX.test(String(email || '').trim().toLowerCase());
}

/**
 * Verifies via native DNS MX lookup (with A-record fallback per RFC 5321)
 * that the recipient email domain actually exists and can receive mail.
 */
export async function verifyEmailDomainMx(email = '') {
  const clean = String(email || '').trim().toLowerCase();
  if (!EMAIL_REGEX.test(clean)) {
    return { valid: false, reason: 'invalid_syntax', error: 'Formato de correo inválido.' };
  }

  const typoSuggestion = suggestEmailTypo(clean);
  if (typoSuggestion) {
    return {
      valid: false,
      reason: 'domain_typo',
      suggestion: typoSuggestion,
      error: `El dominio parece tener un error de tipeo. ¿Quisiste escribir ${typoSuggestion}?`
    };
  }

  const domain = clean.slice(clean.lastIndexOf('@') + 1);
  if (domain === 'example.com' || domain === 'test.com' || domain.endsWith('.invalid')) {
    return {
      valid: false,
      reason: 'non_routable_domain',
      error: `El dominio "${domain}" no acepta correos reales. Usá tu correo laboral o personal.`
    };
  }

  try {
    const mxPromise = dns.resolveMx(domain);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DNS_TIMEOUT')), 2500)
    );
    const records = await Promise.race([mxPromise, timeoutPromise]);
    if (Array.isArray(records) && records.length > 0) {
      return { valid: true };
    }
  } catch (err) {
    // If DNS timed out transiently, don't block legitimate recruiters
    if (err?.message === 'DNS_TIMEOUT') {
      return { valid: true, skipped: true };
    }
    // RFC 5321 fallback: check if domain has an A record if MX is absent
    if (err?.code === 'ENODATA' || err?.code === 'ENOTFOUND') {
      try {
        const aRecords = await dns.resolve4(domain);
        if (Array.isArray(aRecords) && aRecords.length > 0 && err.code === 'ENODATA') {
          return { valid: true };
        }
      } catch {
        // fall through to invalid domain
      }
      return {
        valid: false,
        reason: 'no_mx_records',
        error: `El dominio "${domain}" no existe o no recibe correos. Revisá que tu email esté bien escrito.`
      };
    }
  }

  return { valid: true };
}

export function isOtpEnabled() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function getSigningSecret() {
  return (
    process.env.OTP_SIGNING_SECRET?.trim() ||
    process.env.ADMIN_UPLOAD_SECRET?.trim() ||
    process.env.GOOGLE_CLIENT_SECRET?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    'fallback-local-dev-secret'
  );
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(input) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function signPayload(encodedPayload) {
  return crypto
    .createHmac('sha256', getSigningSecret())
    .update(encodedPayload)
    .digest('base64url');
}

function hashCode(email, code) {
  return crypto
    .createHmac('sha256', getSigningSecret())
    .update(`${email.toLowerCase()}::${String(code).trim()}`)
    .digest('hex');
}

function checkOtpSendRateLimit(clientIp, email) {
  const now = Date.now();
  const keys = [`ip:${clientIp || 'unknown'}`, `email:${email.toLowerCase()}`];
  for (const k of keys) {
    const recent = (otpSendTracker.get(k) || []).filter((ts) => now - ts < OTP_RATE_WINDOW_MS);
    if (recent.length >= MAX_OTP_SENDS_PER_HOUR) {
      return {
        allowed: false,
        error: 'Se enviaron demasiados códigos de verificación en la última hora. Esperá unos minutos e intentá nuevamente.'
      };
    }
  }
  return { allowed: true };
}

function recordOtpSend(clientIp, email) {
  const now = Date.now();
  const keys = [`ip:${clientIp || 'unknown'}`, `email:${email.toLowerCase()}`];
  for (const k of keys) {
    const recent = (otpSendTracker.get(k) || []).filter((ts) => now - ts < OTP_RATE_WINDOW_MS);
    recent.push(now);
    otpSendTracker.set(k, recent);
  }
}

export function createStatelessOtpToken(email, code) {
  const normEmail = String(email).trim().toLowerCase();
  const payload = {
    e: normEmail,
    h: hashCode(normEmail, code),
    exp: Date.now() + OTP_TTL_MS
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const sig = signPayload(encoded);
  return `${encoded}.${sig}`;
}

export function verifyBookingOtp({ email, code, otpToken }) {
  const normEmail = String(email || '').trim().toLowerCase();
  const cleanCode = String(code || '').replace(/\s+/g, '');

  if (!/^\d{6}$/.test(cleanCode)) {
    return { ok: false, error: 'Ingresá el código numérico de 6 dígitos que recibiste en tu correo.' };
  }

  if (typeof otpToken !== 'string' || !otpToken.includes('.')) {
    return { ok: false, error: 'El token de verificación expiró o es inválido. Solicitá un nuevo código.' };
  }

  const [encoded, sig] = otpToken.split('.');
  if (!encoded || !sig) {
    return { ok: false, error: 'Token de verificación malformado.' };
  }

  const expectedSig = signPayload(encoded);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { ok: false, error: 'Token de verificación inválido.' };
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(encoded));
  } catch {
    return { ok: false, error: 'Token de verificación ilegible.' };
  }

  if (!payload.exp || Date.now() > payload.exp) {
    return { ok: false, error: 'El código expiró (válido por 10 minutos). Solicitá uno nuevo.' };
  }

  if (payload.e !== normEmail) {
    return {
      ok: false,
      error: 'El código fue generado para otro correo. Solicitá un nuevo código para este email.'
    };
  }

  const actualHash = Buffer.from(hashCode(normEmail, cleanCode), 'hex');
  const expectedHash = Buffer.from(payload.h, 'hex');
  if (
    actualHash.length !== expectedHash.length ||
    !crypto.timingSafeEqual(actualHash, expectedHash)
  ) {
    return { ok: false, error: 'Código incorrecto. Revisá tu bandeja de entrada e intentá nuevamente.' };
  }

  return { ok: true };
}

/**
 * Validates recipient email (syntax + typo + live DNS MX), generates a 6-digit OTP,
 * and sends a clean branded verification email via Resend (`mentoria-dev.tech`).
 */
export async function sendBookingOtp({
  email,
  recruiterName = '',
  interviewTitle = 'Entrevista laboral',
  slotLabel = '',
  clientIp = 'unknown'
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      statusCode: 503,
      code: 'otp_not_configured',
      error: 'RESEND_API_KEY no está configurada en el servidor.'
    };
  }

  const cleanEmail = String(email || '').trim().toLowerCase();
  const mxCheck = await verifyEmailDomainMx(cleanEmail);
  if (!mxCheck.valid) {
    return {
      ok: false,
      statusCode: 400,
      code: mxCheck.reason,
      suggestion: mxCheck.suggestion || null,
      error: mxCheck.error
    };
  }

  const rl = checkOtpSendRateLimit(clientIp, cleanEmail);
  if (!rl.allowed) {
    return { ok: false, statusCode: 429, code: 'rate_limited', error: rl.error };
  }

  const code = String(crypto.randomInt(100000, 1000000));
  const otpToken = createStatelessOtpToken(cleanEmail, code);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || 'Carlos Jesús <agenda@mentoria-dev.tech>';

  const safeName = String(recruiterName || '').trim() || 'Hola';
  const safeTitle = String(interviewTitle || 'Entrevista laboral').trim();
  const safeSlot = String(slotLabel || '').trim();

  const html = `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#09090b;color:#e4e4e7;padding:32px 20px;">
      <div style="max-width:480px;margin:0 auto;background:#111116;border:1px solid #27272a;border-radius:16px;padding:28px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#22d3ee;font-family:monospace;">
          carlos.dev · Verificación de correo
        </p>
        <h2 style="margin:0 0 12px;font-size:20px;color:#ffffff;">
          Tu código para confirmar la entrevista
        </h2>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#a1a1aa;">
          ${safeName}, ingresá este código de 6 dígitos para validar tu correo y recibir la invitación oficial de Google Calendar con Google Meet:
        </p>
        <div style="background:#09090b;border:1px solid #22d3ee55;border-radius:12px;padding:18px;text-align:center;margin:0 0 18px;">
          <span style="font-family:monospace;font-size:32px;font-weight:700;letter-spacing:0.28em;color:#67e8f9;">
            ${code}
          </span>
        </div>
        ${
          safeSlot
            ? `<p style="margin:0 0 12px;font-size:13px;color:#d4d4d8;"><strong>Motivo:</strong> ${safeTitle}<br/><strong>Horario:</strong> ${safeSlot}</p>`
            : ''
        }
        <p style="margin:0;font-size:12px;color:#71717a;">
          Este código vence en 10 minutos. Si no solicitaste esta entrevista, podés ignorar este mensaje.
        </p>
      </div>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [cleanEmail],
      reply_to: 'cajs0718@gmail.com',
      subject: `Código ${code} — Confirmá tu entrevista con Carlos Jesús`,
      html
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[Resend OTP] Send failed:', res.status, errText.slice(0, 200));
    return {
      ok: false,
      statusCode: 502,
      code: 'resend_failed',
      error: 'No se pudo enviar el código de verificación en este momento. Verificá el correo o intentá nuevamente.'
    };
  }

  recordOtpSend(clientIp, cleanEmail);

  return {
    ok: true,
    otpToken,
    expiresInMinutes: 10,
    email: cleanEmail
  };
}
