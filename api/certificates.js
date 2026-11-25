import { getCertificateObjectFromS3, listSignedCertificates } from './lib/s3.js';
import { certificatesData } from '../src/data/certificatesData.js';

function normalizeSlug(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]/g, '');
}

function getFileQueryParam(req) {
  if (req.query?.file) return String(req.query.file);
  if (req.url && req.url.includes('?')) {
    const parsed = new URL(req.url, 'http://localhost');
    return parsed.searchParams.get('file') || '';
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

  // Same-origin binary proxy for PDF certificate previews (no S3 CORS needed for pdf.js)
  const requestedFile = getFileQueryParam(req);
  if (requestedFile) {
    try {
      const { buffer, contentType } = await getCertificateObjectFromS3(requestedFile);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600');
      res.statusCode = 200;
      res.end(buffer);
      return;
    } catch (error) {
      console.error('[API /api/certificates?file] Error:', error?.message);
      return res.status(404).json({ error: 'Certificate file not found' });
    }
  }

  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=300');

  try {
    const s3Items = await listSignedCertificates();

    if (!s3Items || s3Items.length === 0) {
      return res.status(200).json({
        source: 'static',
        certificates: certificatesData
      });
    }

    const matchedS3Keys = new Set();

    // 1. Attach matching S3 signed URLs onto curated static catalog entries
    const mergedStatic = certificatesData.map((cert) => {
      const { matchAliases = [], ...publicCert } = cert;
      const certSlug = normalizeSlug(cert.id);
      const aliases = matchAliases.map(normalizeSlug).filter(Boolean);

      const match = s3Items.find((s3Obj) => {
        if (matchedS3Keys.has(s3Obj.key)) return false;
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

      if (!match) return publicCert;
      matchedS3Keys.add(match.key);

      return {
        ...publicCert,
        file: match.url,
        previewUrl: match.isPdf
          ? `/api/certificates?file=${encodeURIComponent(match.key)}`
          : match.url,
        fileName: match.fileName,
        isPdf: match.isPdf,
        s3Key: match.key
      };
    });

    // 2. Any additional certificate uploaded directly to S3 `certificates/` appears automatically!
    const dynamicFromS3 = s3Items
      .filter((s3Obj) => !matchedS3Keys.has(s3Obj.key))
      .map((s3Obj) => {
        const m = s3Obj.metadata;
        return {
          id: `s3-${normalizeSlug(s3Obj.fileName)}`,
          title: {
            es: m.title,
            en: m.title
          },
          issuer: m.issuer,
          issuerKey: null,
          category: ['degree', 'bootcamp', 'cloud-ai', 'fullstack', 'workshop'].includes(m.category)
            ? m.category
            : 'workshop',
          date: s3Obj.lastModified ? s3Obj.lastModified.slice(0, 7) : '2025-01',
          dateLabel: {
            es: m.dateLabel || 'Certificado verificado',
            en: m.dateLabel || 'Verified certificate'
          },
          description: {
            es: m.description || `Certificado emitido por ${m.issuer}.`,
            en: m.description || `Certificate issued by ${m.issuer}.`
          },
          skills: m.skills.length > 0 ? m.skills : [m.issuer],
          file: s3Obj.url,
          previewUrl: s3Obj.isPdf
            ? `/api/certificates?file=${encodeURIComponent(s3Obj.key)}`
            : s3Obj.url,
          fileName: s3Obj.fileName,
          isPdf: s3Obj.isPdf,
          s3Key: s3Obj.key,
          credentialUrl: m.credentialUrl || ''
        };
      });

    return res.status(200).json({
      source: 's3',
      certificates: [...dynamicFromS3, ...mergedStatic]
    });
  } catch (error) {
    console.error('[API /api/certificates] S3 error, serving static catalog:', error?.message);
    return res.status(200).json({
      source: 'static',
      certificates: certificatesData
    });
  }
}
