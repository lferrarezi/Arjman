export const BASE_PROMPT_START = `You are a Prompt Translator. ONLY rewrite the user input into ultra-compressed 'Caveman Style'. Preserve language and technical meaning. Remove articles, prepositions, fillers. Output ONLY the compressed text.`;

export const EXTREME_RULE = `\nUse aggressive acronyms (Dev, Config, DB). Strip secondary context. Focus on logical imperatives only.`;

export const BASE_PROMPT_END = ``;

export function buildSystemPrompt(extremeMode = false) {
  return BASE_PROMPT_START + (extremeMode ? EXTREME_RULE : BASE_PROMPT_END);
}

export async function compressText(provider, apiKey, text, extremeMode = false) {
  if (!apiKey || apiKey.trim() === '') throw new Error("API Key is required");
  if (!text || text.trim() === '') throw new Error("Input text is required");

  const systemPrompt = buildSystemPrompt(extremeMode);

  let url, model;
  if (provider === 'openai') {
    url = 'https://api.openai.com/v1/chat/completions';
    model = 'gpt-4o-mini';
  } else if (provider === 'groq') {
    url = 'https://api.groq.com/openai/v1/chat/completions';
    model = 'llama-3.1-8b-instant';
  } else if (provider === 'nvidia') {
    url = 'https://integrate.api.nvidia.com/v1/chat/completions';
    model = 'meta/llama3-8b-instruct';
  } else {
    throw new Error(`Unsupported provider: ${provider}. Use 'openai', 'groq', or 'nvidia'`);
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.1
      })
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Invalid API key. Please check your API key and try again.");
      } else if (res.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      } else if (res.status === 400) {
        throw new Error("Bad request. Please check your input and try again.");
      } else {
        throw new Error(`API Error (${res.status}): ${res.statusText}`);
      }
    }

    const data = await res.json();

    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error("Invalid API response format. Please try again.");
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Network error. Please check your internet connection and try again.");
    }
    throw error; // Re-throw other errors as-is
  }
}

export function estimateTokens(text) {
  if (!text || text.trim() === '') return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words * 1.3));
}
