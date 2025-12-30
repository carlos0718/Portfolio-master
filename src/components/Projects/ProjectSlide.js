import React from 'react';
import {Button} from 'react-bootstrap';
import {motion} from 'framer-motion';
import {AiFillGithub} from 'react-icons/ai';
import {BiLinkExternal} from 'react-icons/bi';
import {getDefaultProjectImage} from '../../utils/projectImages';

const SLIDE_CONTAINER_STYLE = {
	background: 'linear-gradient(145deg, rgba(17, 16, 16, 0.95) 0%, rgba(30, 20, 45, 0.95) 100%)',
	backdropFilter: 'blur(20px)',
	border: '1px solid rgba(168, 85, 247, 0.3)',
	borderRadius: '28px',
	padding: '0',
	display: 'flex',
	gap: '0',
	alignItems: 'stretch',
	overflow: 'hidden',
	boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.1)',
	position: 'relative'
};

const IMAGE_CONTAINER_STYLE = {
	flex: '0 0 45%',
	overflow: 'hidden',
	position: 'relative',
	background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
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
	padding: '10px 20px',
	background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
	border: '1.5px solid rgba(168, 85, 247, 0.5)',
	borderRadius: '24px',
	color: '#c084fc',
	fontSize: '0.95rem',
	fontWeight: '600',
	letterSpacing: '0.5px',
	boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)'
};

const GITHUB_BUTTON_STYLE = {
	flex: 1,
	background: 'transparent',
	border: '2px solid rgba(168, 85, 247, 0.5)',
	color: 'white',
	padding: '14px 24px',
	borderRadius: '14px',
	fontSize: '1rem',
	fontWeight: '600',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '10px',
	transition: 'all 0.3s ease',
	boxShadow: '0 4px 12px rgba(168, 85, 247, 0.1)'
};

const DEMO_BUTTON_STYLE = {
	flex: 1,
	background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
	border: '2px solid transparent',
	color: 'white',
	padding: '14px 24px',
	borderRadius: '14px',
	fontSize: '1rem',
	fontWeight: '600',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '10px',
	transition: 'all 0.3s ease',
	boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)'
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
			<motion.div
				style={IMAGE_CONTAINER_STYLE}
				whileHover={{
					boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)'
				}}
				transition={{duration: 0.4, ease: 'easeOut'}}
			>
				<motion.img
					src={project.image}
					alt={project.title}
					style={{
						width: '100%',
						height: '100%',
						minHeight: '400px',
						objectFit: 'cover',
						display: 'block'
					}}
					initial={{scale: 1}}
					whileHover={{scale: 1.05}}
					transition={{duration: 0.6, ease: 'easeOut'}}
					onError={(e) => {
						// Si falla la carga del preview, usar imagen por defecto
						if (project.image && project.image.startsWith('http')) {
							e.target.src = getDefaultProjectImage(project.title, project.languages);
						}
					}}
				/>
				{/* Gradient Overlay */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
						pointerEvents: 'none'
					}}
				/>
			</motion.div>

			{/* Project Info */}
			<div style={{flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
				<div>
					<motion.h2
						custom={0}
						variants={CONTENT_VARIANTS}
						initial='hidden'
						animate='visible'
						style={{
							color: 'white',
							fontSize: '2.2rem',
							marginBottom: '16px',
							fontWeight: '700',
							letterSpacing: '-0.5px',
							lineHeight: '1.2'
						}}
					>
						{project.title}
					</motion.h2>

					<motion.p
						custom={1}
						variants={CONTENT_VARIANTS}
						initial='hidden'
						animate='visible'
						style={{
							color: 'rgba(168, 85, 247, 0.8)',
							fontSize: '0.95rem',
							marginBottom: '24px',
							fontWeight: '500',
							letterSpacing: '0.5px'
						}}
					>
						📅 Creado el {project.createdAt}
					</motion.p>

					<motion.p
						custom={2}
						variants={CONTENT_VARIANTS}
						initial='hidden'
						animate='visible'
						style={{
							color: 'rgba(255, 255, 255, 0.85)',
							fontSize: '1.05rem',
							lineHeight: '1.7',
							marginBottom: '32px'
						}}
					>
						{project.description}
					</motion.p>
				</div>

				<div>
					{/* Main Language Badge */}
					{mainLanguage && (
						<motion.div custom={3} variants={CONTENT_VARIANTS} initial='hidden' animate='visible' style={{marginBottom: '28px'}}>
							<motion.span
								whileHover={{
									scale: 1.05,
									backgroundColor: 'rgba(168, 85, 247, 0.25)',
									boxShadow: '0 6px 16px rgba(168, 85, 247, 0.3)'
								}}
								transition={{duration: 0.2}}
								style={LANGUAGE_BADGE_STYLE}
							>
								{mainLanguage}
							</motion.span>
						</motion.div>
					)}

					{/* Action Buttons */}
					<motion.div custom={4} variants={CONTENT_VARIANTS} initial='hidden' animate='visible' style={{display: 'flex', gap: '16px'}}>
						<motion.div
							whileHover={{
								scale: 1.02,
								y: -2
							}}
							whileTap={{scale: 0.98}}
							transition={{duration: 0.2}}
							style={{flex: 1}}
						>
							<Button href={project.ghLink} target='_blank' rel='noopener noreferrer' style={GITHUB_BUTTON_STYLE}>
								<AiFillGithub size={22} />
								GitHub
							</Button>
						</motion.div>
						<motion.div
							whileHover={{
								scale: 1.02,
								y: -2,
								boxShadow: '0 12px 32px rgba(168, 85, 247, 0.5)'
							}}
							whileTap={{scale: 0.98}}
							transition={{duration: 0.2}}
							style={{flex: 1}}
						>
							<Button href={project.demoLink} target='_blank' rel='noopener noreferrer' style={DEMO_BUTTON_STYLE}>
								<BiLinkExternal size={22} />
								Demo
							</Button>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default ProjectSlide;
