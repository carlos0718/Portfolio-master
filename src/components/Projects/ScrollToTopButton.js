import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {BiArrowToTop} from 'react-icons/bi';

const BUTTON_STYLE = {
	position: 'fixed',
	bottom: '40px',
	right: '40px',
	width: '56px',
	height: '56px',
	borderRadius: '50%',
	background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
	border: '2px solid #a855f7',
	color: 'white',
	fontSize: '24px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
	zIndex: 1000,
	boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4)'
};

function ScrollToTopButton() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.pageYOffset > 500) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener('scroll', toggleVisibility);

		return () => window.removeEventListener('scroll', toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					className="scroll-to-top-button"
					style={BUTTON_STYLE}
					initial={{opacity: 0, scale: 0, rotate: -180}}
					animate={{opacity: 1, scale: 1, rotate: 0}}
					exit={{opacity: 0, scale: 0, rotate: 180}}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 25
					}}
					whileHover={{
						scale: 1.15,
						boxShadow: '0 12px 40px rgba(168, 85, 247, 0.6)'
					}}
					whileTap={{scale: 0.9}}
					onClick={scrollToTop}
					aria-label="Volver arriba"
				>
					<BiArrowToTop />
				</motion.button>
			)}
		</AnimatePresence>
	);
}

export default ScrollToTopButton;
