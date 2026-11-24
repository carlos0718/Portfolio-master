import { useEffect, useState } from 'react';
import { getProjectImage } from '../utils/projectImages';

let memoryCache = null;

function mapRepo(repo) {
  return {
    id: repo.id,
    title: repo.name,
    description: repo.description || '',
    ghLink: repo.htmlUrl,
    demoLink: repo.homepage || '',
    languages: repo.languages || (repo.primaryLanguage ? { [repo.primaryLanguage]: 100 } : {}),
    primaryLanguage: repo.primaryLanguage || Object.keys(repo.languages || {})[0] || null,
    topics: repo.topics || [],
    stars: repo.stars || 0,
    forks: repo.forks || 0,
    createdAtRaw: repo.createdAt,
    updatedAtRaw: repo.updatedAt,
    image: getProjectImage(repo.name, repo.languages || {}, repo.homepage || null)
  };
}

export function useGitHubData() {
  const [data, setData] = useState(
    memoryCache || {
      profile: {
        avatarUrl: 'https://github.com/carlos0718.png',
        totalRepos: 20,
        publicRepos: 20
      },
      pinnedProjects: [],
      allProjects: [],
      loading: true,
      error: null
    }
  );

  useEffect(() => {
    if (memoryCache) return;

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/github');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const resolved = {
          profile: json.profile || {
            avatarUrl: 'https://github.com/carlos0718.png',
            totalRepos: json.count || 20,
            publicRepos: json.count || 20
          },
          pinnedProjects: (json.pinnedProjects || []).map(mapRepo),
          allProjects: (json.allProjects || []).map(mapRepo),
          loading: false,
          error: null
        };

        memoryCache = resolved;
        if (!cancelled) setData(resolved);
      } catch (err) {
        if (!cancelled) {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: err.message
          }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
