import { createInterviewEvent, getLiveAvailability, validateBookingRequest } from './calendar.js';
import { isOtpEnabled, sendBookingOtp, verifyBookingOtp } from './emailVerification.js';

/**
 * Strict anti-spam booking rate limiter (separate from general chat rate limit):
 * Max 2 interview bookings per IP or per recruiter email within a 24-hour window.
 */
const BOOKING_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_BOOKINGS_PER_WINDOW = 2;
const bookingTracker = new Map();

export function checkBookingRateLimit(clientIp = 'unknown', email = '') {
  const now = Date.now();
  const keys = [`ip:${clientIp}`];
  const normEmail = String(email || '').trim().toLowerCase();
  if (normEmail) keys.push(`email:${normEmail}`);

  for (const key of keys) {
    const timestamps = (bookingTracker.get(key) || []).filter((ts) => now - ts < BOOKING_WINDOW_MS);
    if (timestamps.length >= MAX_BOOKINGS_PER_WINDOW) {
      return {
        allowed: false,
        error:
          'Alcanzaste el límite de reservas en las últimas 24 horas. Si necesitás reprogramar, escribile directamente a Carlos por WhatsApp o Email.'
      };
    }
  }
  return { allowed: true };
}

export function recordBookingAttempt(clientIp = 'unknown', email = '') {
  const now = Date.now();
  const keys = [`ip:${clientIp}`];
  const normEmail = String(email || '').trim().toLowerCase();
  if (normEmail) keys.push(`email:${normEmail}`);

  for (const key of keys) {
    const timestamps = (bookingTracker.get(key) || []).filter((ts) => now - ts < BOOKING_WINDOW_MS);
    timestamps.push(now);
    bookingTracker.set(key, timestamps);
  }
}

/**
 * MCP-compatible Function Declarations for Gemini (`@google/genai` tools).
 * Allows CharlyBot to query real-time anonymous free slots and book confirmed
 * interviews directly on Carlos's Google Calendar with Google Meet + email invites.
 */
export const CALENDAR_TOOL_DECLARATIONS = [
  {
    name: 'check_availability',
    description:
      'Checks Carlos Jesús real-time open interview slots for the upcoming business days (up to 10 business days / ~15 calendar days, Mon–Fri, 11:00–17:00 Argentina Time UTC-3). Returns ONLY anonymous free windows and exact day labels; never returns private calendar event names.',
    parameters: {
      type: 'OBJECT',
      properties: {
        businessDays: {
          type: 'INTEGER',
          description: 'Number of upcoming business days to check (1 to 10, default 10 for 2 weeks).'
        },
        durationMinutes: {
          type: 'INTEGER',
          description: 'Interview duration in minutes: 30 or 45 (default 30).'
        }
      }
    }
  },
  {
    name: 'send_verification_code',
    description:
      'Sends a 6-digit email verification OTP code to the recruiter email before creating the Google Calendar event (required when OTP verification is active). Call this once you have the chosen slot, interviewTitle, recruiterName, and recruiterEmail.',
    parameters: {
      type: 'OBJECT',
      properties: {
        startIso: {
          type: 'STRING',
          description: 'Exact start timestamp in ISO-8601 Argentina offset (-03:00), e.g. "2026-12-01T12:00:00-03:00".'
        },
        durationMinutes: {
          type: 'INTEGER',
          description: 'Interview duration: 30 or 45 minutes (default 30).'
        },
        interviewTitle: {
          type: 'STRING',
          description: 'Interview title/role, e.g. "Entrevista Full Stack", "Entrevista Frontend", "Entrevista AI Engineer".'
        },
        recruiterName: {
          type: 'STRING',
          description: 'Full name of the recruiter or interviewer.'
        },
        recruiterEmail: {
          type: 'STRING',
          description: 'Email address of the recruiter to verify.'
        }
      },
      required: ['startIso', 'interviewTitle', 'recruiterName', 'recruiterEmail']
    }
  },
  {
    name: 'book_interview',
    description:
      'Books a confirmed job interview on Carlos Jesús Google Calendar with an automatic Google Meet link and sends official calendar email invitations to both the recruiter and Carlos. NEVER pretend to book without calling this tool and receiving ok=true. If OTP verification is active, you MUST include the 6-digit otpCode the recruiter received via send_verification_code.',
    parameters: {
      type: 'OBJECT',
      properties: {
        startIso: {
          type: 'STRING',
          description:
            'Exact start timestamp in ISO-8601 Argentina offset (-03:00), e.g. "2026-12-01T12:00:00-03:00", taken from check_availability.'
        },
        durationMinutes: {
          type: 'INTEGER',
          description: 'Interview duration: 30 or 45 minutes (default 30).'
        },
        interviewTitle: {
          type: 'STRING',
          description:
            'Title or role for the calendar invite, e.g. "Entrevista Full Stack", "Entrevista Frontend", "Entrevista AI Engineer".'
        },
        recruiterName: {
          type: 'STRING',
          description: 'Full name of the recruiter or interviewer.'
        },
        recruiterEmail: {
          type: 'STRING',
          description: 'Valid email address of the recruiter to receive the Google Calendar invitation.'
        },
        otpCode: {
          type: 'STRING',
          description: '6-digit verification code provided by the recruiter (required when OTP is enabled).'
        },
        company: {
          type: 'STRING',
          description: 'Optional company name.'
        },
        notes: {
          type: 'STRING',
          description: 'Optional short note about the interview topic.'
        }
      },
      required: ['startIso', 'interviewTitle', 'recruiterName', 'recruiterEmail']
    }
  }
];

