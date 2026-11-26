/**
 * Google Calendar API v3 Client & Smart Recruiter Availability Engine
 *
 * Strictly server-side. NEVER exposes private event titles, descriptions,
 * or existing attendees to the browser or to the LLM.
 *
 * Uses native fetch (zero external Google SDK bloat) with OAuth2 Refresh Token
 * so the portfolio can BOTH read real-time availability AND create official
 * interview events with Google Meet + email invitations (`sendUpdates=all`).
 */

import { isOtpEnabled, verifyEmailDomainMx } from './emailVerification.js';

const CALENDAR_TIMEZONE = 'America/Argentina/Buenos_Aires';
const ART_OFFSET = '-03:00'; // Argentina has no DST (permanent UTC-3)
const WINDOW_START_HOUR = Number(process.env.AVAILABILITY_START_HOUR) || 11;
const WINDOW_END_HOUR = Number(process.env.AVAILABILITY_END_HOUR) || 17;
const DEFAULT_BUFFER_MINUTES = Number(process.env.CALENDAR_BUFFER_MINUTES) || 15;
const MIN_LEAD_TIME_MINUTES = 120; // At least 2h notice for same-day interviews
const MAX_ADVANCE_DAYS = 16;
const AVAILABILITY_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes fresh cache

const MEDICAL_KEYWORDS = [
  'turno',
  'medico',
  'doctor',
  'dra',
  'dr.',
  'clinica',
  'hospital',
  'gastro',
  'consulta medica',
  'odontolog',
  'dentista',
  'analisis',
  'laboratorio',
  'test de aire',
  'estudio medico',
  'estudios medicos',
  'radiografia',
  'ecografia',
  'kinesiolog',
  'oftalmolog',
  'dermatolog',
  'cardiolog',
  'vacuna',
  'salud'
];

const ENGLISH_CLASS_KEYWORDS = [
  'ef english',
  'ef live',
  'english live',
  'private class',
  'group class',
  'clase de ingles',
  'clases de ingles',
  'clase ingles',
  'english class',
  'english lesson',
  'teacher',
  'profesor de ingles',
  'profesora de ingles',
  'ingles',
  'english'
];

const INTERVIEW_OR_BUSY_KEYWORDS = [
  'entrevista',
  'interview',
  'recruiter',
  'reclutador',
  'rrhh',
  'hr ',
  'screening',
  'technical call',
  'live coding',
  'meet',
  '[busy]',
  '[ocupado]',
  'ocupado',
  'no disponible',
  'bloqueado'
];

// Personal habit markers created by Carlos himself that are flexible & non-blocking
const SELF_HABIT_DESCRIPTION_MARKERS = [
  'ancla:',
  'version minima',
  'curva de habitos',
  'cuenta como cumplida'
];

let tokenCache = { accessToken: null, expiresAt: 0 };
let eventsCache = { key: '', events: null, timestamp: 0 };

function normalizeForMatch(text = '') {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function getGoogleCalendarConfig() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN || '').trim();
  const calendarId = (process.env.GOOGLE_CALENDAR_ID || 'primary').trim();

  return {
    configured: Boolean(clientId && clientSecret && refreshToken),
    clientId,
    clientSecret,
    refreshToken,
    calendarId
  };
}

export function invalidateCalendarCache() {
  eventsCache = { key: '', events: null, timestamp: 0 };
}

