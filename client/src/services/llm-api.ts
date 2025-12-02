// LLM Integration Service - Google Gemini API (Free Tier)
// Optimized for the free tier with generous rate limits

interface LLMResponse {
  success: boolean;
  answer: string;
  error?: string;
}

export const llmAPI = {
  // Use Google Gemini API (FREE - 1,500 requests/day)
  async ask(question: string): Promise<LLMResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBIFQnE1uakec_25GvvSSAaSqBILRyMd2g';
    
    if (!apiKey) {
      return { 
        success: false, 
        answer: '', 
        error: 'Gemini API key not found' 
      };
    }

    // Retry logic with exponential backoff
    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Querying Gemini (attempt ${attempt + 1}/${maxRetries}):`, question);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: question,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 16384,
                temperature: 0.7,
                topP: 1,
                topK: 40,
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData.error?.message || 'API Error';
          
          // Retry on 429 (rate limit), 503 (unavailable), 500+ (server errors)
          if ((response.status === 429 || response.status >= 500) && attempt < maxRetries - 1) {
            const delay = Math.min(2000 * Math.pow(2, attempt), 15000);
            console.log(`Retry (${response.status}). Waiting ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
          
          return { 
            success: false, 
            answer: '', 
            error: `Gemini error: ${errorMsg}` 
          };
        }

        const data = await response.json();
        
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const answer = data.candidates[0].content.parts[0].text;
          console.log('Gemini response received');
          return { success: true, answer };
        }

        if (data.promptFeedback?.blockReason) {
          return { 
            success: false, 
            answer: '', 
            error: `Content blocked by Gemini safety filters` 
          };
        }

        return { 
          success: false, 
          answer: '', 
          error: 'No response from Gemini' 
        };
      } catch (error: any) {
        console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, error.message);
        
        // Retry on timeout or network errors
        if (attempt < maxRetries - 1) {
          const delay = Math.min(3000 * Math.pow(2, attempt), 20000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        
        return { 
          success: false, 
          answer: '', 
          error: `Connection error: ${error.message}` 
        };
      }
    }

    return { 
      success: false, 
      answer: '', 
      error: 'Failed after multiple retries. Please try again.' 
    };
  },
};
