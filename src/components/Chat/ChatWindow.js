import React, {useState, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {BsX, BsRobot, BsTrash, BsSend} from 'react-icons/bs';
import {useChatContext} from '../../context/ChatContext';
import './Chat.css';

function ChatWindow() {
	const {isOpen, toggleChat, messages, isLoading, sendMessage, clearChat} = useChatContext();
	const [input, setInput] = useState('');
	const outputRef = useRef(null);
	const inputRef = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (input.trim() && !isLoading) {
			sendMessage(input);
			setInput('');
			inputRef.current?.focus();
		}
	};

	// Get only assistant messages for output display
	const assistantMessages = messages.filter((msg) => msg.role === 'assistant' || msg.role === 'error');
	const lastMessage = assistantMessages[assistantMessages.length - 1];

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
								<div>
									<h3>AI Assistant Playground</h3>
									<p>Ask me anything about Carlos's professional profile</p>
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

						{/* Output Section */}
						<div className='chat-modal-output' ref={outputRef}>
							<div className='chat-modal-output-label'>Response</div>
							<div className='chat-modal-output-content'>
								{isLoading ? (
									<div className='chat-modal-loading'>
										<motion.div
											className='chat-modal-loading-dots'
											initial={{opacity: 0}}
											animate={{opacity: 1}}
										>
											<motion.span
												animate={{opacity: [0.4, 1, 0.4]}}
												transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
											>
												●
											</motion.span>
											<motion.span
												animate={{opacity: [0.4, 1, 0.4]}}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													ease: 'easeInOut',
													delay: 0.2
												}}
											>
												●
											</motion.span>
											<motion.span
												animate={{opacity: [0.4, 1, 0.4]}}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													ease: 'easeInOut',
													delay: 0.4
												}}
											>
												●
											</motion.span>
										</motion.div>
										<span className='chat-modal-loading-text'>Thinking...</span>
									</div>
								) : lastMessage ? (
									<motion.div
										key={lastMessage.id}
										initial={{opacity: 0, y: 10}}
										animate={{opacity: 1, y: 0}}
										transition={{duration: 0.3}}
										className={
											lastMessage.role === 'error' ? 'chat-modal-output-error' : ''
										}
									>
										{lastMessage.content}
									</motion.div>
								) : (
									<div className='chat-modal-output-placeholder'>
										Ask a question to get started...
									</div>
								)}
							</div>
						</div>

						{/* Input Section */}
						<div className='chat-modal-input-section'>
							<div className='chat-modal-input-label'>Your Question</div>
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
									rows={3}
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
