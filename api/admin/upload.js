import crypto from 'node:crypto';
import { checkRateLimit } from '../lib/rateLimit.js';
import {
  deleteObjectFromS3,
  getS3Config,
  listSignedCertificates,
  listSignedCvs,
  sanitizeFilename,
  uploadBufferToS3
} from '../lib/s3.js';

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB safe ceiling for Vercel Serverless

const ALLOWED_MIME_TYPES = {
  cv: {
    'application/pdf': '.pdf'
  },
  certificate: {
    'application/pdf': '.pdf',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp'
  }
};

function verifyAdminSecret(req) {
  const expected = process.env.ADMIN_UPLOAD_SECRET?.trim();
  if (!expected || expected.length < 8) {
    return {
      ok: false,
      status: 503,
      error: 'ADMIN_UPLOAD_SECRET is not configured on the server (min 8 chars).'
    };
  }

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const provided = match ? match[1].trim() : '';

  if (!provided) {
    return { ok: false, status: 401, error: 'Missing Authorization Bearer token.' };
  }

  const expectedBuf = Buffer.from(expected, 'utf8');
  const providedBuf = Buffer.from(provided, 'utf8');

  if (expectedBuf.length !== providedBuf.length) {
    return { ok: false, status: 401, error: 'Invalid admin token.' };
  }

  const isMatch = crypto.timingSafeEqual(expectedBuf, providedBuf);
  if (!isMatch) {
    return { ok: false, status: 401, error: 'Invalid admin token.' };
  }

  return { ok: true };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit admin endpoint to prevent brute-force guessing
  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp =
    (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]?.trim()) ||
    req.socket?.remoteAddress ||
    'unknown';
  const rl = checkRateLimit(`admin:${clientIp}`);
  if (!rl.allowed) {
    return res.status(429).json({
      error: 'Too many requests. Try again later.',
      retryAfter: rl.retryAfter
    });
  }

  // Authenticate strictly via timing-safe server secret
  const auth = verifyAdminSecret(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  if (!getS3Config().configured) {
    return res.status(503).json({ error: 'AWS S3 credentials are not configured on the server.' });
  }

  try {
    const { action = 'upload' } = req.body || {};

    // List current files in S3 for the admin dashboard
    if (action === 'list') {
      const [cvs, certificates] = await Promise.all([
        listSignedCvs().catch(() => []),
        listSignedCertificates().catch(() => [])
      ]);
      return res.status(200).json({ ok: true, cvs: cvs || [], certificates: certificates || [] });
    }

    // Delete a specific file in S3 (only root/cv PDFs or certificates/*)
    if (action === 'delete') {
      const { key } = req.body || {};
      if (typeof key !== 'string' || !key || key.includes('..') || key.startsWith('/')) {
        return res.status(400).json({ error: 'Invalid S3 object key.' });
      }
      await deleteObjectFromS3(key);
      return res.status(200).json({ ok: true, deleted: key });
    }

    // Upload CV or Certificate
    const { target, fileName, contentType, base64Data, metadata = {} } = req.body || {};

    if (target !== 'cv' && target !== 'certificate') {
      return res.status(400).json({ error: 'target must be "cv" or "certificate".' });
    }

    const allowedForTarget = ALLOWED_MIME_TYPES[target];
    if (!allowedForTarget[contentType]) {
      return res.status(400).json({
        error: `Unsupported file type (${contentType}) for ${target}.`
      });
    }

    if (typeof base64Data !== 'string' || !base64Data) {
      return res.status(400).json({ error: 'Missing base64 file content.' });
    }

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length === 0 || buffer.length > MAX_FILE_BYTES) {
      return res.status(400).json({
        error: `File size must be between 1 byte and ${MAX_FILE_BYTES / (1024 * 1024)} MB.`
      });
    }

    const ext = allowedForTarget[contentType];
    let safeName = sanitizeFilename(fileName || `${target}-${Date.now()}${ext}`);
    if (!safeName.toLowerCase().endsWith(ext) && !(ext === '.jpg' && safeName.toLowerCase().endsWith('.jpeg'))) {
      safeName = `${safeName.replace(/\.[^.]+$/, '')}${ext}`;
    }

    const s3Key = target === 'certificate' ? `certificates/${safeName}` : safeName;

    await uploadBufferToS3({
      key: s3Key,
      buffer,
      contentType,
      metadata: target === 'certificate' ? metadata : {}
    });

    return res.status(200).json({
      ok: true,
      key: s3Key,
      target,
      size: buffer.length
    });
  } catch (error) {
    console.error('[API /api/admin/upload] Error:', error?.message);
    return res.status(500).json({ error: 'Failed to process S3 operation.' });
  }
}