async function getAccessToken() {
  const cfg = getGoogleCalendarConfig();
  if (!cfg.configured) return null;

  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }

  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    refresh_token: cfg.refreshToken,
    grant_type: 'refresh_token'
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Google OAuth token exchange failed (${res.status}): ${errText.slice(0, 180)}`);
  }

  const data = await res.json();
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) || 3500) * 1000
  };
  return tokenCache.accessToken;
}

/**
 * Determines whether a Google Calendar event should block recruiter availability.
 *
 * Carlos's rules:
 * - Events marked "Free" (`transparent`) or cancelled NEVER block.
 * - Self-created personal habit reminders (e.g. his own `🇬🇧 Inglés EF` / `✍️ Narración` blocks
 *   with `"Ancla:"` / `"Curva de hábitos"` and no external guests) DO NOT block.
 * - REAL blocking commitments ALWAYS block:
 *   1. Any event with external attendees or external organizer (interviews, booked EF classes, live workshops)
 *   2. Medical appointments
 *   3. Booked English classes (created by EF platform / external / non-habit)
 *   4. Interviews or explicit `[BUSY]` / `Ocupado` blocks (plus custom `CALENDAR_BLOCK_KEYWORDS`)
 */
export function isBlockingEvent(event) {
  if (!event || event.status === 'cancelled') return false;
  if (event.transparency === 'transparent') return false;

  // Ignore pure all-day banner events unless explicitly marked [BUSY] or Ocupado
  const isAllDay = Boolean(event.start?.date && !event.start?.dateTime);
  const summaryNorm = normalizeForMatch(event.summary || '');
  const descNorm = normalizeForMatch(event.description || '');
  const combinedNorm = `${summaryNorm} ${descNorm}`;

  if (isAllDay) {
    return (
      summaryNorm.includes('[busy]') ||
      summaryNorm.includes('[ocupado]') ||
      summaryNorm.includes('no disponible')
    );
  }

  // External attendees or external organizer = real commitment (interviews, EF invites, live events)
  const attendees = Array.isArray(event.attendees) ? event.attendees : [];
  const hasExternalAttendee = attendees.some(
    (a) => a && !a.self && a.responseStatus !== 'declined'
  );
  const selfDeclined = attendees.some((a) => a && a.self && a.responseStatus === 'declined');
  if (selfDeclined) return false;

  const isExternalOrganizer = Boolean(event.organizer && event.organizer.self !== true);
  if (hasExternalAttendee || isExternalOrganizer) {
    return true;
  }

  // Explicit manual block override always wins
  if (
    summaryNorm.includes('[busy]') ||
    summaryNorm.includes('[ocupado]') ||
    summaryNorm.includes('no disponible') ||
    summaryNorm.includes('bloqueado')
  ) {
    return true;
  }

  // Self-created personal habit blocks (marked with "Ancla:" / "Curva de hábitos" / "Versión mínima")
  // are flexible and non-blocking (including his self-created EF study reminders)
  const isSelfHabitBlock =
    SELF_HABIT_DESCRIPTION_MARKERS.some((marker) => descNorm.includes(marker)) ||
    summaryNorm.includes('narracion con gemini') ||
    summaryNorm.includes('lectura libre') ||
    summaryNorm.includes('lectura y comprension') ||
    summaryNorm.includes('tareas en casa') ||
    summaryNorm.includes('proyecto personal') ||
    summaryNorm.includes('estudio mongodb');

  if (isSelfHabitBlock) {
    return false;
  }

  // Check medical appointments
  if (MEDICAL_KEYWORDS.some((kw) => combinedNorm.includes(kw))) {
    return true;
  }

  // Check real English classes (e.g. booked from EF platform without "Ancla:" habit text)
  if (ENGLISH_CLASS_KEYWORDS.some((kw) => summaryNorm.includes(kw))) {
    return true;
  }

  // Check interviews & extra custom keywords from env var
  const extraKeywords = (process.env.CALENDAR_BLOCK_KEYWORDS || '')
    .split(',')
    .map((k) => normalizeForMatch(k.trim()))
    .filter(Boolean);

  if (
    INTERVIEW_OR_BUSY_KEYWORDS.some((kw) => summaryNorm.includes(kw)) ||
    extraKeywords.some((kw) => summaryNorm.includes(kw))
  ) {
    return true;
  }

  return false;
}

/**
 * Date/time helpers anchored strictly in Argentina time (UTC-3, no DST).
 */
function toArtParts(date) {
  const artMs = date.getTime() - 3 * 60 * 60 * 1000;
  const d = new Date(artMs);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    dayOfWeek: d.getUTCDay(), // 0 Sun .. 6 Sat
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes()
  };
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function makeArtIso(year, month, day, hour, minute = 0) {
  return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:00${ART_OFFSET}`;
}

function formatArtHHMM(ms) {
  const p = toArtParts(new Date(ms));
  return `${pad2(p.hour)}:${pad2(p.minute)}`;
}

