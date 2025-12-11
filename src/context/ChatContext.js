import React, {createContext, useContext, useState, useCallback} from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error('useChatContext must be used within ChatProvider');
	}
	return context;
};

export const ChatProvider = ({children}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			id: 1,
			role: 'assistant',
			content:
				'¡Hola! 👋 Soy el asistente virtual de Carlos Jesús. Puedo responder preguntas sobre su experiencia profesional, proyectos, habilidades técnicas, expectativas salariales y más. ¿En qué puedo ayudarte?',
			timestamp: new Date()
		}
	]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const toggleChat = useCallback(() => {
		setIsOpen((prev) => !prev);
		setError(null); // Clear errors when toggling
	}, []);

	const sendMessage = useCallback(
		async (messageText) => {
			if (!messageText.trim()) return;

			// Add user message
			const userMessage = {
				id: Date.now(),
				role: 'user',
				content: messageText,
				timestamp: new Date()
			};

			setMessages((prev) => [...prev, userMessage]);
			setIsLoading(true);
			setError(null);

			try {
				// Prepare conversation history (last 10 messages for context)
				const conversationHistory = messages.slice(-10).map((msg) => ({
					role: msg.role,
					content: msg.content
				}));

				// Call API
				const response = await axios.post(
					'/api/chat',
					{
						message: messageText,
						conversationHistory
					},
					{
						timeout: 30000 // 30 second timeout
					}
				);

				// Add assistant response
				const assistantMessage = {
					id: Date.now() + 1,
					role: 'assistant',
					content: response.data.response,
					timestamp: new Date()
				};

				setMessages((prev) => [...prev, assistantMessage]);
			} catch (err) {
				console.error('Chat error:', err);

				let errorMessage =
					'Lo siento, hubo un error procesando tu mensaje. Por favor intenta nuevamente.';

				if (err.response?.status === 429) {
					errorMessage =
						'Has enviado demasiados mensajes. Por favor espera un momento e intenta nuevamente.';
				} else if (err.code === 'ECONNABORTED') {
					errorMessage = 'La solicitud tardó demasiado. Por favor intenta nuevamente.';
				} else if (err.response?.status === 503) {
					errorMessage =
						'El servicio de chat está temporalmente no disponible. Por favor intenta más tarde.';
				}

				setError(errorMessage);

				// Add error message to chat
				const errorMsg = {
					id: Date.now() + 1,
					role: 'error',
					content: errorMessage,
					timestamp: new Date()
				};

				setMessages((prev) => [...prev, errorMsg]);
			} finally {
				setIsLoading(false);
			}
		},
		[messages]
	);

	const clearChat = useCallback(() => {
		setMessages([
			{
				id: 1,
				role: 'assistant',
				content:
					'¡Hola! 👋 Soy el asistente virtual de Carlos Jesús. Puedo responder preguntas sobre su experiencia profesional, proyectos, habilidades técnicas, expectativas salariales y más. ¿En qué puedo ayudarte?',
				timestamp: new Date()
			}
		]);
		setError(null);
	}, []);

	const value = {
		isOpen,
		messages,
		isLoading,
		error,
		toggleChat,
		sendMessage,
		clearChat
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
