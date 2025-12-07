import React, {useState} from 'react';
import {motion, useMotionValue, useSpring, useTransform} from 'framer-motion';
import {AiFillGithub} from 'react-icons/ai';
import {BiLinkExternal} from 'react-icons/bi';
import {getDefaultProjectImage} from '../../utils/projectImages';

const CARD_STYLE = {
	background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.9) 0%, rgba(30, 20, 40, 0.9) 100%)',
	backdropFilter: 'blur(10px)',
	border: '1px solid rgba(168, 85, 247, 0.2)',
	borderRadius: '20px',
	padding: '24px',
	cursor: 'pointer',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	position: 'relative',
	transformStyle: 'preserve-3d',
	overflow: 'hidden',
	perspective: '1000px'
};

const IMAGE_CONTAINER_STYLE = {
	borderRadius: '12px',
	overflow: 'hidden',
	marginBottom: '20px',
	position: 'relative',
	transformStyle: 'preserve-3d'
};

const LANGUAGE_BADGE_STYLE = {
	position: 'absolute',
	top: '12px',
	right: '12px',
	padding: '6px 12px',
	background: 'rgba(168, 85, 247, 0.9)',
	backdropFilter: 'blur(8px)',
	border: '1px solid rgba(168, 85, 247, 0.4)',
	borderRadius: '16px',
	color: 'white',
	fontSize: '0.8rem',
	fontWeight: '600',
	zIndex: 2
};

const BUTTONS_CONTAINER_STYLE = {
	display: 'flex',
	gap: '8px',
	marginTop: 'auto'
};

const BUTTON_STYLE = {
	flex: 1,
	padding: '8px 12px',
	borderRadius: '8px',
	fontSize: '0.85rem',
	fontWeight: '600',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '6px',
	border: 'none',
	cursor: 'pointer',
	transition: 'all 0.3s ease'
};

const GITHUB_BUTTON_STYLE = {
	...BUTTON_STYLE,
	background: 'rgba(168, 85, 247, 0.1)',
	border: '2px solid #a855f7',
	color: 'white'
};

const DEMO_BUTTON_STYLE = {
	...BUTTON_STYLE,
	background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
	color: 'white'
};

