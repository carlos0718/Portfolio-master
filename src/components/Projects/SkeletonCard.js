import React from 'react';
import {motion} from 'framer-motion';

const SKELETON_CARD_STYLE = {
	background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.9) 0%, rgba(30, 20, 40, 0.9) 100%)',
	backdropFilter: 'blur(10px)',
	border: '1px solid rgba(168, 85, 247, 0.2)',
	borderRadius: '20px',
	padding: '24px',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	position: 'relative'
};

const SHIMMER_STYLE = {
	position: 'absolute',
	top: 0,
	left: '-100%',
	width: '100%',
	height: '100%',
	background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent)',
	pointerEvents: 'none'
};

const SKELETON_IMAGE_STYLE = {
	width: '100%',
	height: '200px',
	background: 'rgba(168, 85, 247, 0.1)',
	borderRadius: '12px',
	marginBottom: '20px',
	position: 'relative',
	overflow: 'hidden'
};

const SKELETON_TITLE_STYLE = {
	width: '70%',
	height: '24px',
	background: 'rgba(168, 85, 247, 0.1)',
	borderRadius: '8px',
	marginBottom: '12px'
};

const SKELETON_DATE_STYLE = {
	width: '40%',
	height: '14px',
	background: 'rgba(168, 85, 247, 0.08)',
	borderRadius: '6px',
	marginBottom: '16px'
};

const SKELETON_LINE_STYLE = {
	height: '14px',
	background: 'rgba(168, 85, 247, 0.08)',
	borderRadius: '6px',
	marginBottom: '8px'
};

const SKELETON_BUTTONS_STYLE = {
	display: 'flex',
	gap: '8px',
	marginTop: 'auto'
};

const SKELETON_BUTTON_STYLE = {
	flex: 1,
	height: '36px',
	background: 'rgba(168, 85, 247, 0.1)',
	borderRadius: '8px'
};

function SkeletonCard() {
	return (
		<div style={SKELETON_CARD_STYLE}>
			{/* Image skeleton */}
			<div style={SKELETON_IMAGE_STYLE}>
				<motion.div
					style={{
						...SHIMMER_STYLE,
						left: '-100%'
					}}
					animate={{
						left: '100%'
					}}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: 'linear'
					}}
				/>
			</div>

			{/* Title skeleton */}
			<div style={SKELETON_TITLE_STYLE} />

			{/* Date skeleton */}
			<div style={SKELETON_DATE_STYLE} />

			{/* Description skeleton */}
			<div style={{flex: 1, marginBottom: '16px'}}>
				<div style={{...SKELETON_LINE_STYLE, width: '100%'}} />
				<div style={{...SKELETON_LINE_STYLE, width: '95%'}} />
				<div style={{...SKELETON_LINE_STYLE, width: '80%'}} />
			</div>

			{/* Buttons skeleton */}
			<div style={SKELETON_BUTTONS_STYLE}>
				<div style={SKELETON_BUTTON_STYLE} />
				<div style={SKELETON_BUTTON_STYLE} />
			</div>
		</div>
	);
}

export default SkeletonCard;
