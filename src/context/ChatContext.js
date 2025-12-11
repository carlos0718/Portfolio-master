import React, {createContext, useContext, useState, useCallback, useEffect} from 'react';
import axios from 'axios';

const ChatContext = createContext();

// LocalStorage key for chat messages
const CHAT_STORAGE_KEY = 'carlos_portfolio_chat_messages';
const CHAT_EXPIRY_KEY = 'carlos_portfolio_chat_expiry';
const CHAT_EXPIRY_HOURS = 24; // Messages expire after 24 hours

// Welcome message
const WELCOME_MESSAGE = {
	id: 1,
	role: 'assistant',
	content:
		'¡Hola! 👋 Soy el asistente virtual de Carlos Jesús. Puedo responder preguntas sobre su experiencia profesional, proyectos, habilidades técnicas, expectativas salariales y más. ¿En qué puedo ayudarte?',
	timestamp: new Date()
};

// Helper functions for localStorage
const loadMessagesFromStorage = () => {
	try {
		const stored = localStorage.getItem(CHAT_STORAGE_KEY);
		const expiry = localStorage.getItem(CHAT_EXPIRY_KEY);

		// Check if messages have expired
		if (expiry && new Date().getTime() > parseInt(expiry)) {
			localStorage.removeItem(CHAT_STORAGE_KEY);
			localStorage.removeItem(CHAT_EXPIRY_KEY);
			return [WELCOME_MESSAGE];
		}

		if (stored) {
			const parsed = JSON.parse(stored);
			// Ensure we have at least the welcome message
			return parsed.length > 0 ? parsed : [WELCOME_MESSAGE];
		}
	} catch (error) {
		console.error('Error loading messages from localStorage:', error);
	}
	return [WELCOME_MESSAGE];
};

const saveMessagesToStorage = (messages) => {
	try {
		localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
		// Set expiry time (24 hours from now)
		const expiryTime = new Date().getTime() + CHAT_EXPIRY_HOURS * 60 * 60 * 1000;
		localStorage.setItem(CHAT_EXPIRY_KEY, expiryTime.toString());
	} catch (error) {
		console.error('Error saving messages to localStorage:', error);
	}
};

const clearMessagesFromStorage = () => {
	try {
		localStorage.removeItem(CHAT_STORAGE_KEY);
		localStorage.removeItem(CHAT_EXPIRY_KEY);
	} catch (error) {
		console.error('Error clearing messages from localStorage:', error);
	}
};

export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error('useChatContext must be used within ChatProvider');
	}
	return context;
};

export const ChatProvider = ({children}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState(() => loadMessagesFromStorage());
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Save messages to localStorage whenever they change
	useEffect(() => {
		saveMessagesToStorage(messages);
	}, [messages]);

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
		clearMessagesFromStorage();
		setMessages([WELCOME_MESSAGE]);
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
