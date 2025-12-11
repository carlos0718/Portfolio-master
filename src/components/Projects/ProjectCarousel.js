import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';
import ProjectSlide from './ProjectSlide';
import CarouselDots from './CarouselDots';

const AUTOPLAY_INTERVAL = 5000; // 5 segundos

const SLIDE_VARIANTS = {
	enter: (direction) => ({
		x: direction > 0 ? 1000 : -1000,
		opacity: 0,
		scale: 0.8
	}),
	center: {
		x: 0,
		opacity: 1,
		scale: 1,
		transition: {
			x: {type: 'spring', stiffness: 80, damping: 20},
			opacity: {duration: 0.6, ease: 'easeInOut'},
			scale: {duration: 0.6, ease: 'easeInOut'}
		}
	},
	exit: (direction) => ({
		x: direction < 0 ? 1000 : -1000,
		opacity: 0,
		scale: 0.8,
		transition: {
			x: {type: 'spring', stiffness: 80, damping: 20},
			opacity: {duration: 0.6, ease: 'easeInOut'},
			scale: {duration: 0.6, ease: 'easeInOut'}
		}
	})
};

const SWIPE_CONFIDENCE_THRESHOLD = 10000;

const swipePower = (offset, velocity) => {
	return Math.abs(offset) * velocity;
};

const NAV_BUTTON_STYLE = {
	position: 'absolute',
	top: '35%',
	transform: 'translateY(-50%)',
	background: 'rgba(168, 85, 247, 0.1)',
	border: '2px solid rgba(168, 85, 247, 0.3)',
	borderRadius: '50%',
	width: '50px',
	height: '50px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
	color: '#a855f7',
	fontSize: '24px',
	zIndex: 10,
	transition: 'all 0.3s ease'
};

function ProjectCarousel({projects, currentIndex, onNavigate}) {
	const currentProject = projects[currentIndex];
	const [direction, setDirection] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	// Autoplay
	useEffect(() => {
		if (isPaused || projects.length <= 1) return;

		const interval = setInterval(() => {
			setDirection(1);
			onNavigate((currentIndex + 1) % projects.length);
		}, AUTOPLAY_INTERVAL);

		return () => clearInterval(interval);
	}, [currentIndex, isPaused, projects.length, onNavigate]);

	const handlePrev = () => {
		setIsPaused(true);
		setDirection(-1);
		onNavigate((currentIndex - 1 + projects.length) % projects.length);
		// Reanudar autoplay después de 10 segundos
		setTimeout(() => setIsPaused(false), 10000);
	};

	const handleNext = () => {
		setIsPaused(true);
		setDirection(1);
		onNavigate((currentIndex + 1) % projects.length);
		// Reanudar autoplay después de 10 segundos
		setTimeout(() => setIsPaused(false), 10000);
	};

	const handleDotClick = (index) => {
		setIsPaused(true);
		setDirection(index > currentIndex ? 1 : -1);
		onNavigate(index);
		// Reanudar autoplay después de 10 segundos
		setTimeout(() => setIsPaused(false), 10000);
	};

	const paginate = (newDirection) => {
		setIsPaused(true);
		if (newDirection === 1) {
			setDirection(1);
			onNavigate((currentIndex + 1) % projects.length);
		} else {
			setDirection(-1);
			onNavigate((currentIndex - 1 + projects.length) % projects.length);
		}
		// Reanudar autoplay después de 10 segundos
		setTimeout(() => setIsPaused(false), 10000);
	};

	return (
		<div style={{position: 'relative', maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px'}}>
			{/* Navigation Buttons */}
			<motion.button
				whileHover={{
					scale: 1.15,
					backgroundColor: 'rgba(168, 85, 247, 0.2)',
					transition: {duration: 0.3}
				}}
				whileTap={{scale: 0.9}}
				onClick={handlePrev}
				style={{...NAV_BUTTON_STYLE, left: '-60px'}}
				aria-label='Proyecto anterior'
			>
				<BsChevronLeft />
			</motion.button>

			<motion.button
				whileHover={{
					scale: 1.15,
					backgroundColor: 'rgba(168, 85, 247, 0.2)',
					transition: {duration: 0.3}
				}}
				whileTap={{scale: 0.9}}
				onClick={handleNext}
				style={{...NAV_BUTTON_STYLE, right: '-60px'}}
				aria-label='Siguiente proyecto'
			>
				<BsChevronRight />
			</motion.button>

			{/* Carousel Slide Container */}
		{/* Fixed height container to prevent layout shift during transitions */}
			<div
				style={{
					overflow: 'hidden',
					position: 'relative',
					width: '100%',
					minHeight: '500px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<AnimatePresence mode='wait' custom={direction}>
					<motion.div
						key={currentIndex}
						custom={direction}
						variants={SLIDE_VARIANTS}
						initial='enter'
						animate='center'
						exit='exit'
						drag='x'
						dragConstraints={{left: 0, right: 0}}
						dragElastic={1}
						onDragEnd={(e, {offset, velocity}) => {
							const swipe = swipePower(offset.x, velocity.x);

							if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
								paginate(1);
							} else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
								paginate(-1);
							}
						}}
						style={{
							cursor: 'grab',
							width: '100%',
							position: 'absolute',
							top: 0,
							left: 0
						}}
						whileTap={{cursor: 'grabbing'}}
					>
						<ProjectSlide project={currentProject} />
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Pagination Dots */}
			<CarouselDots projects={projects} currentIndex={currentIndex} onDotClick={handleDotClick} />
		</div>
	);
}

export default ProjectCarousel;
