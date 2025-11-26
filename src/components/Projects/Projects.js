import React, {useEffect, useState} from 'react';
import {Col, Container, Row, Spinner} from 'react-bootstrap';

import {fetchGitHubRepos} from '../../config/github';
import {getProjectImage, isFrontendProject} from '../../utils/projectImages';
import PaginationComponent from '../Pagination';
import Particle from '../Particle';
import ProjectCard from './ProjectCards';

function Projects() {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const projectsPerPage = 9; // Número de proyectos por página

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const repos = await fetchGitHubRepos();
				// Filtrar y transformar los repositorios que quieres mostrar
				const filteredProjects = repos
					.filter((repo) => !repo.fork) // Excluir forks
					.filter((repo) => isFrontendProject(repo.languages)) // Filtrar solo proyectos frontend
					.map((repo) => ({
						id: repo.id,
						image: getProjectImage(repo.name, repo.languages), // Asignar imagen según el proyecto
						title: repo.name,
						description: repo.description || 'Sin descripción disponible',
						ghLink: repo.html_url,
						demoLink: repo.homepage || repo.html_url,
						languages: repo.languages || {},
						createdAt: new Date(repo.created_at).toLocaleDateString('es-ES', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						}),
						// Calcular porcentaje de JavaScript para ordenamiento
						jsPercentage: calculateJavaScriptPercentage(repo.languages)
					}))
					// Ordenar por porcentaje de JavaScript (mayor a menor)
					.sort((a, b) => b.jsPercentage - a.jsPercentage);

				console.log('Proyectos frontend filtrados:', filteredProjects); // Para debugging
				setProjects(filteredProjects);
			} catch (error) {
				console.error('Error al cargar proyectos:', error);
			} finally {
				setLoading(false);
			}
		};

		loadProjects();
	}, []);

	// Función auxiliar para calcular el porcentaje de JavaScript
	const calculateJavaScriptPercentage = (languages) => {
		if (!languages || Object.keys(languages).length === 0) return 0;

		const jsBytes = languages['JavaScript'] || 0;
		const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

		return totalBytes > 0 ? (jsBytes / totalBytes) * 100 : 0;
	};

	// Calcular los índices para la paginación
	const indexOfLastProject = currentPage * projectsPerPage;
	const indexOfFirstProject = indexOfLastProject - projectsPerPage;
	const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
	const totalPages = Math.ceil(projects.length / projectsPerPage);

	return (
		<Container fluid className='project-section'>
			<Particle />
			<Container>
				<h1 className='project-heading'>
					My <strong className='purple'>Projects </strong>
				</h1>
				<p style={{color: 'white'}}>Projects realized in my free time and when I was learning new technologies</p>
				{loading ? (
					<p style={{color: 'white'}}>
						<Spinner animation='border' variant='primary' />
					</p>
				) : (
					<>
						<Row style={{justifyContent: 'center', paddingBottom: '10px'}}>
							{currentProjects.map((project) => (
								<Col md={4} className='project-card' key={project.id}>
									<ProjectCard
										imgPath={project.image}
										isBlog={false}
										title={project.title}
										description={project.description}
										ghLink={project.ghLink}
										demoLink={project.demoLink}
										languages={project.languages}
										createdAt={project.createdAt}
									/>
								</Col>
							))}
						</Row>
						{/* Paginación */}
						<div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
							<PaginationComponent numpages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
						</div>
					</>
				)}
			</Container>
		</Container>
	);
}

export default Projects;
