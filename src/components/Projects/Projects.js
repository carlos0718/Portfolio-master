import React, {useState} from 'react';
import {Container} from 'react-bootstrap';
import Particle from '../Particle';
import ProjectCarousel from './ProjectCarousel';
import ProjectGrid from './ProjectGrid';
import {useProjects} from '../../hooks/useProjects';

const SECTION_TITLE_STYLE = {
	textAlign: 'center',
	color: 'white',
	fontSize: '2rem',
	marginBottom: '60px',
	fontWeight: '600'
};

function Projects() {
	const {pinnedProjects, allProjects, loading} = useProjects();
	const [currentIndex, setCurrentIndex] = useState(0);

	const renderContent = () => {
		if (loading) {
			return (
				<div style={{textAlign: 'center', padding: '100px 0', color: 'white'}}>
					<div className='spinner-border text-primary' role='status'>
						<span className='visually-hidden'>Loading...</span>
					</div>
				</div>
			);
		}

		// Mostrar carrusel solo si hay proyectos pineados
		const hasPinnedProjects = pinnedProjects.length > 0;
		const hasAllProjects = allProjects.length > 0;

		if (!hasPinnedProjects && !hasAllProjects) {
			return <p style={{color: 'white', textAlign: 'center'}}>No hay proyectos disponibles</p>;
		}

		return (
			<>
				{/* Carrusel solo con proyectos pineados */}
				{hasPinnedProjects && (
					<>
						<h2 style={SECTION_TITLE_STYLE}>Featured Projects</h2>
						<ProjectCarousel projects={pinnedProjects} currentIndex={currentIndex} onNavigate={setCurrentIndex} />
					</>
				)}
				{/* Grid con todos los proyectos debajo del carrusel */}
				{hasAllProjects && <ProjectGrid projects={allProjects} />}
			</>
		);
	};

	return (
		<Container fluid className='project-section'>
			<Particle />
			<Container style={{minHeight: 'calc(100vh - 200px)'}}>
				<h1 className='project-heading' style={{marginBottom: '10px'}}>
					<strong className='purple'>Projects </strong>
				</h1>
				<p style={{color: 'rgba(255, 255, 255, 0.7)', marginBottom: '60px', fontSize: '18px'}}>
					Projects realized in my free time and when I was learning new technologies
				</p>
				{renderContent()}
			</Container>
		</Container>
	);
}

export default Projects;
