import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {AiFillGithub} from 'react-icons/ai';
import {BiLinkExternal, BiX} from 'react-icons/bi';
import {getDefaultProjectImage} from '../../utils/projectImages';

const OVERLAY_STYLE = {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	background: 'rgba(0, 0, 0, 0.8)',
	backdropFilter: 'blur(10px)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 1000,
	padding: '20px'
};

const MODAL_STYLE = {
	background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(30, 20, 40, 0.95) 100%)',
	backdropFilter: 'blur(20px)',
	border: '2px solid rgba(168, 85, 247, 0.3)',
	borderRadius: '24px',
	padding: '40px',
	maxWidth: '900px',
	width: '100%',
	maxHeight: '90vh',
	overflowY: 'auto',
	position: 'relative',
	transformStyle: 'preserve-3d'
};

const CLOSE_BUTTON_STYLE = {
	position: 'absolute',
	top: '20px',
	right: '20px',
	background: 'rgba(168, 85, 247, 0.2)',
	border: '2px solid rgba(168, 85, 247, 0.4)',
	borderRadius: '50%',
	width: '40px',
	height: '40px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
	color: '#a855f7',
	fontSize: '24px',
	zIndex: 10
};

const IMAGE_STYLE = {
	width: '100%',
	height: 'auto',
	maxHeight: '400px',
	objectFit: 'cover',
	borderRadius: '16px',
	marginBottom: '24px'
};

const LANGUAGE_BADGES_CONTAINER_STYLE = {
	display: 'flex',
	flexWrap: 'wrap',
	gap: '8px',
	marginBottom: '24px'
};

const LANGUAGE_BADGE_STYLE = {
	padding: '8px 16px',
	background: 'rgba(168, 85, 247, 0.2)',
	border: '1px solid rgba(168, 85, 247, 0.4)',
	borderRadius: '20px',
	color: '#a855f7',
	fontSize: '0.9rem',
	fontWeight: '500'
};

const BUTTONS_CONTAINER_STYLE = {
	display: 'flex',
	gap: '16px',
	marginTop: '32px'
};

const BUTTON_STYLE = {
	flex: 1,
	padding: '14px 24px',
	borderRadius: '12px',
	fontSize: '1rem',
	fontWeight: '600',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '10px',
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

const modalVariants = {
	hidden: {
		opacity: 0,
		scale: 0.3,
		rotateX: -60,
		rotateY: 60,
		rotateZ: -15,
		z: -800,
		y: 100
	},
	visible: {
		opacity: 1,
		scale: 1,
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		z: 0,
		y: 0,
		transition: {
			type: 'spring',
			stiffness: 80,
			damping: 25,
			mass: 1.2,
			duration: 1
		}
	},
	exit: {
		opacity: 0,
		scale: 0.3,
		rotateX: 60,
		rotateY: -60,
		rotateZ: 15,
		z: -800,
		y: -100,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 30,
			duration: 0.6
		}
	}
};

