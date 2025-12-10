import React from 'react';
import {motion} from 'framer-motion';
import {BsRobot} from 'react-icons/bs';

function TypingIndicator() {
	return (
		<div className='chat-message chat-message-assistant'>
			<div className='chat-message-avatar'>
				<BsRobot size={20} />
			</div>

			<div className='chat-message-content'>
				<div className='chat-message-bubble chat-typing-indicator'>
					<motion.span
						animate={{opacity: [0.4, 1, 0.4]}}
						transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
					>
						●
					</motion.span>
					<motion.span
						animate={{opacity: [0.4, 1, 0.4]}}
						transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2}}
					>
						●
					</motion.span>
					<motion.span
						animate={{opacity: [0.4, 1, 0.4]}}
						transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4}}
					>
						●
					</motion.span>
				</div>
			</div>
		</div>
	);
}

export default TypingIndicator;