/**
 * Executes a Gemini calendar tool call with strict server-side validation,
 * DNS MX checks, optional Resend OTP verification, & rate limiting.
 */
export async function executeCalendarTool(
  toolName,
  args = {},
  clientIp = 'unknown',
  sessionContext = {}
) {
  if (toolName === 'check_availability') {
    const businessDays = Math.min(10, Math.max(1, Number(args?.businessDays) || 10));
    const durationMinutes = Number(args?.durationMinutes) === 45 ? 45 : 30;
    const avail = await getLiveAvailability({ businessDays, durationMinutes });
    return {
      source: avail.source,
      bookingEnabled: avail.bookingEnabled,
      otpRequired: avail.otpRequired,
      timezone: avail.timezone,
      window: avail.window.labelEs,
      durationMinutes: avail.durationMinutes,
      days: avail.days.map((d) => ({
        date: d.date,
        dayLabelEs: d.dayLabelEs,
        dayLabelEn: d.dayLabelEn,
        freeWindows: d.freeWindows.map((w) => w.labelArt),
        sampleSlotsIso: d.slots.slice(0, 10).map((s) => s.start)
      }))
    };
  }

  if (toolName === 'send_verification_code') {
    if (!isOtpEnabled()) {
      return {
        ok: true,
        otpRequired: false,
        message: 'La verificación OTP no es necesaria en este entorno. Podés llamar directamente a book_interview ahora.'
      };
    }

    const preCheck = validateBookingRequest({
      startIso: args?.startIso,
      durationMinutes: Number(args?.durationMinutes) === 45 ? 45 : 30,
      interviewTitle: args?.interviewTitle,
      recruiterName: args?.recruiterName,
      recruiterEmail: args?.recruiterEmail
    });
    if (!preCheck.ok) {
      return { ok: false, error: preCheck.error };
    }

    const slotLabel = `${preCheck.data.startIso.slice(0, 10)} · ${preCheck.data.startIso.slice(11, 16)}–${preCheck.data.endIso.slice(11, 16)} ART`;
    const otpRes = await sendBookingOtp({
      email: preCheck.data.recruiterEmail,
      recruiterName: preCheck.data.recruiterName,
      interviewTitle: preCheck.data.interviewTitle,
      slotLabel,
      clientIp
    });

    if (!otpRes.ok) {
      return {
        ok: false,
        code: otpRes.code,
        suggestion: otpRes.suggestion || null,
        error: otpRes.error
      };
    }

    return {
      ok: true,
      otpRequired: true,
      _otpPending: { otpToken: otpRes.otpToken, email: otpRes.email },
      message: `Se envió un código de verificación de 6 dígitos a ${otpRes.email} (válido por 10 min). Pedile al usuario ese código para finalizar la reserva en Google Calendar.`
    };
  }

  if (toolName === 'book_interview') {
    const rl = checkBookingRateLimit(clientIp, args?.recruiterEmail);
    if (!rl.allowed) {
      return { ok: false, error: rl.error };
    }

    if (isOtpEnabled()) {
      const otpCode = String(args?.otpCode || '').trim();
      const otpToken = sessionContext?.otpToken || '';
      if (!otpCode || !otpToken) {
        return {
          ok: false,
          code: 'otp_required',
          error:
            'Antes de agendar, debés verificar el correo del usuario llamando primero a send_verification_code y pidiéndole el código de 6 dígitos que recibió en su email.'
        };
      }
      const otpCheck = verifyBookingOtp({
        email: args?.recruiterEmail,
        code: otpCode,
        otpToken
      });
      if (!otpCheck.ok) {
        return { ok: false, code: 'invalid_otp', error: otpCheck.error };
      }
    }

    const result = await createInterviewEvent({
      startIso: args?.startIso,
      durationMinutes: Number(args?.durationMinutes) === 45 ? 45 : 30,
      interviewTitle: args?.interviewTitle || 'Entrevista laboral',
      recruiterName: args?.recruiterName,
      recruiterEmail: args?.recruiterEmail,
      company: args?.company || '',
      notes: args?.notes || ''
    });

    if (result.ok) {
      recordBookingAttempt(clientIp, args?.recruiterEmail);
      return {
        ok: true,
        message:
          'Entrevista agendada con éxito en Google Calendar con enlace de Google Meet. La invitación oficial suele llegar en 1 a 5 minutos (revisar Spam/Promociones). Si tras 5–7 minutos no llega, verificar el correo ingresado.',
        booking: {
          summary: result.booking.summary,
          startIso: result.booking.startIso,
          endIso: result.booking.endIso,
          durationMinutes: result.booking.durationMinutes,
          timezone: result.booking.timezone,
          meetLink: result.booking.meetLink,
          recruiterEmail: result.booking.recruiterEmail
        }
      };
    }

    return {
      ok: false,
      code: result.code || 'booking_failed',
      suggestion: result.suggestion || null,
      error: result.error
    };
  }

  return { ok: false, error: `Unknown tool: ${toolName}` };
}
