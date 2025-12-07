import React, {useState, useEffect, useRef, useCallback} from 'react';
import {motion} from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const GRID_CONTAINER_STYLE = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
	gap: '35px',
	padding: '60px 0 20px 0',
	maxWidth: '1200px',
	margin: '0 auto',
	perspective: '1000px'
};

const LOAD_MORE_BUTTON_STYLE = {
	padding: '14px 32px',
	background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
	border: '2px solid #a855f7',
	borderRadius: '12px',
	color: 'white',
	fontSize: '1rem',
	fontWeight: '600',
	cursor: 'pointer',
	margin: '40px auto',
	display: 'block',
	transition: 'all 0.3s ease'
};

const SECTION_TITLE_STYLE = {
	color: 'white',
	fontSize: '2.5rem',
	fontWeight: '700',
	textAlign: 'center',
	marginBottom: '20px',
	marginTop: '60px'
};

const SECTION_SUBTITLE_STYLE = {
	color: 'rgba(255, 255, 255, 0.7)',
	fontSize: '1.1rem',
	textAlign: 'center',
	marginBottom: '40px'
};

const INITIAL_LOAD = 6;
const LOAD_MORE_COUNT = 3;

function ProjectGrid({projects}) {
	const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
	const [selectedProject, setSelectedProject] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isPreparing, setIsPreparing] = useState(false);
	const loadMoreRef = useRef(null);
	const observerRef = useRef(null);

	const visibleProjects = projects.slice(0, visibleCount);
	const hasMore = visibleCount < projects.length;

	// Función loadMore memoizada para evitar recreaciones
	const loadMore = useCallback(() => {
		if (isLoading) return;
		setIsLoading(true);
		setIsPreparing(false);

		// Delay mínimo para mostrar el loading y permitir que las cards se rendericen
		setTimeout(() => {
			setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, projects.length));
			setIsLoading(false);
		}, 300);
	}, [isLoading, projects.length]);

	// Intersection Observer for automatic lazy loading mejorado
	useEffect(() => {
		// Esperar a que el DOM se actualice después de cargar más proyectos
		const timeoutId = setTimeout(() => {
			if (!hasMore || !loadMoreRef.current || isLoading || isPreparing) return;

			// Limpiar observer anterior si existe
			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			const currentRef = loadMoreRef.current;
			if (!currentRef) return;

			observerRef.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && !isLoading && !isPreparing) {
						setIsPreparing(true);
						// Pequeño delay para mostrar el loading antes de cargar
						setTimeout(() => {
							loadMore();
						}, 100);
					}
				},
				{threshold: 0.1, rootMargin: '200px'} // Margen para cargar antes de llegar al final
			);

			observerRef.current.observe(currentRef);
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [hasMore, isLoading, isPreparing, visibleCount, loadMore]);

	const handleCardClick = (project) => {
		setSelectedProject(project);
	};

	const handleCloseModal = () => {
		setSelectedProject(null);
	};

	return (
		<div style={{padding: '0 20px', marginTop: '80px'}}>
			{/* Section Header con animación 3D */}
			<motion.h2
				style={{
					...SECTION_TITLE_STYLE,
					transformStyle: 'preserve-3d'
				}}
				initial={{opacity: 0, y: -30, rotateX: -20}}
				whileInView={{opacity: 1, y: 0, rotateX: 0}}
				viewport={{once: true}}
				transition={{duration: 0.8, ease: [0.22, 1, 0.36, 1]}}
			>
				Todos los Proyectos
			</motion.h2>

			<motion.p
				style={{
					...SECTION_SUBTITLE_STYLE,
					transformStyle: 'preserve-3d'
				}}
				initial={{opacity: 0, y: -20, rotateX: -10}}
				whileInView={{opacity: 1, y: 0, rotateX: 0}}
				viewport={{once: true}}
				transition={{duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1]}}
			>
				Explora mi portafolio completo de proyectos
			</motion.p>

			{/* Grid con animaciones mejoradas */}
			<div style={GRID_CONTAINER_STYLE}>
				{visibleProjects.map((project, index) => (
					<motion.div
						key={project.id}
						initial={{opacity: 0, y: 80, rotateX: -15, scale: 0.9}}
						whileInView={{opacity: 1, y: 0, rotateX: 0, scale: 1}}
						viewport={{once: true, margin: '0px 0px -150px 0px'}}
						transition={{
							duration: 0.6,
							delay: index * 0.08,
							ease: [0.22, 1, 0.36, 1]
						}}
					>
						<ProjectCard project={project} onClick={() => handleCardClick(project)} />
					</motion.div>
				))}

				{/* Loading Indicator - Dentro del grid, donde aparecerán las nuevas cards */}
				{(isLoading || isPreparing) && (
					<motion.div
						style={{
							gridColumn: '1 / -1',
							textAlign: 'center',
							padding: '40px 20px',
							marginTop: '20px'
						}}
						initial={{opacity: 0, y: 20}}
						animate={{opacity: 1, y: 0}}
						exit={{opacity: 0, y: -20}}
						transition={{duration: 0.3}}
					>
						<motion.div
							animate={{rotate: 360}}
							transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
							style={{
								width: '50px',
								height: '50px',
								border: '4px solid rgba(168, 85, 247, 0.2)',
								borderTop: '4px solid #a855f7',
								borderRight: '4px solid #ec4899',
								borderRadius: '50%',
								margin: '0 auto 16px',
								boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
							}}
						/>
						<motion.p
							style={{
								color: '#a855f7',
								fontSize: '1.1rem',
								fontWeight: '500',
								margin: 0
							}}
							initial={{opacity: 0}}
							animate={{opacity: [0.5, 1, 0.5]}}
							transition={{duration: 1.5, repeat: Infinity}}
						>
							Cargando más proyectos...
						</motion.p>
					</motion.div>
				)}
			</div>

			{/* Load More Trigger (invisible) - Posicionado justo después del grid */}
			{hasMore && !isLoading && !isPreparing && <div ref={loadMoreRef} style={{height: '50px', marginTop: '0px'}} />}

			{/* Manual Load More Button (optional fallback) */}
			{hasMore && !isLoading && (
				<motion.button
					style={LOAD_MORE_BUTTON_STYLE}
					whileHover={{scale: 1.05, boxShadow: '0 8px 30px rgba(168, 85, 247, 0.4)'}}
					whileTap={{scale: 0.95}}
					onClick={loadMore}
					initial={{opacity: 0, y: 20}}
					whileInView={{opacity: 1, y: 0}}
					viewport={{once: true}}
				>
					Cargar más proyectos
				</motion.button>
			)}

			{/* Project Modal */}
			{selectedProject && <ProjectModal project={selectedProject} onClose={handleCloseModal} />}
		</div>
	);
}

export default ProjectGrid;
