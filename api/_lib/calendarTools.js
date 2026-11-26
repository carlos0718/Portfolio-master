import { createInterviewEvent, getLiveAvailability } from './calendar.js';

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
      'Checks Carlos Jesús real-time open interview slots for the upcoming business days (Mon–Fri, 11:00–17:00 Argentina Time UTC-3). Returns ONLY anonymous free windows and 30/45-min slots; never returns private calendar event names.',
    parameters: {
      type: 'OBJECT',
      properties: {
        businessDays: {
          type: 'INTEGER',
          description: 'Number of upcoming business days to check (1 to 7, default 5).'
        },
        durationMinutes: {
          type: 'INTEGER',
          description: 'Interview duration in minutes: 30 or 45 (default 30).'
        }
      }
    }
  },
  {
    name: 'book_interview',
    description:
      'Books a confirmed job interview on Carlos Jesús Google Calendar with an automatic Google Meet link and sends official calendar email invitations to both the recruiter and Carlos. ONLY call this tool AFTER the recruiter has explicitly chosen a free slot AND provided their name and email address AND confirmed they want to book.',
    parameters: {
      type: 'OBJECT',
      properties: {
        startIso: {
          type: 'STRING',
          description:
            'Exact start timestamp in ISO-8601 Argentina offset (-03:00), e.g. "2026-11-26T15:00:00-03:00", taken from check_availability.'
        },
        durationMinutes: {
          type: 'INTEGER',
          description: 'Interview duration: 30 or 45 minutes (default 30).'
        },
        recruiterName: {
          type: 'STRING',
          description: 'Full name of the recruiter or interviewer.'
        },
        recruiterEmail: {
          type: 'STRING',
          description: 'Valid email address of the recruiter to receive the Google Calendar invitation.'
        },
        company: {
          type: 'STRING',
          description: 'Optional company name or role being discussed.'
        },
        notes: {
          type: 'STRING',
          description: 'Optional short note about the interview topic.'
        }
      },
      required: ['startIso', 'recruiterName', 'recruiterEmail']
    }
  }
];

/**
 * Executes a Gemini calendar tool call with strict server-side validation & rate limiting.
 */
export async function executeCalendarTool(toolName, args = {}, clientIp = 'unknown') {
  if (toolName === 'check_availability') {
    const businessDays = Math.min(7, Math.max(1, Number(args?.businessDays) || 5));
    const durationMinutes = Number(args?.durationMinutes) === 45 ? 45 : 30;
    const avail = await getLiveAvailability({ businessDays, durationMinutes });
    return {
      source: avail.source,
      bookingEnabled: avail.bookingEnabled,
      timezone: avail.timezone,
      window: avail.window.labelEs,
      durationMinutes: avail.durationMinutes,
      days: avail.days.map((d) => ({
        date: d.date,
        dayLabelEs: d.dayLabelEs,
        dayLabelEn: d.dayLabelEn,
        freeWindows: d.freeWindows.map((w) => w.labelArt),
        sampleSlotsIso: d.slots.slice(0, 8).map((s) => s.start)
      }))
    };
  }

  if (toolName === 'book_interview') {
    const rl = checkBookingRateLimit(clientIp, args?.recruiterEmail);
    if (!rl.allowed) {
      return { ok: false, error: rl.error };
    }

    const result = await createInterviewEvent({
      startIso: args?.startIso,
      durationMinutes: Number(args?.durationMinutes) === 45 ? 45 : 30,
      recruiterName: args?.recruiterName,
      recruiterEmail: args?.recruiterEmail,
      company: args?.company || '',
      notes: args?.notes || ''
    });

    if (result.ok) {
      recordBookingAttempt(clientIp, args?.recruiterEmail);
      return {
        ok: true,
        message: 'Entrevista agendada con éxito. Se envió la invitación por email con enlace de Google Meet a ambos correos.',
        booking: {
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
      error: result.error
    };
  }

  return { ok: false, error: `Unknown tool: ${toolName}` };
}
