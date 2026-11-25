import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const PRESIGN_TTL_SECONDS = 3600; // 1 hour
const CACHE_TTL_MS = 40 * 60 * 1000; // 40 min (shorter than presign TTL so URLs are always valid)

let s3ClientInstance = null;
let cvCache = { data: null, timestamp: 0 };
let certCache = { data: null, timestamp: 0 };

export function getS3Config() {
  const region = (process.env.AWS_REGION || process.env.REACT_APP_AWS_REGION || '').trim();
  const accessKeyId = (
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.REACT_APP_AWS_ACCESS_KEY_ID ||
    ''
  ).trim();
  const secretAccessKey = (
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.REACT_APP_AWS_SECRET_ACCESS_KEY ||
    ''
  ).trim();
  const bucket = (
    process.env.S3_BUCKET_NAME ||
    process.env.AWS_S3_BUCKET_NAME ||
    process.env.REACT_APP_S3_BUCKET_NAME ||
    ''
  ).trim();

  return {
    configured: Boolean(region && accessKeyId && secretAccessKey && bucket),
    region,
    accessKeyId,
    secretAccessKey,
    bucket
  };
}

function getS3Client() {
  const cfg = getS3Config();
  if (!cfg.configured) return null;

  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: cfg.region,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey
      }
    });
  }
  return { client: s3ClientInstance, bucket: cfg.bucket };
}

export function invalidateS3Cache() {
  cvCache = { data: null, timestamp: 0 };
  certCache = { data: null, timestamp: 0 };
}

export function formatReadableLabel(key) {
  const fileName = key.split('/').pop() || key;
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function sanitizeFilename(rawName = '') {
  const base = String(rawName).split(/[\\/]/).pop() || '';
  const cleaned = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+/, '');
  return cleaned.slice(0, 120);
}

/**
 * Lists CV PDFs stored at root level (backward-compatible with existing bucket)
 * or under `cv/` prefix and signs temporary Pre-signed GET URLs.
 */
export async function listSignedCvs() {
  if (cvCache.data && Date.now() - cvCache.timestamp < CACHE_TTL_MS) {
    return cvCache.data;
  }

  const conn = getS3Client();
  if (!conn) return null;

  const { client, bucket } = conn;
  const listRes = await client.send(new ListObjectsV2Command({ Bucket: bucket }));
  const contents = listRes.Contents || [];

  const pdfItems = contents
    .filter((obj) => {
      const key = obj.Key || '';
      if (!key.toLowerCase().endsWith('.pdf')) return false;
      // Exclude certificates folder
      if (key.toLowerCase().startsWith('certificates/')) return false;
      // Include root-level PDFs or `cv/` folder PDFs
      const depth = key.split('/').length;
      return depth === 1 || key.toLowerCase().startsWith('cv/');
    })
    .sort((a, b) => new Date(b.LastModified || 0) - new Date(a.LastModified || 0));

  const signedCvs = await Promise.all(
    pdfItems.map(async (obj) => {
      const key = obj.Key;
      const fileName = key.split('/').pop();
      const url = await getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
          ResponseContentType: 'application/pdf',
          ResponseContentDisposition: `inline; filename="${fileName}"`
        }),
        { expiresIn: PRESIGN_TTL_SECONDS }
      );

      return {
        key,
        fileName,
        label: formatReadableLabel(key),
        url,
        size: obj.Size || 0,
        lastModified: obj.LastModified ? new Date(obj.LastModified).toISOString() : null
      };
    })
  );

  cvCache = { data: signedCvs, timestamp: Date.now() };
  return signedCvs;
}

const CERT_EXT_REGEX = /\.(png|jpe?g|webp|pdf)$/i;

/**
 * Lists certificate images/PDFs under `certificates/` prefix in S3,
 * reads optional custom metadata (`x-amz-meta-*`), and signs Pre-signed GET URLs.
 */
