import { getLiveAvailability } from './_lib/calendar.js';

function getQueryParam(req, name) {
  if (req.query?.[name]) return String(req.query[name]);
  if (req.url && req.url.includes('?')) {
    const parsed = new URL(req.url, 'http://localhost');
    return parsed.searchParams.get(name) || '';
  }
  return '';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const durationParam = Number(getQueryParam(req, 'duration')) || 30;
  const daysParam = Math.min(10, Math.max(1, Number(getQueryParam(req, 'days')) || 10));
  const fresh = getQueryParam(req, 'fresh') === '1';

  res.setHeader(
    'Cache-Control',
    fresh ? 'no-store' : 'public, s-maxage=120, stale-while-revalidate=60'
  );

  try {
    const availability = await getLiveAvailability({
      businessDays: daysParam,
      durationMinutes: [30, 45].includes(durationParam) ? durationParam : 30,
      bypassCache: fresh
    });
    return res.status(200).json(availability);
  } catch (error) {
    console.error('[API /api/availability] Error:', error?.message);
    return res.status(500).json({ error: 'Failed to load availability.' });
  }
}
