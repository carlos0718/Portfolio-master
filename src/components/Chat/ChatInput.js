import React, {useState, useRef} from 'react';
import {BsSend} from 'react-icons/bs';
import {motion} from 'framer-motion';
import {useChatContext} from '../../context/ChatContext';

function ChatInput() {
	const [input, setInput] = useState('');
	const {sendMessage, isLoading} = useChatContext();
	const inputRef = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (input.trim() && !isLoading) {
			sendMessage(input);
			setInput('');
			inputRef.current?.focus();
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<form className='chat-input-container' onSubmit={handleSubmit}>
			<input
				ref={inputRef}
				type='text'
				className='chat-input'
				placeholder='Escribe tu mensaje...'
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				disabled={isLoading}
				autoFocus
			/>

			<motion.button
				type='submit'
				className='chat-send-button'
				disabled={!input.trim() || isLoading}
				whileHover={{scale: 1.05}}
				whileTap={{scale: 0.95}}
			>
				<BsSend size={18} />
			</motion.button>
		</form>
	);
}

export default ChatInput;
