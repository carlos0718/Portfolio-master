import { createInterviewEvent } from './lib/calendar.js';
import { checkBookingRateLimit, recordBookingAttempt } from './lib/calendarTools.js';

export default async function handler(req, res) {
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
    const {
      startIso,
      durationMinutes = 30,
      recruiterName,
      recruiterEmail,
      company = '',
      notes = '',
      website = '' // anti-bot honeypot (must stay empty)
    } = req.body || {};

    if (String(website || '').trim() !== '') {
      // Silently reject automated bot submissions
      return res.status(400).json({ error: 'Solicitud inválida.' });
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]?.trim()) ||
      req.socket?.remoteAddress ||
      'unknown';

    const rl = checkBookingRateLimit(clientIp, recruiterEmail);
    if (!rl.allowed) {
      return res.status(429).json({ error: rl.error });
    }

    const result = await createInterviewEvent({
      startIso,
      durationMinutes,
      recruiterName,
      recruiterEmail,
      company,
      notes
    });

    if (!result.ok) {
      return res.status(result.statusCode || 400).json({
        ok: false,
        code: result.code,
        error: result.error
      });
    }

    recordBookingAttempt(clientIp, recruiterEmail);

    return res.status(200).json({
      ok: true,
      booking: result.booking
    });
  } catch (error) {
    console.error('[API /api/book] Error:', error?.message);
    return res.status(500).json({
      ok: false,
      error: 'No se pudo crear la reserva en Google Calendar. Intentá nuevamente o escribile por WhatsApp.'
    });
  }
}
