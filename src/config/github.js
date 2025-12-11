// GitHub API Configuration
export const GITHUB_USERNAME = process.env.REACT_APP_GITHUB_USERNAME; // Reemplaza con tu nombre de usuario de GitHub
export const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN; // Reemplaza con tu token personal de GitHub

// Función para obtener la imagen de perfil de GitHub
export const fetchGitHubProfile = async () => {
	try {
		const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
			headers: {
				Authorization: `token ${GITHUB_TOKEN}`
			}
		});

		if (!response.ok) {
			throw new Error('Error al obtener el perfil de GitHub');
		}

		const profile = await response.json();
		return profile.avatar_url;
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
};

// Función para obtener la cantidad total de repositorios (públicos + privados)
export const fetchGitHubRepoCount = async () => {
	try {
		const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
			headers: {
				Authorization: `token ${GITHUB_TOKEN}`
			}
		});

		if (!response.ok) {
			throw new Error('Error al obtener el perfil de GitHub');
		}

		const profile = await response.json();
		// public_repos + total_private_repos = total de repositorios
		return profile.public_repos + (profile.total_private_repos || 0);
	} catch (error) {
		console.error('Error:', error);
		return 20; // Valor por defecto
	}
};

// Helper function para delay entre peticiones
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para obtener lenguajes con retry y manejo de errores
const fetchLanguagesWithRetry = async (username, repoName, token, retries = 2) => {
	for (let i = 0; i <= retries; i++) {
		try {
			const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`, {
				headers: {
					Authorization: `token ${token}`
				}
			});

			if (response.ok) {
				return await response.json();
			}

			// Si es rate limit, esperar más tiempo
			if (response.status === 403 || response.status === 429) {
				await delay(2000 * (i + 1));
				continue;
			}

			// Para otros errores, retornar vacío
			console.warn(`Error ${response.status} al obtener lenguajes para ${repoName}`);
			return {};
		} catch (error) {
			console.warn(`Intento ${i + 1} falló para ${repoName}:`, error.message);
			if (i < retries) {
				await delay(1000 * (i + 1));
			}
		}
	}
	return {}; // Si todos los intentos fallan, retornar objeto vacío
};

// Función para obtener los repositorios de GitHub
export const fetchGitHubRepos = async () => {
	try {
		const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&direction=desc&per_page=100`, {
			headers: {
				Authorization: `token ${GITHUB_TOKEN}`,
				Accept: 'application/vnd.github.v3+json'
			}
		});

		if (!response.ok) {
			throw new Error('Error al obtener los repositorios');
		}

		const repos = await response.json();

		// Procesar repos en lotes para evitar rate limiting
		const batchSize = 10;
		const reposWithLanguages = [];

		for (let i = 0; i < repos.length; i += batchSize) {
			const batch = repos.slice(i, i + batchSize);

			const batchResults = await Promise.all(
				batch.map(async (repo) => {
					// Pequeño delay entre peticiones del mismo lote
					await delay(100);

					// Obtener lenguajes con retry
					const languages = await fetchLanguagesWithRetry(GITHUB_USERNAME, repo.name, GITHUB_TOKEN);

					// Los topics ya vienen incluidos en la respuesta del repositorio
					const topics = repo.topics || [];

					return {...repo, languages, topics};
				})
			);

			reposWithLanguages.push(...batchResults);

			// Delay entre lotes
			if (i + batchSize < repos.length) {
				await delay(500);
			}
		}

		// Ya viene ordenado por fecha de creación descendente desde la API
		return reposWithLanguages;
	} catch (error) {
		console.error('Error:', error);
		return [];
	}
};

// Función para obtener los repositorios pineados de GitHub usando GraphQL
export const fetchPinnedRepos = async () => {
	try {
		const query = `
			query {
				user(login: "${GITHUB_USERNAME}") {
					pinnedItems(first: 6, types: REPOSITORY) {
						nodes {
							... on Repository {
								id
								name
								description
								url
								createdAt
								homepageUrl
								languages(first: 10) {
									edges {
										node {
											name
											color
										}
										size
									}
								}
								repositoryTopics(first: 10) {
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
				Authorization: `Bearer ${GITHUB_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({query})
		});

		if (!response.ok) {
			throw new Error('Error al obtener los repositorios pineados');
		}

		const data = await response.json();
		const pinnedRepos = data.data.user.pinnedItems.nodes;

		// Transformar los datos al formato esperado
		return pinnedRepos.map((repo) => {
			// Convertir lenguajes al formato {nombre: bytes}
			const languages = {};
			repo.languages.edges.forEach((edge) => {
				languages[edge.node.name] = edge.size;
			});

			return {
				id: repo.id,
				name: repo.name,
				description: repo.description || 'Sin descripción disponible',
				html_url: repo.url,
				homepage: repo.homepageUrl,
				created_at: repo.createdAt,
				languages: languages,
				topics: repo.repositoryTopics.nodes.map((t) => t.topic.name)
			};
		});
	} catch (error) {
		console.error('Error al obtener repositorios pineados:', error);
		// Fallback a repos normales si falla
		return fetchGitHubRepos();
	}
};
