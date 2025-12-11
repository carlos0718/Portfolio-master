import React from 'react';
import {motion} from 'framer-motion';
import {BsRobot, BsPerson} from 'react-icons/bs';

function ChatMessage({message}) {
	const isUser = message.role === 'user';
	const isError = message.role === 'error';

	// Format timestamp
	const timeString = message.timestamp.toLocaleTimeString('es-AR', {
		hour: '2-digit',
		minute: '2-digit'
	});

	return (
		<motion.div
			className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'} ${isError ? 'chat-message-error' : ''}`}
			initial={{opacity: 0, y: 10}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.3}}
		>
			{!isUser && (
				<div className='chat-message-avatar'>
					<BsRobot size={20} />
				</div>
			)}

			<div className='chat-message-content'>
				<div className='chat-message-bubble'>{message.content}</div>
				<div className='chat-message-time'>{timeString}</div>
			</div>

			{isUser && (
				<div className='chat-message-avatar chat-message-avatar-user'>
					<BsPerson size={20} />
				</div>
			)}
		</motion.div>
	);
}

export default ChatMessage;
