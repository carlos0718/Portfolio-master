import React from 'react';
import {BsRobot, BsTrash} from 'react-icons/bs';
import {motion} from 'framer-motion';
import {useChatContext} from '../../context/ChatContext';

function ChatHeader() {
	const {clearChat} = useChatContext();

	return (
		<div className='chat-header'>
			<div className='chat-header-content'>
				<div className='chat-header-avatar'>
					<BsRobot size={24} />
				</div>
				<div className='chat-header-info'>
					<h4>Asistente Virtual</h4>
					<p>
						<span className='status-dot-chat'></span>
						En línea
					</p>
				</div>
			</div>

			<motion.button
				className='chat-header-clear'
				onClick={clearChat}
				whileHover={{scale: 1.1}}
				whileTap={{scale: 0.9}}
				title='Limpiar conversación'
			>
				<BsTrash size={18} />
			</motion.button>
		</div>
	);
}

export default ChatHeader;
