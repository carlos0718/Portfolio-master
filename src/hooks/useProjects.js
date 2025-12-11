import {useEffect, useState} from 'react';
import {fetchGitHubRepos, fetchPinnedRepos} from '../config/github';
import {getProjectImage} from '../utils/projectImages';

export const useProjects = () => {
	const [pinnedProjects, setPinnedProjects] = useState([]);
	const [allProjects, setAllProjects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				// Cargar proyectos pineados y todos los proyectos en paralelo
				const [pinnedRepos, allRepos] = await Promise.all([
					fetchPinnedRepos().catch((err) => {
						console.error('Error al cargar proyectos pineados:', err);
						return [];
					}),
					fetchGitHubRepos().catch((err) => {
						console.error('Error al cargar todos los proyectos:', err);
						return [];
					})
				]);

				// Transformar proyectos pineados
				const transformedPinned = transformRepos(pinnedRepos);
				setPinnedProjects(transformedPinned);

				// Filtrar proyectos públicos y no forkeados
				const publicRepos = allRepos.filter((repo) => !repo.fork && !repo.private);

				// Ordenar por fecha de creación descendente (más recientes primero)
				const sortedRepos = publicRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

				const transformedAll = transformRepos(sortedRepos);
				setAllProjects(transformedAll);
			} catch (error) {
				console.error('Error al cargar proyectos:', error);
			} finally {
				setLoading(false);
			}
		};

		loadProjects();
	}, []);

	return {pinnedProjects, allProjects, loading};
};

const transformRepos = (repos) => {
	return repos.map((repo) => ({
		id: repo.id,
		image: getProjectImage(repo.name, repo.languages, repo.homepage),
		title: repo.name,
		description: repo.description || 'Sin descripción disponible',
		ghLink: repo.html_url,
		demoLink: repo.homepage || repo.html_url,
		languages: repo.languages || {},
		topics: repo.topics || [],
		createdAt: new Date(repo.created_at).toLocaleDateString('es-ES', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}));
};