export async function listSignedCertificates() {
  if (certCache.data && Date.now() - certCache.timestamp < CACHE_TTL_MS) {
    return certCache.data;
  }

  const conn = getS3Client();
  if (!conn) return null;

  const { client, bucket } = conn;
  const listRes = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: 'certificates/'
    })
  );

  const items = (listRes.Contents || [])
    .filter((obj) => obj.Key && CERT_EXT_REGEX.test(obj.Key) && obj.Size > 0)
    .sort((a, b) => new Date(b.LastModified || 0) - new Date(a.LastModified || 0));

  const signed = await Promise.all(
    items.map(async (obj) => {
      const key = obj.Key;
      const fileName = key.split('/').pop();
      const isPdf = fileName.toLowerCase().endsWith('.pdf');

      const [url, head] = await Promise.all([
        getSignedUrl(
          client,
          new GetObjectCommand({
            Bucket: bucket,
            Key: key,
            ...(isPdf
              ? {
                  ResponseContentType: 'application/pdf',
                  ResponseContentDisposition: `inline; filename="${fileName}"`
                }
              : {})
          }),
          { expiresIn: PRESIGN_TTL_SECONDS }
        ),
        client
          .send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
          .catch(() => ({ Metadata: {} }))
      ]);

      const meta = head?.Metadata || {};
      const decodeMeta = (val) => {
        if (!val) return '';
        try {
          return decodeURIComponent(val);
        } catch {
          return val;
        }
      };

      return {
        key,
        fileName,
        url,
        isPdf,
        size: obj.Size || 0,
        lastModified: obj.LastModified ? new Date(obj.LastModified).toISOString() : null,
        metadata: {
          title: decodeMeta(meta.title) || formatReadableLabel(fileName),
          issuer: decodeMeta(meta.issuer) || 'Verified Issuer',
          category: decodeMeta(meta.category) || 'workshop',
          dateLabel: decodeMeta(meta.datelabel) || (obj.LastModified ? new Date(obj.LastModified).getFullYear().toString() : ''),
          description: decodeMeta(meta.description) || '',
          skills: decodeMeta(meta.skills)
            ? decodeMeta(meta.skills)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          credentialUrl: decodeMeta(meta.credentialurl) || ''
        }
      };
    })
  );

  certCache = { data: signed, timestamp: Date.now() };
  return signed;
}

export async function uploadBufferToS3({ key, buffer, contentType, metadata = {} }) {
  const conn = getS3Client();
  if (!conn) {
    throw new Error('AWS S3 is not configured on the server.');
  }

  const encodedMeta = {};
  for (const [k, v] of Object.entries(metadata)) {
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      encodedMeta[k.toLowerCase()] = encodeURIComponent(String(v).trim().slice(0, 300));
    }
  }

  await conn.client.send(
    new PutObjectCommand({
      Bucket: conn.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: encodedMeta
    })
  );

  invalidateS3Cache();
  return { key };
}

export async function deleteObjectFromS3(key) {
  const conn = getS3Client();
  if (!conn) {
    throw new Error('AWS S3 is not configured on the server.');
  }
  await conn.client.send(
    new DeleteObjectCommand({
      Bucket: conn.bucket,
      Key: key
    })
  );
  invalidateS3Cache();
  return { deleted: key };
}

/**
 * Fetches raw bytes of a certificate object from S3 for same-origin PDF preview
 * (avoids requiring S3 bucket CORS rules for pdf.js rendering).
 */
export async function getCertificateObjectFromS3(key) {
  if (
    typeof key !== 'string' ||
    !key.startsWith('certificates/') ||
    key.includes('..') ||
    !CERT_EXT_REGEX.test(key)
  ) {
    throw new Error('Invalid certificate key');
  }

  const conn = getS3Client();
  if (!conn) {
    throw new Error('AWS S3 is not configured on the server.');
  }

  const response = await conn.client.send(
    new GetObjectCommand({
      Bucket: conn.bucket,
      Key: key
    })
  );

  const bytes = await response.Body.transformToByteArray();
  return {
    buffer: Buffer.from(bytes),
    contentType: response.ContentType || (key.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream')
  };
}
