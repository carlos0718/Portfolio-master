const DEFAULT_USERNAME = 'carlos0718';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

let githubCache = null;
let githubCacheTimestamp = 0;

function getGitHubConfig() {
  const username =
    process.env.GITHUB_USERNAME ||
    process.env.REACT_APP_GITHUB_USERNAME ||
    DEFAULT_USERNAME;
  const token =
    process.env.GITHUB_TOKEN ||
    process.env.REACT_APP_GITHUB_TOKEN ||
    '';
  return { username, token };
}

function buildRestHeaders(token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'carlos-jesus-portfolio'
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchUserProfile(username, token) {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: buildRestHeaders(token)
  });
  if (!response.ok) {
    throw new Error(`GitHub profile request failed with ${response.status}`);
  }
  const data = await response.json();
  return {
    login: data.login || username,
    name: data.name || 'Carlos Jesús',
    avatarUrl: data.avatar_url || null,
    bio: data.bio || '',
    publicRepos: data.public_repos || 0,
    totalRepos: (data.public_repos || 0) + (data.total_private_repos || 0),
    followers: data.followers || 0,
    htmlUrl: data.html_url || `https://github.com/${username}`
  };
}

async function fetchPublicRepos(username, token) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=60&type=owner`,
    { headers: buildRestHeaders(token) }
  );
  if (!response.ok) {
    throw new Error(`GitHub repos request failed with ${response.status}`);
  }
  const repos = await response.json();
  if (!Array.isArray(repos)) return [];

  return repos
    .filter((repo) => !repo.fork && !repo.private)
    .map((repo) => {
      const languages = {};
      if (repo.language) {
        languages[repo.language] = 100;
      }
      return {
        id: String(repo.id),
        name: repo.name,
        description: repo.description || '',
        htmlUrl: repo.html_url,
        homepage: repo.homepage || '',
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        primaryLanguage: repo.language || null,
        languages,
        topics: Array.isArray(repo.topics) ? repo.topics : []
      };
    });
}

async function fetchPinnedReposGraphQL(username, token) {
  if (!token) return [];

  const query = `
    query ($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              id
              name
              description
              url
              createdAt
              updatedAt
              homepageUrl
              stargazerCount
              forkCount
              primaryLanguage {
                name
              }
              languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
                edges {
                  node {
                    name
                  }
                  size
                }
              }
              repositoryTopics(first: 8) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'carlos-jesus-portfolio'
    },
    body: JSON.stringify({ query, variables: { login: username } })
  });

  if (!response.ok) return [];

  const json = await response.json();
  const nodes = json?.data?.user?.pinnedItems?.nodes;
  if (!Array.isArray(nodes)) return [];

  return nodes.map((repo) => {
    const languages = {};
    (repo.languages?.edges || []).forEach((edge) => {
      if (edge?.node?.name) {
        languages[edge.node.name] = edge.size || 1;
      }
    });

    return {
      id: String(repo.id),
      name: repo.name,
      description: repo.description || '',
      htmlUrl: repo.url,
      homepage: repo.homepageUrl || '',
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      stars: repo.stargazerCount || 0,
      forks: repo.forkCount || 0,
      primaryLanguage: repo.primaryLanguage?.name || Object.keys(languages)[0] || null,
      languages,
      topics: (repo.repositoryTopics?.nodes || []).map((t) => t.topic?.name).filter(Boolean)
    };
  });
}

export async function getCachedGitHubData() {
  if (githubCache && Date.now() - githubCacheTimestamp < CACHE_DURATION) {
    return githubCache;
  }

  const { username, token } = getGitHubConfig();

  try {
    const [profile, allProjects, pinnedFromGraphQL] = await Promise.all([
      fetchUserProfile(username, token),
      fetchPublicRepos(username, token),
      fetchPinnedReposGraphQL(username, token).catch(() => [])
    ]);

    // Enrich matching repos in allProjects with multi-language data from GraphQL pinned query
    const pinnedByName = new Map(pinnedFromGraphQL.map((p) => [p.name, p]));
    const enrichedAll = allProjects.map((repo) => {
      const match = pinnedByName.get(repo.name);
      return match ? { ...repo, languages: match.languages } : repo;
    });

    const pinnedProjects =
      pinnedFromGraphQL.length > 0
        ? pinnedFromGraphQL
        : [...enrichedAll].sort((a, b) => b.stars - a.stars).slice(0, 6);

    githubCache = {
      profile,
      count: profile.totalRepos || enrichedAll.length || 20,
      pinnedProjects,
      allProjects: enrichedAll,
      fetchedAt: new Date().toISOString()
    };
    githubCacheTimestamp = Date.now();

    return githubCache;
  } catch (error) {
    console.error('[GitHub Cache] Error fetching GitHub data:', error.message);

    if (githubCache) {
      return githubCache;
    }

    return {
      profile: {
        login: username,
        name: 'Carlos Jesús',
        avatarUrl: `https://github.com/${username}.png`,
        bio: '',
        publicRepos: 20,
        totalRepos: 20,
        followers: 0,
        htmlUrl: `https://github.com/${username}`
      },
      count: 20,
      pinnedProjects: [],
      allProjects: [],
      fetchedAt: new Date().toISOString(),
      fallback: true
    };
  }
}