function ProjectModal({project, onClose}) {
	if (!project) return null;

	const getLanguages = (languages) => {
		if (!languages || Object.keys(languages).length === 0) return [];
		return Object.entries(languages)
			.sort((a, b) => b[1] - a[1])
			.map(([name]) => name);
	};

	const languages = getLanguages(project.languages);

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			<motion.div style={OVERLAY_STYLE} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={handleOverlayClick}>
				<motion.div
					style={{
						...MODAL_STYLE,
						perspective: '1500px',
						transformStyle: 'preserve-3d'
					}}
					variants={modalVariants}
					initial='hidden'
					animate='visible'
					exit='exit'
					whileHover={{
						scale: 1.02,
						transition: {duration: 0.3}
					}}
				>
					{/* Close Button */}
					<motion.button
						style={CLOSE_BUTTON_STYLE}
						whileHover={{scale: 1.1, backgroundColor: 'rgba(168, 85, 247, 0.3)'}}
						whileTap={{scale: 0.9}}
						onClick={onClose}
					>
						<BiX />
					</motion.button>

					{/* Image con efecto 3D */}
					<motion.img
						src={project.image}
						alt={project.title}
						style={{
							...IMAGE_STYLE,
							transformStyle: 'preserve-3d',
							transform: 'translateZ(30px)'
						}}
						initial={{opacity: 0, y: 50, rotateX: -20, scale: 0.9}}
						animate={{opacity: 1, y: 0, rotateX: 0, scale: 1}}
						transition={{delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
						whileHover={{
							scale: 1.05,
							rotateY: 5,
							translateZ: 50,
							transition: {duration: 0.3}
						}}
						onError={(e) => {
							// Si falla la carga del preview, usar imagen por defecto
							if (project.image && project.image.startsWith('http')) {
								e.target.src = getDefaultProjectImage(project.title, project.languages);
							}
						}}
					/>

					{/* Title con efecto 3D */}
					<motion.h2
						style={{
							color: 'white',
							fontSize: '2.5rem',
							marginBottom: '12px',
							fontWeight: '700',
							transformStyle: 'preserve-3d',
							transform: 'translateZ(20px)'
						}}
						initial={{opacity: 0, x: -50, rotateY: -30}}
						animate={{opacity: 1, x: 0, rotateY: 0}}
						transition={{delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
						whileHover={{
							scale: 1.05,
							translateZ: 40,
							transition: {duration: 0.3}
						}}
					>
						{project.title}
					</motion.h2>

					{/* Created Date */}
					<motion.p
						style={{
							color: 'rgba(255, 255, 255, 0.6)',
							fontSize: '0.95rem',
							marginBottom: '20px'
						}}
						initial={{opacity: 0, x: -20}}
						animate={{opacity: 1, x: 0}}
						transition={{delay: 0.35, duration: 0.5}}
					>
						Creado el {project.createdAt}
					</motion.p>

					{/* Description */}
					<motion.p
						style={{
							color: 'rgba(255, 255, 255, 0.85)',
							fontSize: '1.1rem',
							lineHeight: '1.7',
							marginBottom: '24px'
						}}
						initial={{opacity: 0, x: -20}}
						animate={{opacity: 1, x: 0}}
						transition={{delay: 0.4, duration: 0.5}}
					>
						{project.description}
					</motion.p>

					{/* Languages */}
					{languages.length > 0 && (
						<motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.45, duration: 0.5}}>
							<h3
								style={{
									color: 'white',
									fontSize: '1.2rem',
									marginBottom: '12px',
									fontWeight: '600'
								}}
							>
								Tecnologías
							</h3>
							<div style={LANGUAGE_BADGES_CONTAINER_STYLE}>
								{languages.map((lang, index) => (
									<motion.span
										key={lang}
										style={LANGUAGE_BADGE_STYLE}
										initial={{opacity: 0, scale: 0}}
										animate={{opacity: 1, scale: 1}}
										transition={{delay: 0.5 + index * 0.05, duration: 0.3}}
										whileHover={{scale: 1.1, backgroundColor: 'rgba(168, 85, 247, 0.3)'}}
									>
										{lang}
									</motion.span>
								))}
							</div>
						</motion.div>
					)}

					{/* Action Buttons con efecto 3D */}
					<motion.div
						style={{
							...BUTTONS_CONTAINER_STYLE,
							transformStyle: 'preserve-3d',
							transform: 'translateZ(25px)'
						}}
						initial={{opacity: 0, y: 30, rotateX: 20}}
						animate={{opacity: 1, y: 0, rotateX: 0}}
						transition={{delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
					>
						<motion.a
							href={project.ghLink}
							target='_blank'
							rel='noopener noreferrer'
							style={GITHUB_BUTTON_STYLE}
							whileHover={{
								scale: 1.08,
								backgroundColor: 'rgba(168, 85, 247, 0.3)',
								rotateY: 8,
								translateZ: 40,
								boxShadow: '0 10px 30px rgba(168, 85, 247, 0.5)'
							}}
							whileTap={{scale: 0.95, rotateY: 0}}
							transition={{type: 'spring', stiffness: 400, damping: 20}}
						>
							<AiFillGithub size={22} />
							Ver en GitHub
						</motion.a>
						<motion.a
							href={project.demoLink}
							target='_blank'
							rel='noopener noreferrer'
							style={DEMO_BUTTON_STYLE}
							whileHover={{
								scale: 1.08,
								rotateY: -8,
								translateZ: 40,
								boxShadow: '0 10px 30px rgba(236, 72, 153, 0.5)'
							}}
							whileTap={{scale: 0.95, rotateY: 0}}
							transition={{type: 'spring', stiffness: 400, damping: 20}}
						>
							<BiLinkExternal size={22} />
							Ver Demo
						</motion.a>
					</motion.div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

export default ProjectModal;