function ProjectCard({project, onClick}) {
	const [isHovered, setIsHovered] = useState(false);

	// Motion values para animaciones 3D suaves
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	// Springs para animaciones 3D más dramáticas con mayor rango de rotación
	const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]), {stiffness: 400, damping: 25});
	const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), {stiffness: 400, damping: 25});

	// Transformaciones adicionales para el efecto 3D más pronunciado
	const scale = useSpring(isHovered ? 1.08 : 1, {stiffness: 400, damping: 20});
	const z = useTransform([rotateX, rotateY], ([rx, ry]) => {
		return Math.abs(rx) * 0.8 + Math.abs(ry) * 0.8;
	});

	// Efecto de profundidad adicional
	const translateZ = useSpring(isHovered ? 30 : 0, {stiffness: 400, damping: 25});

	const getMainLanguage = (languages) => {
		if (!languages || Object.keys(languages).length === 0) return null;
		const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);
		return sortedLanguages[0][0];
	};

	const mainLanguage = getMainLanguage(project.languages);

	const handleMouseMove = (e) => {
		const card = e.currentTarget;
		const rect = card.getBoundingClientRect();
		const cardCenterX = rect.left + rect.width / 2;
		const cardCenterY = rect.top + rect.height / 2;

		// Normalizar coordenadas entre -0.5 y 0.5
		const normalizedX = (e.clientX - cardCenterX) / (rect.width / 2);
		const normalizedY = (e.clientY - cardCenterY) / (rect.height / 2);

		x.set(normalizedX);
		y.set(normalizedY);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
		setIsHovered(false);
	};

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleButtonClick = (e, url) => {
		e.stopPropagation();
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	return (
		<motion.div
			style={{
				...CARD_STYLE,
				rotateX,
				rotateY,
				scale,
				z,
				translateZ,
				transformStyle: 'preserve-3d',
				perspective: '1000px'
			}}
			initial={{opacity: 0, y: 50, rotateX: 0, rotateY: 0, scale: 0.9}}
			animate={{opacity: 1, y: 0, scale: 1}}
			transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={onClick}
			whileTap={{scale: 0.95, rotateX: 0, rotateY: 0}}
		>
			{/* Imagen del proyecto sin contenedor decorativo */}
			<div style={{position: 'relative', marginBottom: '20px'}}>
				{mainLanguage && (
					<motion.div
						style={{
							...LANGUAGE_BADGE_STYLE,
							transform: 'translateZ(40px)'
						}}
						whileHover={{scale: 1.15, rotateZ: 8, translateZ: 50}}
						transition={{type: 'spring', stiffness: 400, damping: 20}}
					>
						{mainLanguage}
					</motion.div>
				)}
				<motion.img
					src={project.image}
					alt={project.title}
					style={{
						width: '100%',
						height: '200px',
						objectFit: 'cover',
						display: 'block',
						borderRadius: '12px',
						transformStyle: 'preserve-3d',
						transform: 'translateZ(25px)'
					}}
					whileHover={{scale: 1.2, rotateZ: 3, translateZ: 35}}
					transition={{type: 'spring', stiffness: 300, damping: 20}}
					onError={(e) => {
						// Si falla la carga del preview, usar imagen por defecto
						if (project.image && project.image.startsWith('http')) {
							e.target.src = getDefaultProjectImage(project.title, project.languages);
						}
					}}
				/>
			</div>

			{/* Content con efecto 3D mejorado */}
			<motion.h3
				style={{
					color: 'white',
					fontSize: '1.3rem',
					marginBottom: '8px',
					fontWeight: '600',
					transformStyle: 'preserve-3d',
					transform: 'translateZ(15px)'
				}}
				whileHover={{scale: 1.08, x: 8, translateZ: 25}}
				transition={{type: 'spring', stiffness: 400, damping: 20}}
			>
				{project.title}
			</motion.h3>

			<p
				style={{
					color: 'rgba(255, 255, 255, 0.6)',
					fontSize: '0.8rem',
					marginBottom: '12px'
				}}
			>
				{project.createdAt}
			</p>

			<p
				style={{
					color: 'rgba(255, 255, 255, 0.8)',
					fontSize: '0.9rem',
					lineHeight: '1.5',
					marginBottom: '16px',
					flex: 1
				}}
			>
				{project.description}
			</p>

			{/* Action Buttons con efecto 3D mejorado */}
			<motion.div
				style={{
					...BUTTONS_CONTAINER_STYLE,
					transformStyle: 'preserve-3d',
					transform: 'translateZ(20px)'
				}}
			>
				<motion.button
					style={GITHUB_BUTTON_STYLE}
					whileHover={{
						scale: 1.12,
						backgroundColor: 'rgba(168, 85, 247, 0.4)',
						rotateY: 8,
						translateZ: 30,
						boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
					}}
					whileTap={{scale: 0.92, rotateY: 0}}
					onClick={(e) => handleButtonClick(e, project.ghLink)}
					transition={{type: 'spring', stiffness: 400, damping: 20}}
				>
					<AiFillGithub size={16} />
					GitHub
				</motion.button>
				<motion.button
					style={DEMO_BUTTON_STYLE}
					whileHover={{
						scale: 1.12,
						rotateY: -8,
						translateZ: 30,
						boxShadow: '0 8px 25px rgba(236, 72, 153, 0.4)'
					}}
					whileTap={{scale: 0.92, rotateY: 0}}
					onClick={(e) => handleButtonClick(e, project.demoLink)}
					transition={{type: 'spring', stiffness: 400, damping: 20}}
				>
					<BiLinkExternal size={16} />
					Demo
				</motion.button>
			</motion.div>
		</motion.div>
	);
}

export default ProjectCard;