const DAY_NAMES_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getUpcomingBusinessDates(now, count = 5) {
  const result = [];
  const baseArt = toArtParts(now);
  let cursorUtcNoon = Date.UTC(baseArt.year, baseArt.month - 1, baseArt.day, 12, 0, 0);

  let guard = 0;
  while (result.length < count && guard < 35) {
    guard++;
    const d = new Date(cursorUtcNoon);
    const dow = d.getUTCDay();
    if (dow >= 1 && dow <= 5) {
      result.push({
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        dayOfWeek: dow,
        dateStr: `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`
      });
    }
    cursorUtcNoon += 24 * 60 * 60 * 1000;
  }
  return result;
}

function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = sorted[i];
    if (curr.start <= prev.end) {
      prev.end = Math.max(prev.end, curr.end);
    } else {
      merged.push({ ...curr });
    }
  }
  return merged;
}

/**
 * Pure, testable availability computation from raw Google Calendar event items.
 * Returns strictly anonymous free windows and discrete bookable slots.
 */
export function computeAvailabilityFromEvents(
  rawEvents = [],
  {
    now = new Date(),
    businessDays = 5,
    durationMinutes = 30,
    bufferMinutes = DEFAULT_BUFFER_MINUTES,
    source = 'google_calendar'
  } = {}
) {
  const safeDuration = [30, 45, 60].includes(Number(durationMinutes))
    ? Number(durationMinutes)
    : 30;
  const safeBuffer = Math.max(0, Math.min(60, Number(bufferMinutes) || 0));
  const bufferMs = safeBuffer * 60 * 1000;
  const slotMs = safeDuration * 60 * 1000;
  const stepMs = 30 * 60 * 1000; // Clean :00 and :30 start times
  const minBookableMs = now.getTime() + MIN_LEAD_TIME_MINUTES * 60 * 1000;

  // Extract ONLY busy start/end timestamps from blocking events (titles dropped immediately)
  const busyIntervals = [];
  for (const ev of rawEvents) {
    if (!isBlockingEvent(ev)) continue;
    const startStr = ev.start?.dateTime;
    const endStr = ev.end?.dateTime;
    if (!startStr || !endStr) continue;
    const startMs = Date.parse(startStr);
    const endMs = Date.parse(endStr);
    if (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs > startMs) {
      busyIntervals.push({
        start: startMs - bufferMs,
        end: endMs + bufferMs
      });
    }
  }

  const mergedBusy = mergeIntervals(busyIntervals);
  const targetDates = getUpcomingBusinessDates(now, businessDays + 1);
  const days = [];

  for (const d of targetDates) {
    if (days.length >= businessDays) break;

    const winStartMs = Date.parse(makeArtIso(d.year, d.month, d.day, WINDOW_START_HOUR, 0));
    const winEndMs = Date.parse(makeArtIso(d.year, d.month, d.day, WINDOW_END_HOUR, 0));

    // Skip today completely if past end of booking window
    if (winEndMs <= minBookableMs) continue;

    // Effective start cannot be before minBookableMs (rounded up to next 30-min mark)
    let effectiveStartMs = winStartMs;
    if (minBookableMs > effectiveStartMs) {
      effectiveStartMs = Math.ceil(minBookableMs / stepMs) * stepMs;
    }

    if (effectiveStartMs + slotMs > winEndMs) continue;

    // Subtract merged busy intervals from [effectiveStartMs, winEndMs]
    let freeRanges = [{ start: effectiveStartMs, end: winEndMs }];
    for (const busy of mergedBusy) {
      if (busy.end <= effectiveStartMs || busy.start >= winEndMs) continue;
      const nextRanges = [];
      for (const fr of freeRanges) {
        if (busy.end <= fr.start || busy.start >= fr.end) {
          nextRanges.push(fr);
        } else {
          if (busy.start > fr.start) {
            nextRanges.push({ start: fr.start, end: busy.start });
          }
          if (busy.end < fr.end) {
            nextRanges.push({ start: busy.end, end: fr.end });
          }
        }
      }
      freeRanges = nextRanges;
    }

    // Keep only windows long enough for at least one slot
    const usableWindows = freeRanges.filter((r) => r.end - r.start >= slotMs);

    // Build clean 30-minute-aligned bookable slots
    const slots = [];
    for (const w of usableWindows) {
      let cursor = Math.ceil(w.start / stepMs) * stepMs;
      while (cursor + slotMs <= w.end) {
        const sParts = toArtParts(new Date(cursor));
        const eParts = toArtParts(new Date(cursor + slotMs));
        slots.push({
          start: makeArtIso(sParts.year, sParts.month, sParts.day, sParts.hour, sParts.minute),
          end: makeArtIso(eParts.year, eParts.month, eParts.day, eParts.hour, eParts.minute),
          labelArt: `${pad2(sParts.hour)}:${pad2(sParts.minute)}`
        });
        cursor += stepMs;
      }
    }

    const freeWindows = usableWindows.map((w) => {
      const sParts = toArtParts(new Date(w.start));
      const eParts = toArtParts(new Date(w.end));
      return {
        start: makeArtIso(sParts.year, sParts.month, sParts.day, sParts.hour, sParts.minute),
        end: makeArtIso(eParts.year, eParts.month, eParts.day, eParts.hour, eParts.minute),
        labelArt: `${formatArtHHMM(w.start)}–${formatArtHHMM(w.end)}`
      };
    });

    days.push({
      date: d.dateStr,
      dayLabelEs: `${DAY_NAMES_ES[d.dayOfWeek]} ${d.day} ${MONTH_NAMES_ES[d.month - 1]}`,
      dayLabelEn: `${DAY_NAMES_EN[d.dayOfWeek]}, ${MONTH_NAMES_EN[d.month - 1]} ${d.day}`,
      freeWindows,
      slots
    });
  }

  const summaryEs = days
    .filter((day) => day.freeWindows.length > 0)
    .map((day) => `• **${day.dayLabelEs}:** ${day.freeWindows.map((w) => w.labelArt).join(', ')} (ART)`)
    .join('\n');

  const summaryEn = days
    .filter((day) => day.freeWindows.length > 0)
    .map((day) => `• **${day.dayLabelEn}:** ${day.freeWindows.map((w) => w.labelArt).join(', ')} (ART)`)
    .join('\n');

  return {
    source,
    bookingEnabled: source === 'google_calendar',
    otpRequired: isOtpEnabled(),
    timezone: CALENDAR_TIMEZONE,
    utcOffset: ART_OFFSET,
    window: {
      startHour: WINDOW_START_HOUR,
      endHour: WINDOW_END_HOUR,
      labelEs: `Lunes a Viernes, ${pad2(WINDOW_START_HOUR)}:00–${pad2(WINDOW_END_HOUR)}:00 (Hora Argentina, UTC-3)`,
      labelEn: `Monday to Friday, ${pad2(WINDOW_START_HOUR)}:00–${pad2(WINDOW_END_HOUR)}:00 (Argentina Time, UTC-3)`
    },
    durationMinutes: safeDuration,
    bufferMinutes: safeBuffer,
    generatedAt: now.toISOString(),
    days,
    summary: {
      es: summaryEs || 'Sin horarios disponibles en los próximos días hábiles.',
      en: summaryEn || 'No open slots found in the upcoming business days.'
    }
  };
}

