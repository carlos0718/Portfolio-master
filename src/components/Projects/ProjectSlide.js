import React from 'react';
import {Button} from 'react-bootstrap';
import {motion} from 'framer-motion';
import {AiFillGithub} from 'react-icons/ai';
import {BiLinkExternal} from 'react-icons/bi';
import {getDefaultProjectImage} from '../../utils/projectImages';

const SLIDE_CONTAINER_STYLE = {
	background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8) 0%, rgba(30, 20, 40, 0.8) 100%)',
	backdropFilter: 'blur(10px)',
	border: '1px solid rgba(168, 85, 247, 0.2)',
	borderRadius: '24px',
	padding: '40px',
	display: 'flex',
	gap: '40px',
	alignItems: 'center',
	overflow: 'hidden'
};

const IMAGE_CONTAINER_STYLE = {
	flex: '0 0 45%',
	borderRadius: '16px',
	overflow: 'hidden'
};

// Variantes de animación para el contenido
const CONTENT_VARIANTS = {
	hidden: {opacity: 0},
	visible: (i) => ({
		opacity: 1,
		transition: {
			delay: 0.2 + i * 0.1,
			duration: 0.5,
			ease: 'easeOut'
		}
	})
};

const LANGUAGE_BADGE_STYLE = {
	display: 'inline-block',
	padding: '8px 16px',
	background: 'rgba(168, 85, 247, 0.2)',
	border: '1px solid rgba(168, 85, 247, 0.4)',
	borderRadius: '20px',
	color: '#a855f7',
	fontSize: '0.9rem',
	fontWeight: '500'
};

const GITHUB_BUTTON_STYLE = {
	flex: 1,
	background: 'rgba(168, 85, 247, 0.1)',
	border: '2px solid #a855f7',
	color: 'white',
	padding: '12px',
	borderRadius: '12px',
	fontSize: '1rem',
	fontWeight: '600',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '10px',
	transition: 'all 0.3s ease'
};

const DEMO_BUTTON_STYLE = {
	flex: 1,
	background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
	border: '2px solid #ec4899',
	color: 'white',
	padding: '12px',
	borderRadius: '12px',
	fontSize: '1rem',
	fontWeight: '600',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '10px',
	transition: 'all 0.3s ease'
};

function ProjectSlide({project}) {
	const getMainLanguage = (languages) => {
		if (!languages || Object.keys(languages).length === 0) return null;
		const sortedLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]);
		return sortedLanguages[0][0];
	};

	const mainLanguage = getMainLanguage(project.languages);

	return (
		<div style={SLIDE_CONTAINER_STYLE}>
			{/* Project Image */}
			<motion.div style={IMAGE_CONTAINER_STYLE} whileHover={{scale: 1.05}} transition={{duration: 0.4, ease: 'easeOut'}}>
				<motion.img
					src={project.image}
					alt={project.title}
					style={{
						width: '100%',
						height: '300px',
						objectFit: 'cover',
						display: 'block'
					}}
					initial={{scale: 1}}
					whileHover={{scale: 1.1}}
					transition={{duration: 0.5, ease: 'easeOut'}}
					onError={(e) => {
						// Si falla la carga del preview, usar imagen por defecto
						if (project.image && project.image.startsWith('http')) {
							e.target.src = getDefaultProjectImage(project.title, project.languages);
						}
					}}
				/>
			</motion.div>

			{/* Project Info */}
			<div style={{flex: 1}}>
				<motion.h2
					custom={0}
					variants={CONTENT_VARIANTS}
					initial='hidden'
					animate='visible'
					style={{color: 'white', fontSize: '2rem', marginBottom: '12px', fontWeight: '600'}}
				>
					{project.title}
				</motion.h2>

				<motion.p
					custom={1}
					variants={CONTENT_VARIANTS}
					initial='hidden'
					animate='visible'
					style={{
						color: 'rgba(255, 255, 255, 0.6)',
						fontSize: '0.9rem',
						marginBottom: '20px'
					}}
				>
					Creado el {project.createdAt}
				</motion.p>

				<motion.p
					custom={2}
					variants={CONTENT_VARIANTS}
					initial='hidden'
					animate='visible'
					style={{
						color: 'rgba(255, 255, 255, 0.8)',
						fontSize: '1rem',
						lineHeight: '1.6',
						marginBottom: '24px'
					}}
				>
					{project.description}
				</motion.p>

				{/* Main Language Badge */}
				{mainLanguage && (
					<motion.div custom={3} variants={CONTENT_VARIANTS} initial='hidden' animate='visible' style={{marginBottom: '24px'}}>
						<motion.span
							whileHover={{scale: 1.05, backgroundColor: 'rgba(168, 85, 247, 0.3)'}}
							transition={{duration: 0.2}}
							style={LANGUAGE_BADGE_STYLE}
						>
							{mainLanguage}
						</motion.span>
					</motion.div>
				)}

				{/* Action Buttons */}
				<motion.div custom={4} variants={CONTENT_VARIANTS} initial='hidden' animate='visible' style={{display: 'flex', gap: '16px'}}>
					<motion.div whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} transition={{duration: 0.2}} style={{flex: 1}}>
						<Button href={project.ghLink} target='_blank' rel='noopener noreferrer' style={GITHUB_BUTTON_STYLE}>
							<AiFillGithub size={20} />
							GitHub
						</Button>
					</motion.div>
					<motion.div whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} transition={{duration: 0.2}} style={{flex: 1}}>
						<Button href={project.demoLink} target='_blank' rel='noopener noreferrer' style={DEMO_BUTTON_STYLE}>
							<BiLinkExternal size={20} />
							Demo
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

export default ProjectSlide;
