// Dólar Blue API: https://dolarapi.com/
let cachedRate = null;
let cacheTimestamp = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function getExchangeRate() {
	// Check cache
	if (cachedRate && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
		return cachedRate;
	}

	try {
		const response = await fetch('https://dolarapi.com/v1/dolares/blue');
		const data = await response.json();

		// Use "venta" (sell) rate as requested
		cachedRate = data.venta || 1200; // Fallback to 1200 if API fails
		cacheTimestamp = Date.now();

		return cachedRate;
	} catch (error) {
		console.error('Error fetching exchange rate:', error);
		// Return cached value or fallback
		return cachedRate || 1200;
	}
}