async function fetchUpcomingCalendarEvents({ daysAhead = 10, bypassCache = false } = {}) {
  const cfg = getGoogleCalendarConfig();
  if (!cfg.configured) return null;

  const cacheKey = `${cfg.calendarId}:${daysAhead}`;
  if (
    !bypassCache &&
    eventsCache.events &&
    eventsCache.key === cacheKey &&
    Date.now() - eventsCache.timestamp < AVAILABILITY_CACHE_TTL_MS
  ) {
    return eventsCache.events;
  }

  const accessToken = await getAccessToken();
  const now = new Date();
  const timeMin = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + (daysAhead + 4) * 24 * 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    timeMin,
    timeMax,
    maxResults: '250',
    timeZone: CALENDAR_TIMEZONE
  });

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    cfg.calendarId
  )}/events?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Google Calendar events.list failed (${res.status}): ${errText.slice(0, 180)}`);
  }

  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];

  eventsCache = {
    key: cacheKey,
    events: items,
    timestamp: Date.now()
  };
  return items;
}

export async function getLiveAvailability({
  businessDays = 5,
  durationMinutes = 30,
  bypassCache = false
} = {}) {
  const cfg = getGoogleCalendarConfig();
  if (!cfg.configured) {
    return computeAvailabilityFromEvents([], {
      businessDays,
      durationMinutes,
      source: 'default'
    });
  }

  try {
    const rawEvents = await fetchUpcomingCalendarEvents({
      daysAhead: Math.max(16, businessDays * 2 + 4),
      bypassCache
    });
    return computeAvailabilityFromEvents(rawEvents || [], {
      businessDays,
      durationMinutes,
      source: 'google_calendar'
    });
  } catch (error) {
    console.error('[Calendar] Live fetch failed, falling back to default window:', error?.message);
    return computeAvailabilityFromEvents([], {
      businessDays,
      durationMinutes,
      source: 'default'
    });
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateBookingRequest({
  startIso,
  durationMinutes = 30,
  interviewTitle = '',
  recruiterName = '',
  recruiterEmail = '',
  company = '',
  notes = ''
}) {
  const safeDuration = Number(durationMinutes);
  if (![30, 45].includes(safeDuration)) {
    return { ok: false, error: 'La duración permitida para entrevistas es 30 o 45 minutos.' };
  }

  const cleanTitle = String(interviewTitle || '').trim().slice(0, 100) || 'Entrevista laboral';

  const cleanName = String(recruiterName || '').trim().slice(0, 100);
  if (cleanName.length < 2) {
    return { ok: false, error: 'Por favor indicá tu nombre completo.' };
  }

  const cleanEmail = String(recruiterEmail || '').trim().toLowerCase().slice(0, 140);
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return { ok: false, error: 'Por favor ingresá un correo electrónico válido.' };
  }

  if (typeof startIso !== 'string' || !startIso.trim()) {
    return { ok: false, error: 'Falta la fecha y hora de inicio (startIso).' };
  }

  const startMs = Date.parse(startIso);
  if (!Number.isFinite(startMs)) {
    return { ok: false, error: 'Formato de fecha/hora inválido.' };
  }

  const nowMs = Date.now();
  if (startMs < nowMs + MIN_LEAD_TIME_MINUTES * 60 * 1000) {
    return {
      ok: false,
      error: 'El horario debe reservarse con al menos 2 horas de anticipación.'
    };
  }

  if (startMs > nowMs + MAX_ADVANCE_DAYS * 24 * 60 * 60 * 1000) {
    return {
      ok: false,
      error: `Solo se pueden agendar entrevistas dentro de los próximos ${MAX_ADVANCE_DAYS} días.`
    };
  }

  const endMs = startMs + safeDuration * 60 * 1000;
  const startArt = toArtParts(new Date(startMs));
  const endArt = toArtParts(new Date(endMs));

  if (startArt.dayOfWeek < 1 || startArt.dayOfWeek > 5) {
    return { ok: false, error: 'Las entrevistas se agendan únicamente de Lunes a Viernes.' };
  }

  const startMinutesOfDay = startArt.hour * 60 + startArt.minute;
  const endMinutesOfDay = endArt.hour * 60 + endArt.minute;
  const minAllowed = WINDOW_START_HOUR * 60;
  const maxAllowed = WINDOW_END_HOUR * 60;

  if (
    startArt.day !== endArt.day ||
    startMinutesOfDay < minAllowed ||
    endMinutesOfDay > maxAllowed
  ) {
    return {
      ok: false,
      error: `El horario debe estar entre ${pad2(WINDOW_START_HOUR)}:00 y ${pad2(
        WINDOW_END_HOUR
      )}:00 hora Argentina (UTC-3).`
    };
  }

  return {
    ok: true,
    data: {
      startMs,
      endMs,
      startIso: makeArtIso(
        startArt.year,
        startArt.month,
        startArt.day,
        startArt.hour,
        startArt.minute
      ),
      endIso: makeArtIso(endArt.year, endArt.month, endArt.day, endArt.hour, endArt.minute),
      durationMinutes: safeDuration,
      interviewTitle: cleanTitle,
      recruiterName: cleanName,
      recruiterEmail: cleanEmail,
      company: String(company || '').trim().slice(0, 100),
      notes: String(notes || '').trim().slice(0, 400)
    }
  };
}

/**
 * Re-checks live Google Calendar conflicts (bypassing cache) and inserts a real
 * Google Calendar event with Google Meet + email invitations (`sendUpdates=all`).
 */
export async function createInterviewEvent(payload) {
  const cfg = getGoogleCalendarConfig();
  if (!cfg.configured) {
    return {
      ok: false,
      statusCode: 503,
      code: 'calendar_not_configured',
      error:
        'La reserva directa en Google Calendar aún no está activada en el servidor. Podés coordinar el horario directo por WhatsApp o Email.'
    };
  }

  const validation = validateBookingRequest(payload);
  if (!validation.ok) {
    return { ok: false, statusCode: 400, code: 'invalid_request', error: validation.error };
  }

  const {
    startMs,
    endMs,
    startIso,
    endIso,
    durationMinutes,
    interviewTitle,
    recruiterName,
    recruiterEmail,
    company,
    notes
  } = validation.data;

  // Real DNS MX + typo check on recipient email before creating a calendar event
  const mxCheck = await verifyEmailDomainMx(recruiterEmail);
  if (!mxCheck.valid) {
    return {
      ok: false,
      statusCode: 400,
      code: mxCheck.reason || 'invalid_email_domain',
      suggestion: mxCheck.suggestion || null,
      error: mxCheck.error
    };
  }

  // Live double-check against Google Calendar (bypass cache to prevent double-booking)
  const rawEvents = await fetchUpcomingCalendarEvents({ daysAhead: MAX_ADVANCE_DAYS + 2, bypassCache: true });
  const bufferMs = DEFAULT_BUFFER_MINUTES * 60 * 1000;
  const hasConflict = (rawEvents || []).some((ev) => {
    if (!isBlockingEvent(ev)) return false;
    const evStart = Date.parse(ev.start?.dateTime || '');
    const evEnd = Date.parse(ev.end?.dateTime || '');
    if (!Number.isFinite(evStart) || !Number.isFinite(evEnd)) return false;
    return startMs < evEnd + bufferMs && endMs > evStart - bufferMs;
  });

  if (hasConflict) {
    return {
      ok: false,
      statusCode: 409,
      code: 'slot_unavailable',
      error: 'Ese horario acaba de ocuparse en la agenda de Carlos. Por favor elegí otro horario disponible.'
    };
  }

  const accessToken = await getAccessToken();
  const titleCompany = company ? ` (${company})` : '';
  const summary = `${interviewTitle} — ${recruiterName}${titleCompany} × Carlos Jesús`;
  const descriptionLines = [
    'Entrevista agendada desde el portfolio de Carlos Jesús (carlos.dev).',
    `Motivo / Rol: ${interviewTitle}`,
    `Recruiter / Contacto: ${recruiterName} (${recruiterEmail})`,
    company ? `Empresa: ${company}` : null,
    notes ? `Notas: ${notes}` : null
  ].filter(Boolean);

  const requestId = `portfolio-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const eventBody = {
    summary,
    description: descriptionLines.join('\n'),
    start: {
      dateTime: startIso,
      timeZone: CALENDAR_TIMEZONE
    },
    end: {
      dateTime: endIso,
      timeZone: CALENDAR_TIMEZONE
    },
    attendees: [
      {
        email: recruiterEmail,
        displayName: recruiterName
      }
    ],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 15 }
      ]
    }
  };

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    cfg.calendarId
  )}/events?conferenceDataVersion=1&sendUpdates=all`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventBody)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Google Calendar events.insert failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const created = await res.json();
  invalidateCalendarCache();

  const meetLink =
    created.hangoutLink ||
    created.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri ||
    '';

  return {
    ok: true,
    statusCode: 200,
    booking: {
      eventId: created.id,
      summary: created.summary,
      startIso,
      endIso,
      durationMinutes,
      timezone: CALENDAR_TIMEZONE,
      recruiterName,
      recruiterEmail,
      meetLink,
      htmlLink: created.htmlLink || ''
    }
  };
}
