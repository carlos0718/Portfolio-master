import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import ProjectSlide from './ProjectSlide';

const AUTOPLAY_INTERVAL = 5000;

const CAROUSEL_CONTAINER_STYLE = {
	position: 'relative',
	width: '100%',
	height: '600px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden',
	perspective: '2000px'
};

const DOTS_CONTAINER_STYLE = {
	display: 'flex',
	justifyContent: 'center',
	gap: '12px',
	marginTop: '40px',
	marginBottom: '80px'
};

const DOT_STYLE = {
	width: '12px',
	height: '12px',
	borderRadius: '50%',
	border: '2px solid rgba(168, 85, 247, 0.5)',
	cursor: 'pointer',
	transition: 'all 0.3s ease'
};

function HorizontalCarousel({projects}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		if (isPaused || projects.length <= 1) return;

		const interval = setInterval(() => {
			setDirection(1);
			setCurrentIndex((prev) => (prev + 1) % projects.length);
		}, AUTOPLAY_INTERVAL);

		return () => clearInterval(interval);
	}, [currentIndex, isPaused, projects.length]);

	const handleDotClick = (index) => {
		setIsPaused(true);
		setDirection(index > currentIndex ? 1 : -1);
		setCurrentIndex(index);
		setTimeout(() => setIsPaused(false), 10000);
	};

	const getCardStyle = (index) => {
		const diff = index - currentIndex;
		const totalCards = projects.length;

		// Normalizar la diferencia para el efecto circular
		let normalizedDiff = diff;
		if (Math.abs(diff) > totalCards / 2) {
			normalizedDiff = diff > 0 ? diff - totalCards : diff + totalCards;
		}

		const baseTransition = {
			type: 'spring',
			stiffness: 300,
			damping: 30
		};

		// Card activa (centrada)
		if (normalizedDiff === 0) {
			return {
				x: 0,
				y: 0,
				scale: 1,
				opacity: 1,
				rotateY: 0,
				rotateX: 0,
				rotateZ: 0,
				zIndex: 10,
				transition: baseTransition
			};
		}

		// Cards a la derecha (siguientes)
		if (normalizedDiff > 0 && normalizedDiff <= 3) {
			return {
				x: 300 + (normalizedDiff - 1) * 100,
				y: 0,
				scale: 1 - normalizedDiff * 0.15,
				opacity: Math.max(0.3, 1 - normalizedDiff * 0.25),
				rotateY: -25 - normalizedDiff * 5,
				rotateX: 0,
				rotateZ: 0,
				zIndex: 10 - normalizedDiff,
				transition: baseTransition
			};
		}

		// Cards a la izquierda (anteriores)
		if (normalizedDiff < 0 && normalizedDiff >= -3) {
			const absDiff = Math.abs(normalizedDiff);
			return {
				x: -300 - (absDiff - 1) * 100,
				y: 0,
				scale: 1 - absDiff * 0.15,
				opacity: 0,
				rotateY: 25 + absDiff * 5,
				rotateX: 0,
				rotateZ: 0,
				zIndex: 10 - absDiff,
				transition: baseTransition
			};
		}

		// Cards fuera del rango visible
		return {
			x: normalizedDiff > 0 ? 1000 : -1000,
			y: 0,
			scale: 0.5,
			opacity: 0,
			rotateY: normalizedDiff > 0 ? -45 : 45,
			rotateX: 0,
			rotateZ: 0,
			zIndex: 0,
			transition: baseTransition
		};
	};

	const handleSwipe = (offset, velocity) => {
		const swipe = Math.abs(offset) * velocity;
		const threshold = 5000;

		if (swipe > threshold) {
			setIsPaused(true);
			if (offset < 0) {
				// Swipe izquierda - siguiente
				setDirection(1);
				setCurrentIndex((prev) => (prev + 1) % projects.length);
			} else {
				// Swipe derecha - anterior
				setDirection(-1);
				setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
			}
			setTimeout(() => setIsPaused(false), 10000);
		}
	};

	return (
		<div>
			<div className="horizontal-carousel-container" style={CAROUSEL_CONTAINER_STYLE}>
				{projects.map((project, index) => (
					<motion.div
						key={project.id}
						className="horizontal-carousel-slide"
						style={{
							position: 'absolute',
							width: '600px',
							maxWidth: '90vw',
							transformStyle: 'preserve-3d'
						}}
						animate={getCardStyle(index)}
						drag="x"
						dragConstraints={{left: 0, right: 0}}
						dragElastic={0.2}
						onDragEnd={(e, {offset, velocity}) => {
							handleSwipe(offset.x, velocity.x);
						}}
						whileTap={{cursor: 'grabbing'}}
					>
						<ProjectSlide project={project} />
					</motion.div>
				))}
			</div>

			{/* Dots Navigation */}
			<div style={DOTS_CONTAINER_STYLE}>
				{projects.map((_, index) => (
					<motion.div
						key={index}
						style={{
							...DOT_STYLE,
							backgroundColor: index === currentIndex ? '#a855f7' : 'transparent'
						}}
						whileHover={{
							scale: 1.3,
							backgroundColor: '#ec4899'
						}}
						whileTap={{scale: 0.9}}
						onClick={() => handleDotClick(index)}
					/>
				))}
			</div>
		</div>
	);
}

export default HorizontalCarousel;
