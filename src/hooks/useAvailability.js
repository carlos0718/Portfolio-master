import { useCallback, useEffect, useState } from 'react';

const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires';

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

export function useAvailability({ enabled = true, durationMinutes = 30 } = {}) {
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
          days: '5',
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
    [durationMinutes]
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
