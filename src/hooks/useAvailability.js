import { useCallback, useEffect, useState } from 'react';

const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires';

const CLIENT_DOMAIN_TYPOS = {
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
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'icloud.con': 'icloud.com',
  'live.con': 'live.com'
};

export function detectEmailTypo(email = '') {
  const clean = String(email || '').trim().toLowerCase();
  const atIdx = clean.lastIndexOf('@');
  if (atIdx <= 0) return null;
  const local = clean.slice(0, atIdx);
  const domain = clean.slice(atIdx + 1);
  const fixed = CLIENT_DOMAIN_TYPOS[domain];
  return fixed ? `${local}@${fixed}` : null;
}

export function getVisitorTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || ARGENTINA_TZ;
  } catch {
    return ARGENTINA_TZ;
  }
}

export function isDifferentFromArgentina(tz) {
  if (!tz) return false;
  return !tz.includes('Argentina') && tz !== 'America/Buenos_Aires';
}

export function formatSlotInTimezone(isoString, timeZone, locale = 'es-AR') {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(isoString));
  } catch {
    return '';
  }
}

export function useAvailability({ enabled = true, durationMinutes = 30, days = 10 } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAvailability = useCallback(
    async (fresh = false) => {
      setLoading(true);
      setError('');
      try {
        const qs = new URLSearchParams({
          duration: String(durationMinutes),
          days: String(days),
          ...(fresh ? { fresh: '1', t: String(Date.now()) } : {})
        });
        const res = await fetch(`/api/availability?${qs.toString()}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err?.message || 'Error');
      } finally {
        setLoading(false);
      }
    },
    [durationMinutes, days]
  );

  useEffect(() => {
    if (!enabled) return;
    fetchAvailability(false);
  }, [enabled, fetchAvailability]);

  return {
    availability: data,
    loading,
    error,
    refresh: () => fetchAvailability(true)
  };
}
