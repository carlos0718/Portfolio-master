import crypto from 'node:crypto';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { certificatesData } from '../../src/data/certificatesData.js';
import {
  deleteObjectFromS3,
  getS3Config,
  listSignedCertificates,
  listSignedCvs,
  sanitizeFilename,
  updateCertificateMetadataInS3,
  uploadBufferToS3
} from '../_lib/s3.js';

const VALID_CATEGORIES = ['degree', 'bootcamp', 'cloud-ai', 'fullstack', 'workshop'];

function normalizeSlug(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Resolves the effective display metadata for an S3 certificate so the Admin Vault
 * edit form pre-fills the exact values currently shown on `/certificates`.
 */
function enrichS3CertificatesWithCatalog(s3Items = []) {
  const claimedKeys = new Set();
  const curatedByKey = new Map();

  for (const cert of certificatesData) {
    const certSlug = normalizeSlug(cert.id);
    const aliases = (cert.matchAliases || []).map(normalizeSlug).filter(Boolean);
    const match = s3Items.find((s3Obj) => {
      if (claimedKeys.has(s3Obj.key)) return false;
      const fileSlug = normalizeSlug(s3Obj.fileName);
      const titleSlug = normalizeSlug(s3Obj.metadata?.title);
      if (
        fileSlug === certSlug ||
        fileSlug.includes(certSlug) ||
        certSlug.includes(fileSlug)
      ) {
        return true;
      }
      return aliases.some(
        (alias) =>
          fileSlug === alias ||
          fileSlug.includes(alias) ||
          (titleSlug && (titleSlug === alias || titleSlug.includes(alias)))
      );
    });
    if (match) {
      claimedKeys.add(match.key);
      curatedByKey.set(match.key, cert);
    }
  }

  return s3Items.map((item) => {
    const curated = curatedByKey.get(item.key);
    if (!curated || item.metadata?.edited) {
      return item;
    }
    return {
      ...item,
      isCurated: true,
      metadata: {
        title: curated.title?.es || item.metadata?.title || '',
        issuer: curated.issuer || item.metadata?.issuer || '',
        category: curated.category || item.metadata?.category || 'workshop',
        dateLabel: curated.dateLabel?.es || item.metadata?.dateLabel || '',
        description: curated.description?.es || item.metadata?.description || '',
        skills: Array.isArray(curated.skills) ? curated.skills : item.metadata?.skills || [],
        credentialUrl: curated.credentialUrl || item.metadata?.credentialUrl || '',
        edited: false
      }
    };
  });
}

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
      const [cvs, rawCertificates] = await Promise.all([
        listSignedCvs().catch(() => []),
        listSignedCertificates().catch(() => [])
      ]);
      const certificates = enrichS3CertificatesWithCatalog(rawCertificates || []);
      return res.status(200).json({ ok: true, cvs: cvs || [], certificates });
    }

    // Update metadata of an existing S3 certificate without re-uploading the file
    if (action === 'updateMetadata') {
      const { key, metadata = {} } = req.body || {};
      if (
        typeof key !== 'string' ||
        !key.startsWith('certificates/') ||
        key.includes('..') ||
        key.startsWith('/')
      ) {
        return res.status(400).json({ error: 'Invalid S3 certificate key.' });
      }

      const safeMetadata = {
        title: typeof metadata.title === 'string' ? metadata.title.trim() : '',
        issuer: typeof metadata.issuer === 'string' ? metadata.issuer.trim() : '',
        category: VALID_CATEGORIES.includes(metadata.category) ? metadata.category : 'workshop',
        dateLabel: typeof metadata.dateLabel === 'string' ? metadata.dateLabel.trim() : '',
        description: typeof metadata.description === 'string' ? metadata.description.trim() : '',
        skills: Array.isArray(metadata.skills)
          ? metadata.skills.join(', ')
          : typeof metadata.skills === 'string'
          ? metadata.skills.trim()
          : '',
        credentialUrl: typeof metadata.credentialUrl === 'string' ? metadata.credentialUrl.trim() : ''
      };

      await updateCertificateMetadataInS3({ key, metadata: safeMetadata });
      return res.status(200).json({ ok: true, key, metadata: safeMetadata });
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
