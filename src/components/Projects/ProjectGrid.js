import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {motion} from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ProjectFilters from './ProjectFilters';
import SkeletonCard from './SkeletonCard';

const GRID_CONTAINER_STYLE = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
	gap: '35px',
	padding: '20px 0',
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
	marginBottom: '30px'
};

const COUNTER_STYLE = {
	color: '#a855f7',
	fontSize: '1rem',
	textAlign: 'center',
	marginBottom: '30px',
	fontWeight: '600'
};

const NO_RESULTS_STYLE = {
	color: 'rgba(255, 255, 255, 0.7)',
	fontSize: '1.2rem',
	textAlign: 'center',
	padding: '80px 20px',
	marginTop: '40px'
};

const INITIAL_LOAD = 12;
const LOAD_MORE_COUNT = 8;

function ProjectGrid({projects}) {
	const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
	const [selectedProject, setSelectedProject] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isPreparing, setIsPreparing] = useState(false);
	const loadMoreRef = useRef(null);
	const observerRef = useRef(null);

	// Estados de filtros
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTechs, setSelectedTechs] = useState([]);
	const [selectedType, setSelectedType] = useState('');
	const [selectedYear, setSelectedYear] = useState('');
	const [sortBy, setSortBy] = useState('recent');

	// Extraer opciones únicas de los proyectos
	const {availableTechs, availableTypes, availableYears} = useMemo(() => {
		const techsSet = new Set();
		const typesSet = new Set();
		const yearsSet = new Set();

		projects.forEach((project) => {
			// Tecnologías desde languages
			if (project.languages) {
				Object.keys(project.languages).forEach((lang) => {
					// Filtrar tecnologías no deseadas
					if (lang !== 'Nix') {
						techsSet.add(lang);
					}
				});
			}
			// Tipos desde topics
			if (project.topics && project.topics.length > 0) {
				project.topics.forEach((topic) => typesSet.add(topic));
			}
			// Años desde createdAt
			if (project.createdAt) {
				const year = new Date(project.createdAt).getFullYear();
				if (!isNaN(year)) {
					yearsSet.add(year.toString());
				}
			}
		});

		return {
			availableTechs: Array.from(techsSet).sort(),
			availableTypes: Array.from(typesSet).sort(),
			availableYears: Array.from(yearsSet).sort().reverse()
		};
	}, [projects]);

	// Filtrar y ordenar proyectos
	const filteredAndSortedProjects = useMemo(() => {
		let filtered = [...projects];

		// Filtro de búsqueda
		if (searchTerm) {
			const search = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(project) =>
					project.title.toLowerCase().includes(search) ||
					(project.description && project.description.toLowerCase().includes(search))
			);
		}

		// Filtro de tecnologías
		if (selectedTechs.length > 0) {
			filtered = filtered.filter((project) => {
				if (!project.languages) return false;
				const projectLangs = Object.keys(project.languages);
				return selectedTechs.some((tech) => projectLangs.includes(tech));
			});
		}

		// Filtro de tipo
		if (selectedType) {
			filtered = filtered.filter((project) => project.topics && project.topics.includes(selectedType));
		}

		// Filtro de año
		if (selectedYear) {
			filtered = filtered.filter((project) => {
				const year = new Date(project.createdAt).getFullYear().toString();
				return year === selectedYear;
			});
		}

		// Ordenamiento
		if (sortBy === 'alphabetical') {
			filtered.sort((a, b) => a.title.localeCompare(b.title));
		} else if (sortBy === 'alphabetical-desc') {
			filtered.sort((a, b) => b.title.localeCompare(a.title));
		} else if (sortBy === 'recent') {
			filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		}

		return filtered;
	}, [projects, searchTerm, selectedTechs, selectedType, selectedYear, sortBy]);

	// Resetear visibleCount cuando cambian los filtros
	useEffect(() => {
		setVisibleCount(INITIAL_LOAD);
	}, [searchTerm, selectedTechs, selectedType, selectedYear, sortBy]);

	const visibleProjects = filteredAndSortedProjects.slice(0, visibleCount);
	const hasMore = visibleCount < filteredAndSortedProjects.length;

	const handleTechToggle = (tech) => {
		setSelectedTechs((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]));
	};

	// Función loadMore memoizada para evitar recreaciones
	const loadMore = useCallback(() => {
		if (isLoading) return;
		setIsLoading(true);
		setIsPreparing(false);

		// Delay mínimo para mostrar el loading y permitir que las cards se rendericen
		setTimeout(() => {
			setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filteredAndSortedProjects.length));
			setIsLoading(false);
		}, 300);
	}, [isLoading, filteredAndSortedProjects.length]);

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
			{/* Section Header */}
			<motion.h2
				style={SECTION_TITLE_STYLE}
				initial={{opacity: 0, y: -20}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.6}}
			>
				Todos los Proyectos
			</motion.h2>

			<motion.p
				style={SECTION_SUBTITLE_STYLE}
				initial={{opacity: 0, y: -10}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.6, delay: 0.1}}
			>
				Explora mi portafolio completo de proyectos
			</motion.p>

			{/* Filtros de Proyectos */}
			<ProjectFilters
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				selectedTechs={selectedTechs}
				onTechToggle={handleTechToggle}
				selectedType={selectedType}
				onTypeChange={setSelectedType}
				selectedYear={selectedYear}
				onYearChange={setSelectedYear}
				sortBy={sortBy}
				onSortChange={setSortBy}
				availableTechs={availableTechs}
				availableTypes={availableTypes}
				availableYears={availableYears}
			/>

			{/* Contador de Proyectos */}
			<motion.p
				className="project-counter"
				style={COUNTER_STYLE}
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				transition={{duration: 0.5}}
			>
				Mostrando {visibleProjects.length} de {filteredAndSortedProjects.length} proyectos
				{filteredAndSortedProjects.length !== projects.length && ` (${projects.length} total)`}
			</motion.p>

			{/* Grid con animaciones mejoradas */}
			{filteredAndSortedProjects.length === 0 ? (
				<motion.div
					style={NO_RESULTS_STYLE}
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
					transition={{duration: 0.5}}
				>
					<p style={{fontSize: '3rem', marginBottom: '20px'}}>🔍</p>
					<p style={{marginBottom: '10px', fontSize: '1.4rem', fontWeight: '600'}}>No se encontraron proyectos</p>
					<p style={{fontSize: '1rem', color: 'rgba(255, 255, 255, 0.5)'}}>
						Intenta ajustar los filtros o la búsqueda
					</p>
				</motion.div>
			) : (
				<div className="project-grid" style={GRID_CONTAINER_STYLE}>
					{visibleProjects.map((project, index) => (
						<motion.div
							key={project.id}
							initial={{opacity: 0, y: 40}}
							animate={{opacity: 1, y: 0}}
							transition={{
								duration: 0.5,
								delay: Math.min(index * 0.05, 0.3),
								ease: 'easeOut'
							}}
						>
							<ProjectCard project={project} onClick={() => handleCardClick(project)} />
						</motion.div>
					))}

					{/* Skeleton loaders mientras se cargan más proyectos */}
					{(isLoading || isPreparing) &&
						Array.from({length: Math.min(LOAD_MORE_COUNT, filteredAndSortedProjects.length - visibleCount)}).map(
							(_, index) => (
								<motion.div
									key={`skeleton-${index}`}
									initial={{opacity: 0, y: 20}}
									animate={{opacity: 1, y: 0}}
									transition={{duration: 0.3, delay: index * 0.05}}
								>
									<SkeletonCard />
								</motion.div>
							)
						)}
				</div>
			)}

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
