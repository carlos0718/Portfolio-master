import { createInterviewEvent, validateBookingRequest } from './_lib/calendar.js';
import { checkBookingRateLimit, recordBookingAttempt } from './_lib/calendarTools.js';
import { isOtpEnabled, sendBookingOtp, verifyBookingOtp } from './_lib/emailVerification.js';

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
      action = 'book',
      startIso,
      durationMinutes = 30,
      interviewTitle = '',
      recruiterName,
      recruiterEmail,
      company = '',
      notes = '',
      otpCode = '',
      otpToken = '',
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

    // Step 1: Send 6-digit email verification OTP via Resend
    if (action === 'sendOtp') {
      const preCheck = validateBookingRequest({
        startIso,
        durationMinutes,
        interviewTitle,
        recruiterName,
        recruiterEmail,
        company,
        notes
      });
      if (!preCheck.ok) {
        return res.status(400).json({ ok: false, error: preCheck.error });
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
        return res.status(otpRes.statusCode || 400).json({
          ok: false,
          code: otpRes.code,
          suggestion: otpRes.suggestion || null,
          error: otpRes.error
        });
      }

      return res.status(200).json({
        ok: true,
        otpToken: otpRes.otpToken,
        expiresInMinutes: otpRes.expiresInMinutes,
        email: otpRes.email
      });
    }

    // Step 2: Confirm & create Google Calendar event
    const rl = checkBookingRateLimit(clientIp, recruiterEmail);
    if (!rl.allowed) {
      return res.status(429).json({ error: rl.error });
    }

    if (isOtpEnabled()) {
      const otpCheck = verifyBookingOtp({
        email: recruiterEmail,
        code: otpCode,
        otpToken
      });
      if (!otpCheck.ok) {
        return res.status(400).json({
          ok: false,
          code: 'invalid_otp',
          error: otpCheck.error
        });
      }
    }

    const result = await createInterviewEvent({
      startIso,
      durationMinutes,
      interviewTitle,
      recruiterName,
      recruiterEmail,
      company,
      notes
    });

    if (!result.ok) {
      return res.status(result.statusCode || 400).json({
        ok: false,
        code: result.code,
        suggestion: result.suggestion || null,
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
