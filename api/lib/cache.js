import {fetchGitHubRepoCount, fetchPinnedRepos} from '../../src/config/github.js';

let githubCache = null;
let githubCacheTimestamp = null;
const CACHE_DURATION = 3600000; // 1 hour

export async function getCachedGitHubData() {
	if (githubCache && githubCacheTimestamp && Date.now() - githubCacheTimestamp < CACHE_DURATION) {
		return githubCache;
	}

	try {
		const [count, pinnedRepos] = await Promise.all([
			fetchGitHubRepoCount(),
			fetchPinnedRepos()
		]);

		githubCache = {
			count,
			pinnedProjects:
				pinnedRepos.slice(0, 3).map((repo) => ({
					name: repo.name,
					description: repo.description || 'No description available'
				})) || []
		};
		githubCacheTimestamp = Date.now();

		return githubCache;
	} catch (error) {
		console.error('Error fetching GitHub data:', error);
		// Return fallback data
		return {
			count: 20,
			pinnedProjects: []
		};
	}
}
