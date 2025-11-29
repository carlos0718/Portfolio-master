import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Col, Container, Row, Spinner} from 'react-bootstrap';

import {fetchGitHubRepos} from '../../config/github';
import {filterProjectsByType, getProjectImage, getProjectType} from '../../utils/projectImages';
import PaginationComponent from '../Pagination';
import Particle from '../Particle';
import ProjectCard from './ProjectCards';

function Projects() {
	const [allProjects, setAllProjects] = useState([]);
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterType, setFilterType] = useState('all'); // 'all', 'frontend', 'backend', 'fullstack'
	const projectsPerPage = 9; // Número de proyectos por página

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const repos = await fetchGitHubRepos();
				// Filtrar y transformar los repositorios que quieres mostrar
				const processedProjects = repos
					.filter((repo) => !repo.fork) // Excluir forks
					.map((repo) => ({
						id: repo.id,
						image: getProjectImage(repo.name, repo.languages), // Asignar imagen según el proyecto
						title: repo.name,
						description: repo.description || 'Sin descripción disponible',
						ghLink: repo.html_url,
						demoLink: repo.homepage || repo.html_url,
						languages: repo.languages || {},
						projectType: getProjectType(repo.languages), // Agregar tipo de proyecto
						createdAt: new Date(repo.created_at).toLocaleDateString('es-ES', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						}),
						// Calcular porcentaje de JavaScript para ordenamiento
						jsPercentage: calculateJavaScriptPercentage(repo.languages)
					}))
					// Ordenar por fecha de creación (más reciente primero)
					.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

				console.log('Proyectos cargados:', processedProjects); // Para debugging
				setAllProjects(processedProjects);
				setProjects(processedProjects);
			} catch (error) {
				console.error('Error al cargar proyectos:', error);
			} finally {
				setLoading(false);
			}
		};

		loadProjects();
	}, []);

	// Efecto para filtrar proyectos cuando cambia el tipo de filtro
	useEffect(() => {
		const filtered = filterProjectsByType(allProjects, filterType);
		setProjects(filtered);
		setCurrentPage(1); // Resetear a la primera página al cambiar filtro
	}, [filterType, allProjects]);

	// Función para cambiar el filtro
	const handleFilterChange = (type) => {
		setFilterType(type);
	};

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

				{/* Botones de filtro */}
				<div style={{display: 'flex', justifyContent: 'center', marginBottom: '30px'}}>
					<ButtonGroup>
						<Button variant={filterType === 'all' ? 'primary' : 'outline-primary'} onClick={() => handleFilterChange('all')}>
							All ({allProjects.length})
						</Button>
						<Button variant={filterType === 'frontend' ? 'primary' : 'outline-primary'} onClick={() => handleFilterChange('frontend')}>
							Frontend ({allProjects.filter((p) => p.projectType === 'frontend').length})
						</Button>
						<Button variant={filterType === 'backend' ? 'primary' : 'outline-primary'} onClick={() => handleFilterChange('backend')}>
							Backend ({allProjects.filter((p) => p.projectType === 'backend').length})
						</Button>
						<Button variant={filterType === 'fullstack' ? 'primary' : 'outline-primary'} onClick={() => handleFilterChange('fullstack')}>
							Fullstack ({allProjects.filter((p) => p.projectType === 'fullstack').length})
						</Button>
					</ButtonGroup>
				</div>

				{loading ? (
					<p style={{color: 'white'}}>
						<Spinner animation='border' variant='primary' />
					</p>
				) : projects.length === 0 ? (
					<p style={{color: 'white', textAlign: 'center'}}>No projects found for this filter.</p>
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
										projectType={project.projectType}
									/>
								</Col>
							))}
						</Row>
						{/* Paginación */}
						{totalPages > 1 && (
							<div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
								<PaginationComponent numpages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
							</div>
						)}
					</>
				)}
			</Container>
		</Container>
	);
}

export default Projects;
