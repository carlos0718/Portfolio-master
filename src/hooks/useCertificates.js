import { useEffect, useState } from 'react';
import { certificatesData } from '../data/certificatesData';

let cachedCerts = null;
let forceFreshNextFetch = false;

export function invalidateCertificatesCache() {
  cachedCerts = null;
  forceFreshNextFetch = true;
}

export function useCertificates() {
  const [certificates, setCertificates] = useState(cachedCerts || certificatesData);
  const [source, setSource] = useState(cachedCerts ? 's3' : 'static');
  const [loading, setLoading] = useState(!cachedCerts);

  useEffect(() => {
    if (cachedCerts) return;
    let cancelled = false;

    async function load() {
      try {
        const url = forceFreshNextFetch
          ? `/api/certificates?fresh=1&t=${Date.now()}`
          : '/api/certificates';
        forceFreshNextFetch = false;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.certificates) && json.certificates.length > 0) {
          cachedCerts = json.certificates;
          if (!cancelled) {
            setCertificates(json.certificates);
            setSource(json.source || 'static');
          }
        }
      } catch {
        // Keep static catalog seamlessly
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { certificates, source, loading };
}
