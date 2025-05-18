import React, {useEffect, useState} from 'react';
import {Col, Container, Row, Spinner} from 'react-bootstrap';

import defaultImage from '../../Assets/Projects/chatify.png';
import {fetchGitHubRepos} from '../../config/github';
import PaginationComponent from '../Pagination';
import Particle from '../Particle';
import ProjectCard from './ProjectCards';

// Imágenes por defecto para proyectos

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
					.map((repo) => ({
						id: repo.id,
						image: defaultImage,
						title: repo.name,
						description: repo.description || 'Sin descripción disponible',
						ghLink: repo.html_url,
						demoLink: repo.homepage || repo.html_url,
						languages: repo.languages || {},
						createdAt: new Date(repo.created_at).toLocaleDateString('es-ES', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})
					}));

				console.log('Proyectos con lenguajes:', filteredProjects); // Para debugging
				setProjects(filteredProjects);
			} catch (error) {
				console.error('Error al cargar proyectos:', error);
			} finally {
				setLoading(false);
			}
		};

		loadProjects();
	}, []);

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
