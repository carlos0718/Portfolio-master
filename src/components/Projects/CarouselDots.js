import React from 'react';
import {motion} from 'framer-motion';

const DOTS_CONTAINER_STYLE = {
	display: 'flex',
	justifyContent: 'center',
	gap: '12px',
	marginTop: '-50px'
};

const dotVariants = {
	active: {
		scale: 1,
		backgroundColor: '#a855f7',
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 20
		}
	},
	inactive: {
		scale: 1,
		backgroundColor: 'rgba(168, 85, 247, 0.3)',
		transition: {
			duration: 0.3
		}
	}
};

function CarouselDots({projects, currentIndex, onDotClick}) {
	return (
		<div style={DOTS_CONTAINER_STYLE}>
			{projects.map((_, index) => (
				<motion.button
					key={index}
					variants={dotVariants}
					initial='inactive'
					animate={index === currentIndex ? 'active' : 'inactive'}
					whileHover={{
						scale: 1.3,
						backgroundColor: index === currentIndex ? '#b866ff' : 'rgba(168, 85, 247, 0.5)',
						transition: {duration: 0.2}
					}}
					whileTap={{scale: 0.9}}
					onClick={() => onDotClick(index)}
					style={{
						width: index === currentIndex ? '32px' : '12px',
						height: '12px',
						borderRadius: '6px',
						border: 'none',
						cursor: 'pointer',
						transition: 'width 0.3s ease'
					}}
					aria-label={`Ir a proyecto ${index + 1}`}
				/>
			))}
		</div>
	);
}

export default CarouselDots;
