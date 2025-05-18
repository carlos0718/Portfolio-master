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

// Función para obtener los repositorios de GitHub
export const fetchGitHubRepos = async () => {
	try {
		const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&direction=desc&per_page=100`, {
			headers: {
				Authorization: `token ${GITHUB_TOKEN}`
			}
		});

		if (!response.ok) {
			throw new Error('Error al obtener los repositorios');
		}

		const repos = await response.json();

		// Obtener los lenguajes para cada repositorio
		const reposWithLanguages = await Promise.all(
			repos.map(async (repo) => {
				const languagesResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`, {
					headers: {
						Authorization: `token ${GITHUB_TOKEN}`
					}
				});

				if (!languagesResponse.ok) {
					throw new Error(`Error al obtener lenguajes para ${repo.name}`);
				}

				const languages = await languagesResponse.json();
				return {...repo, languages};
			})
		);

		// Ordenar por fecha de creación (más reciente primero)
		return reposWithLanguages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
	} catch (error) {
		console.error('Error:', error);
		return [];
	}
};
