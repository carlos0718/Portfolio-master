import React from 'react';
import {motion} from 'framer-motion';
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
	overflow: 'hidden'
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
	const getMainLanguage = (languages) => {
		if (!languages || Object.keys(languages).length === 0) return null;
		const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);
		return sortedLanguages[0][0];
	};

	const mainLanguage = getMainLanguage(project.languages);

	const handleButtonClick = (e, url) => {
		e.stopPropagation();
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	return (
		<motion.div
			style={CARD_STYLE}
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.4, ease: 'easeOut'}}
			whileHover={{y: -8, transition: {duration: 0.2}}}
			onClick={onClick}
		>
			{/* Imagen del proyecto sin contenedor decorativo */}
			<div style={{position: 'relative', marginBottom: '20px'}}>
				{mainLanguage && (
					<motion.div
						style={LANGUAGE_BADGE_STYLE}
						whileHover={{scale: 1.15}}
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
						borderRadius: '12px'
					}}
					whileHover={{scale: 1.05}}
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
			<h3
				style={{
					color: 'white',
					fontSize: '1.3rem',
					marginBottom: '8px',
					fontWeight: '600'
				}}
			>
				{project.title}
			</h3>

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
			<div style={BUTTONS_CONTAINER_STYLE}>
				<motion.button
					style={GITHUB_BUTTON_STYLE}
					whileHover={{
						scale: 1.05,
						backgroundColor: 'rgba(168, 85, 247, 0.4)',
						boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
					}}
					whileTap={{scale: 0.95}}
					onClick={(e) => handleButtonClick(e, project.ghLink)}
					transition={{type: 'spring', stiffness: 400, damping: 20}}
				>
					<AiFillGithub size={16} />
					GitHub
				</motion.button>
				<motion.button
					style={DEMO_BUTTON_STYLE}
					whileHover={{
						scale: 1.05,
						boxShadow: '0 8px 25px rgba(236, 72, 153, 0.4)'
					}}
					whileTap={{scale: 0.95}}
					onClick={(e) => handleButtonClick(e, project.demoLink)}
					transition={{type: 'spring', stiffness: 400, damping: 20}}
				>
					<BiLinkExternal size={16} />
					Demo
				</motion.button>
			</div>
		</motion.div>
	);
}

export default ProjectCard;
