// Vercel Serverless Function for AI Chat
import {GoogleGenerativeAI} from '@google/generative-ai';
import {buildSystemPrompt} from './lib/promptBuilder.js';
import {checkRateLimit} from './lib/rateLimit.js';

export default async function handler(req, res) {
	// CORS headers
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	// Handle OPTIONS request for CORS preflight
	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	// Only allow POST requests
	if (req.method !== 'POST') {
		return res.status(405).json({error: 'Method not allowed'});
	}

	try {
		// Rate limiting
		const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const rateLimitCheck = checkRateLimit(clientIp);

		if (!rateLimitCheck.allowed) {
			return res.status(429).json({
				error: 'Too many requests. Please try again later.',
				retryAfter: rateLimitCheck.retryAfter
			});
		}

		const {message, conversationHistory = []} = req.body;

		// Validate message
		if (!message || typeof message !== 'string') {
			return res.status(400).json({error: 'Invalid message'});
		}

		if (message.length > 1000) {
			return res.status(400).json({error: 'Message too long (max 1000 characters)'});
		}

		// Check for API key
		if (!process.env.GEMINI_API_KEY) {
			console.error('GEMINI_API_KEY not found in environment variables');
			return res.status(500).json({
				error: 'Chat service is not configured properly. Please contact support.'
			});
		}

		// Initialize Gemini AI
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash-lite'});

		// Build system prompt with professional data
		const systemPrompt = await buildSystemPrompt();

		// Format conversation history for Gemini
		const chatHistory = conversationHistory.map((msg) => ({
			role: msg.role === 'user' ? 'user' : 'model',
			parts: [{text: msg.content}]
		}));

		// Start chat with system prompt and history
		const chat = model.startChat({
			history: [
				{role: 'user', parts: [{text: systemPrompt}]},
				{
					role: 'model',
					parts: [
						{
							text: "Understood. I will act as Carlos Jesús's professional assistant, responding in the same language as queries and providing accurate information about his experience, skills, and career preferences."
						}
					]
				},
				...chatHistory
			],
			generationConfig: {
				maxOutputTokens: 800,
				temperature: 0.7,
				topP: 0.9
			}
		});

		// Send user message
		const result = await chat.sendMessage(message);
		const response = await result.response;
		const text = response.text();

		return res.status(200).json({
			response: text,
			conversationId: Date.now()
		});
	} catch (error) {
		console.error('Chat API Error:', error);
		console.error('Error message:', error.message);
		console.error('Error stack:', error.stack);

		// Handle specific error types
		if (error.message?.includes('quota')) {
			return res.status(503).json({
				error: 'The chat service is temporarily unavailable due to high demand. Please try again later.'
			});
		}

		if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
			return res.status(500).json({
				error: 'Chat service configuration error. Please verify GEMINI_API_KEY in environment variables.'
			});
		}

		return res.status(500).json({
			error: 'An error occurred processing your request. Please try again.',
			details: error.message
		});
	}
}
