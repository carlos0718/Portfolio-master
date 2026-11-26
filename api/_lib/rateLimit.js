// Simple in-memory rate limiting
// For production with multiple serverless instances, consider Vercel KV or Upstash Redis

const requestMap = new Map();
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60000; // 1 minute

export function checkRateLimit(clientIp) {
	const now = Date.now();
	const userRequests = requestMap.get(clientIp) || [];

	// Filter out requests outside the current time window
	const recentRequests = userRequests.filter((timestamp) => now - timestamp < WINDOW_MS);

	if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
		const oldestRequest = Math.min(...recentRequests);
		const retryAfter = Math.ceil((oldestRequest + WINDOW_MS - now) / 1000);

		return {allowed: false, retryAfter};
	}

	// Add current request timestamp
	recentRequests.push(now);
	requestMap.set(clientIp, recentRequests);

	// Cleanup old IPs periodically to prevent memory leaks
	if (requestMap.size > 1000) {
		for (const [ip, timestamps] of requestMap.entries()) {
			if (now - Math.max(...timestamps) > WINDOW_MS * 5) {
				requestMap.delete(ip);
			}
		}
	}

	return {allowed: true};
}
