import React, {useState, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {BsX, BsRobot, BsTrash, BsSend} from 'react-icons/bs';
import {useChatContext} from '../../context/ChatContext';
import './Chat.css';

// Helper function to parse and style message content
function parseMessageContent(text) {
	// First, split by URLs
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const parts = [];

	text.split('\n').forEach((line, lineIndex) => {
		if (lineIndex > 0) {
			parts.push(<br key={`br-${lineIndex}`} />);
		}

		const urlParts = line.split(urlRegex);

		urlParts.forEach((part, index) => {
			if (part.match(urlRegex)) {
				// Render URLs as clickeable links
				parts.push(
					<a
						key={`url-${lineIndex}-${index}`}
						href={part}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							color: '#a855f7',
							textDecoration: 'underline',
							cursor: 'pointer'
						}}
					>
						{part}
					</a>
				);
			} else {
				// Check for company/project names with colon pattern (e.g., "Globons:", "Proyecto Javit:")
				const titleRegex = /^([A-Z][A-Za-z0-9\s&.-]+):/;
				const match = part.match(titleRegex);

				if (match) {
					const title = match[1];
					const rest = part.substring(match[0].length);
					parts.push(
						<span key={`title-${lineIndex}-${index}`}>
							<span style={{color: '#a855f7', fontWeight: '600'}}>{title}:</span>
							{rest}
						</span>
					);
				} else {
					parts.push(<span key={`text-${lineIndex}-${index}`}>{part}</span>);
				}
			}
		});
	});

	return parts;
}

function ChatWindow() {
	const {isOpen, toggleChat, messages, isLoading, sendMessage, clearChat} = useChatContext();
	const [input, setInput] = useState('');
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (input.trim() && !isLoading) {
			sendMessage(input);
			setInput('');
			inputRef.current?.focus();
		}
	};

	// Auto scroll to bottom when new messages arrive
	React.useEffect(() => {
		messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
	}, [messages, isLoading]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						className='chat-backdrop'
						initial={{opacity: 0}}
						animate={{opacity: 1}}
						exit={{opacity: 0}}
						onClick={toggleChat}
					/>

					{/* Modal */}
					<motion.div
						className='chat-modal'
						initial={{opacity: 0, scale: 0.9, y: 20}}
						animate={{opacity: 1, scale: 1, y: 0}}
						exit={{opacity: 0, scale: 0.9, y: 20}}
						transition={{type: 'spring', stiffness: 300, damping: 30}}
					>
						{/* Header */}
						<div className='chat-modal-header'>
							<div className='chat-modal-header-left'>
								<div className='chat-modal-icon'>
									<BsRobot size={24} />
								</div>
								<div className='chat-modal-title-container'>
									<h3>
										AI Assistant
										<span className='chat-modal-separator'> | </span>
										<span className='chat-modal-subtitle'>Ask me anything about Carlos's professional profile</span>
									</h3>
								</div>
							</div>
							<div className='chat-modal-header-actions'>
								<motion.button
									className='chat-modal-action-btn'
									onClick={clearChat}
									whileHover={{scale: 1.1}}
									whileTap={{scale: 0.9}}
									title='Clear conversation'
								>
									<BsTrash size={18} />
								</motion.button>
								<motion.button
									className='chat-modal-close-btn'
									onClick={toggleChat}
									whileHover={{scale: 1.1, rotate: 90}}
									whileTap={{scale: 0.9}}
									title='Close'
								>
									<BsX size={28} />
								</motion.button>
							</div>
						</div>

						{/* Messages Section */}
						<div className='chat-messages-container'>
							{messages.length === 0 ? (
								<div className='chat-empty-state'>
									<BsRobot size={48} style={{opacity: 0.3, marginBottom: '16px'}} />
									<p>Ask me anything about Carlos's professional profile!</p>
								</div>
							) : (
								<>
									{messages.map((msg, index) => (
										<motion.div
											key={msg.id || index}
											className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
											initial={{opacity: 0, y: 10}}
											animate={{opacity: 1, y: 0}}
											transition={{duration: 0.3}}
										>
											{msg.role === 'assistant' && (
												<div className='chat-message-avatar'>
													<BsRobot size={18} />
												</div>
											)}
											<div className={`chat-message-bubble ${msg.role === 'error' ? 'chat-message-error' : ''}`}>
												{parseMessageContent(msg.content)}
											</div>
										</motion.div>
									))}
									{isLoading && (
										<motion.div
											className='chat-message chat-message-assistant'
											initial={{opacity: 0, y: 10}}
											animate={{opacity: 1, y: 0}}
										>
											<div className='chat-message-avatar'>
												<BsRobot size={18} />
											</div>
											<div className='chat-message-bubble chat-message-loading'>
												<motion.span
													animate={{opacity: [0.4, 1, 0.4]}}
													transition={{duration: 1.5, repeat: Infinity}}
												>
													●
												</motion.span>
												<motion.span
													animate={{opacity: [0.4, 1, 0.4]}}
													transition={{duration: 1.5, repeat: Infinity, delay: 0.2}}
												>
													●
												</motion.span>
												<motion.span
													animate={{opacity: [0.4, 1, 0.4]}}
													transition={{duration: 1.5, repeat: Infinity, delay: 0.4}}
												>
													●
												</motion.span>
											</div>
										</motion.div>
									)}
									<div ref={messagesEndRef} />
								</>
							)}
						</div>

						{/* Input Section */}
						<div className='chat-modal-input-section'>
							<form onSubmit={handleSubmit} className='chat-modal-input-form'>
								<textarea
									ref={inputRef}
									className='chat-modal-input-textarea'
									placeholder='e.g., What technologies does Carlos work with?'
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleSubmit(e);
										}
									}}
									disabled={isLoading}
									rows={2}
									autoFocus
								/>
								<div className='chat-modal-input-footer'>
									<div className='chat-modal-input-hint'>
										Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
									</div>
									<motion.button
										type='submit'
										className='chat-modal-send-btn'
										disabled={!input.trim() || isLoading}
										whileHover={{scale: 1.02}}
										whileTap={{scale: 0.98}}
									>
										<BsSend size={16} />
										<span>Send</span>
									</motion.button>
								</div>
							</form>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

export default ChatWindow;
