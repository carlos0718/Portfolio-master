import { useEffect, useState } from 'react';
import { professionalData } from '../data/professionalData';

const FALLBACK = [
  {
    key: 'local-default',
    fileName: 'Carlos-Jesus-CV.pdf',
    label: 'Carlos Jesús — CV (PDF)',
    url: professionalData.personal.cvPath
  }
];

let cachedCvs = null;

export function useCvList() {
  const [cvs, setCvs] = useState(cachedCvs || FALLBACK);
  const [source, setSource] = useState(cachedCvs ? 's3' : 'local');

  useEffect(() => {
    if (cachedCvs) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/cv');
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.cvs) && json.cvs.length > 0) {
          cachedCvs = json.cvs;
          if (!cancelled) {
            setCvs(json.cvs);
            setSource(json.source || 'local');
          }
        }
      } catch {
        // Keep local fallback seamlessly
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { cvs, source };
}
