import { listSignedCvs } from './_lib/s3.js';
import { professionalData } from '../src/data/professionalData.js';

const LOCAL_FALLBACK_CV = [
  {
    key: 'local-default',
    fileName: 'Carlos-Jesus-CV.pdf',
    label: 'Carlos Jesús — Full Stack & AI CV',
    url: professionalData.personal.cvPath,
    size: 0,
    lastModified: null
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signedCvs = await listSignedCvs();
    if (signedCvs && signedCvs.length > 0) {
      return res.status(200).json({
        source: 's3',
        cvs: signedCvs
      });
    }

    return res.status(200).json({
      source: 'local',
      cvs: LOCAL_FALLBACK_CV
    });
  } catch (error) {
    console.error('[API /api/cv] S3 error, falling back to local CV:', error?.message);
    return res.status(200).json({
      source: 'local',
      cvs: LOCAL_FALLBACK_CV
    });
  }
}
