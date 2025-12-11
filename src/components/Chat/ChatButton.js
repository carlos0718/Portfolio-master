import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {BsRobot, BsX} from 'react-icons/bs';
import {useChatContext} from '../../context/ChatContext';
import './Chat.css';

function ChatButton() {
	const {isOpen, toggleChat} = useChatContext();
	const [showBadge, setShowBadge] = useState(true);

	// Hide badge after 10 seconds or when chat is opened
	useEffect(() => {
		const timer = setTimeout(() => setShowBadge(false), 10000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (isOpen) setShowBadge(false);
	}, [isOpen]);

	return (
		<motion.div
			className='chat-button-container'
			initial={{scale: 0, opacity: 0}}
			animate={{scale: 1, opacity: 1}}
			transition={{
				type: 'spring',
				stiffness: 260,
				damping: 20,
				delay: 2 // Appear after 2 seconds
			}}
		>
			<motion.button
				className={`chat-button ${isOpen ? 'chat-button-open' : ''}`}
				onClick={toggleChat}
				whileHover={{scale: 1.1}}
				whileTap={{scale: 0.95}}
				aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
			>
				<AnimatePresence mode='wait'>
					{isOpen ? (
						<motion.div
							key='close'
							initial={{rotate: -90, opacity: 0}}
							animate={{rotate: 0, opacity: 1}}
							exit={{rotate: 90, opacity: 0}}
							transition={{duration: 0.2}}
						>
							<BsX size={32} />
						</motion.div>
					) : (
						<motion.div
							key='open'
							initial={{rotate: 90, opacity: 0}}
							animate={{rotate: 0, opacity: 1}}
							exit={{rotate: -90, opacity: 0}}
							transition={{duration: 0.2}}
						>
							<BsRobot size={28} />
						</motion.div>
					)}
				</AnimatePresence>
			</motion.button>

			{/* Attention badge with pulse animation */}
			<AnimatePresence>
				{showBadge && !isOpen && (
					<motion.div
						className='chat-badge'
						initial={{scale: 0}}
						animate={{scale: 1}}
						exit={{scale: 0}}
					>
						<motion.div
							className='chat-badge-pulse'
							animate={{
								scale: [1, 1.2, 1],
								opacity: [1, 0.7, 1]
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: 'easeInOut'
							}}
						/>
						<span className='chat-badge-text'>¡Hola!</span>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export default ChatButton;
