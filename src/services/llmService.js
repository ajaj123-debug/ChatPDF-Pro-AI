/**
 * llmService.js
 * Handles all communication with the Gemini API.
 * Swap API_URL and payload shape here to use a different LLM provider.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * Send a prompt to Gemini and receive a text response.
 * @param {string} prompt - The full prompt string.
 * @returns {Promise<string>} The model's text response.
 */
export async function generateContent(prompt) {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error(
      'Gemini API key not set. Please add VITE_GEMINI_API_KEY to your .env file.'
    );
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `API request failed with status ${response.status}`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('No content returned from the API.');
  return text;
}

/**
 * Summarize a document in 5–7 bullet points.
 * @param {string} fullText - The entire extracted PDF text.
 * @returns {Promise<string>} Bullet-point summary.
 */
export async function summarizeDocument(fullText) {
  // Trim to avoid token overflow (~100k chars ≈ ~25k tokens, safe for Flash)
  const trimmed = fullText.slice(0, 100_000);
  const prompt = `You are an AI assistant. Summarize the following document in 5-7 concise bullet points. 
Each bullet point should start with "•" and cover a distinct key idea. Be precise and informative.

Document:
${trimmed}`;
  return generateContent(prompt);
}

/**
 * Answer a question using page-aware document context.
 * @param {string} context - Formatted "Page N: ..." string.
 * @param {string} question - The user's question.
 * @returns {Promise<string>} Answer with page citations.
 */
export async function answerQuestion(context, question) {
  // Trim context to avoid overflow
  const trimmed = context.slice(0, 120_000);
  const prompt = `You are answering questions based ONLY on the provided document.

Document:
${trimmed}

Instructions:
- Answer clearly and concisely
- ALWAYS mention the page number(s) where the answer is found using the format "Page X" or "Pages X and Y"
- If the answer is not found in the document, say exactly: "Not found in document"
- Do not use outside knowledge

Question: ${question}`;
  return generateContent(prompt);
}
