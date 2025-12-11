import React from 'react';
import {motion} from 'framer-motion';
import {BiSearch} from 'react-icons/bi';
import {AiOutlineClose} from 'react-icons/ai';

const FILTERS_CONTAINER_STYLE = {
	background: 'rgba(20, 20, 30, 0.7)',
	backdropFilter: 'blur(10px)',
	border: '1px solid rgba(168, 85, 247, 0.2)',
	borderRadius: '20px',
	padding: '30px',
	marginBottom: '40px',
	maxWidth: '1200px',
	margin: '0 auto 40px auto'
};

const SEARCH_CONTAINER_STYLE = {
	position: 'relative',
	marginBottom: '25px'
};

const SEARCH_INPUT_STYLE = {
	width: '100%',
	padding: '14px 50px 14px 50px',
	background: 'rgba(168, 85, 247, 0.05)',
	border: '2px solid rgba(168, 85, 247, 0.3)',
	borderRadius: '12px',
	color: 'white',
	fontSize: '1rem',
	outline: 'none',
	transition: 'all 0.3s ease'
};

const SEARCH_ICON_STYLE = {
	position: 'absolute',
	left: '18px',
	top: '50%',
	transform: 'translateY(-50%)',
	color: '#a855f7',
	fontSize: '20px',
	pointerEvents: 'none'
};

const CLEAR_BUTTON_STYLE = {
	position: 'absolute',
	right: '12px',
	top: '50%',
	transform: 'translateY(-50%)',
	background: 'rgba(168, 85, 247, 0.2)',
	border: 'none',
	borderRadius: '50%',
	width: '30px',
	height: '30px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
	color: 'white',
	transition: 'all 0.3s ease'
};

const FILTER_SECTION_STYLE = {
	marginBottom: '20px'
};

const FILTER_LABEL_STYLE = {
	color: 'white',
	fontSize: '0.9rem',
	fontWeight: '600',
	marginBottom: '12px',
	display: 'block'
};

const FILTER_CHIPS_CONTAINER_STYLE = {
	display: 'flex',
	flexWrap: 'wrap',
	gap: '10px'
};

const CHIP_STYLE = {
	padding: '8px 16px',
	background: 'rgba(168, 85, 247, 0.1)',
	border: '2px solid rgba(168, 85, 247, 0.3)',
	borderRadius: '20px',
	color: 'white',
	fontSize: '0.85rem',
	fontWeight: '500',
	cursor: 'pointer',
	transition: 'all 0.3s ease',
	userSelect: 'none'
};

const ACTIVE_CHIP_STYLE = {
	...CHIP_STYLE,
	background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
	borderColor: '#ec4899'
};

const DROPDOWN_STYLE = {
	width: '100%',
	padding: '12px 16px',
	background: 'rgba(168, 85, 247, 0.05)',
	border: '2px solid rgba(168, 85, 247, 0.3)',
	borderRadius: '12px',
	color: 'white',
	fontSize: '0.95rem',
	cursor: 'pointer',
	outline: 'none',
	transition: 'all 0.3s ease'
};

function ProjectFilters({
	searchTerm,
	onSearchChange,
	selectedTechs,
	onTechToggle,
	selectedType,
	onTypeChange,
	selectedYear,
	onYearChange,
	sortBy,
	onSortChange,
	availableTechs,
	availableTypes,
	availableYears
}) {
	return (
		<motion.div
			className="filters-container"
			style={FILTERS_CONTAINER_STYLE}
			initial={{opacity: 0, y: -20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.5}}
		>
			{/* Búsqueda */}
			<div style={SEARCH_CONTAINER_STYLE}>
				<BiSearch style={SEARCH_ICON_STYLE} />
				<input
					type="text"
					placeholder="Buscar proyectos por nombre o descripción..."
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					style={{
						...SEARCH_INPUT_STYLE,
						borderColor: searchTerm ? '#a855f7' : 'rgba(168, 85, 247, 0.3)'
					}}
					onFocus={(e) => (e.target.style.borderColor = '#a855f7')}
					onBlur={(e) => (e.target.style.borderColor = searchTerm ? '#a855f7' : 'rgba(168, 85, 247, 0.3)')}
				/>
				{searchTerm && (
					<motion.button
						style={CLEAR_BUTTON_STYLE}
						whileHover={{scale: 1.1, backgroundColor: 'rgba(168, 85, 247, 0.4)'}}
						whileTap={{scale: 0.9}}
						onClick={() => onSearchChange('')}
					>
						<AiOutlineClose size={16} />
					</motion.button>
				)}
			</div>

			{/* Filtros por tecnología */}
			{availableTechs.length > 0 && (
				<div style={{...FILTER_SECTION_STYLE, marginBottom: '0'}}>
					<label style={FILTER_LABEL_STYLE}>Tecnologías ({selectedTechs.length} seleccionadas)</label>
					<div style={FILTER_CHIPS_CONTAINER_STYLE}>
						{availableTechs.map((tech) => {
							const isSelected = selectedTechs.includes(tech);
							return (
								<motion.div
									key={tech}
									style={isSelected ? ACTIVE_CHIP_STYLE : CHIP_STYLE}
									whileHover={{
										scale: 1.05,
										borderColor: '#ec4899',
										boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
									}}
									whileTap={{scale: 0.95}}
									onClick={() => onTechToggle(tech)}
								>
									{tech}
								</motion.div>
							);
						})}
					</div>
				</div>
			)}
		</motion.div>
	);
}

export default ProjectFilters;
