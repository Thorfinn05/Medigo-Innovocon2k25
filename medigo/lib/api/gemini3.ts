import { GoogleGenerativeAI } from '@google/generative-ai';

import { GeminiAPIError } from './errors2';



if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Retry Configuration
  const MAX_RETRIES = 3; // Increased retries from 2 to 3
  const INITIAL_RETRY_DELAY = 3000; // Starts at 3s
  const MAX_RETRY_DELAY = 15000; // Caps at 15s
  
  // Rate Limiting Configuration
  const RATE_LIMIT_WINDOW = 60000; // 1 minute
  const MAX_REQUESTS_PER_WINDOW = 5; // Allows 5 requests per minute
  const MIN_REQUEST_INTERVAL = 1000; // Ensures at least 1s gap between requests
  
  // State Tracking for Rate Limiting
  let requestTimestamps: number[] = [];
  let lastRequestTime = 0;
  
  // Utility: Sleep function
  async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Rate Limiting Functions
  function isRateLimited(): boolean {
    const now = Date.now();
    requestTimestamps = requestTimestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
    return requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW;
  }
  
  async function enforceRequestInterval(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    lastRequestTime = Date.now();
  }
  
  async function waitForRateLimit(): Promise<void> {
    await enforceRequestInterval();
  
    if (!isRateLimited()) {
      requestTimestamps.push(Date.now());
      return;
    }
  
    const waitTime = RATE_LIMIT_WINDOW - (Date.now() - requestTimestamps[0]);
    console.warn(`🚨 Rate limit reached, waiting ${Math.round(waitTime / 1000)}s before retrying...`);
    await sleep(waitTime);
    return waitForRateLimit();
  }
  
  // Retry Logic with Exponential Backoff
  async function retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      await waitForRateLimit();
      return await operation();
    } catch (error) {
      if (!(error instanceof Error)) throw error;
  
      const errorMessage = error.message.toLowerCase();
      const isRetryable =
        errorMessage.includes('overloaded') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('resource exhausted') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('503 service unavailable');
  
      if (!isRetryable || retryCount >= MAX_RETRIES) {
        console.error('🛑 Maximum retries reached. Throwing error:', error.message);
        throw error;
      }
  
      // Extend wait time for 503 errors
      let delay;
      if (errorMessage.includes('503 service unavailable') || errorMessage.includes('overloaded')) {
        delay = 30000; // 30 seconds
        console.warn(`🚨 Model is overloaded. Waiting for ${delay / 1000}s before retrying...`);
      } else {
        const baseDelay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryCount), MAX_RETRY_DELAY);
        const jitter = Math.random() * (baseDelay * 0.1);
        delay = baseDelay + jitter;
      }
  
      console.warn(`🔁 Retrying after ${Math.round(delay / 1000)}s (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      await sleep(delay);
      return retryWithExponentialBackoff(operation, retryCount + 1);
    }
  }
  
  // JSON Cleanup Utility
  function cleanJsonResponse(text: string): string {
    const jsonMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
    if (jsonMatch) return jsonMatch[1].trim();
  
    const objectMatch = text.match(/({[\s\S]*})/);
    if (objectMatch) return objectMatch[1].trim();
  
    return text.trim();
  }
  
  // Main Function: Analyze Image
  export async function analyzeImage(base64Image: string, mimeType: string, prompt: string) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
      const generateResponse = async () => {
        const result = await model.generateContent([
          prompt,
          { inlineData: { mimeType, data: base64Image } }
        ]);
        return result.response;
      };
  
      const response = await retryWithExponentialBackoff(generateResponse);
      const analysisText = response.text();
  
      try {
        const cleanedText = cleanJsonResponse(analysisText);
        const parsedResponse = JSON.parse(cleanedText);
  
        if (typeof parsedResponse !== 'object' || parsedResponse === null) {
          throw new GeminiAPIError('Invalid response format from Gemini API');
        }
  
        return parsedResponse;
      } catch (error) {
        console.error('❌ Parsing error:', error);
        console.error('🔍 Raw response:', analysisText);
        throw new GeminiAPIError('Failed to parse Gemini API response as JSON');
      }
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
  
      if (error instanceof GeminiAPIError) throw error;
      
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
  
      if (errorMessage.includes('model not found')) {
        throw new GeminiAPIError('The specified Gemini model is not available. Please check your API configuration.');
      } else if (errorMessage.includes('permission denied')) {
        throw new GeminiAPIError('Access to the Gemini API was denied. Please check your API key and permissions.');
      } else if (errorMessage.includes('quota exceeded') || errorMessage.includes('resource exhausted')) {
        throw new GeminiAPIError('API quota exceeded. Please try again in a few minutes.');
      } else if (errorMessage.includes('overloaded')) {
        throw new GeminiAPIError('The service is currently experiencing high load. Please try again later.');
      }
  
      throw new GeminiAPIError(error instanceof Error ? error.message : 'Failed to analyze image');
    }
  }