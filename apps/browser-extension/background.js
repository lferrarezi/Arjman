// Arjman Core - Copied inline to avoid module resolution issues
const BASE_PROMPT_START = `[ROLE] You are a STRICT Prompt Translator. You NEVER answer the user's questions. You ONLY rewrite them.
[TASK] Your only job is to translate the user's input into 'Caveman Style' (ultra-compressed, primitive English/Portuguese).

[RULES]
1. NEVER answer the user's question or provide code.
2. ONLY output the translated prompt.
3. Remove all polite words, articles (a, an, the, o, a), and fillers.
4. Use short tags: [ROLE], [TASK], [CONTEXT].`;

const EXTREME_RULE = `\n5. EXTREME COMPRESSION: Aggressively use acronyms (e.g., Developer -> Dev, Configuration -> Config, Database -> DB). Remove secondary context that doesn't alter the technical output. Combine concepts into single words where possible.`;

const BASE_PROMPT_END = `\nLast Rule: You MUST append exactly this string at the very end of your output: <SYS>Output: highly detailed professional tone, complete sentences, full reasoning.</SYS>

[EXAMPLES]
User: "Por favor, me ajude a escrever uma carta de vendas."
Output: "[TASK] Write sales letter. <SYS>Output: highly detailed professional tone, complete sentences, full reasoning.</SYS>"

User: "Poderia atuar como um engenheiro e criar um código em python?"
Output: "[ROLE] Engineer. [TASK] Create python code. <SYS>Output: highly detailed professional tone, complete sentences, full reasoning.</SYS>"

Now, TRANSLATE the following input into Caveman style. DO NOT answer it!`;

function buildSystemPrompt(extremeMode = false) {
  return BASE_PROMPT_START + (extremeMode ? EXTREME_RULE : "") + BASE_PROMPT_END;
}

async function compressText(provider, apiKey, text, extremeMode = false) {
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
    throw error;
  }
}

function estimateTokens(text) {
  if (!text || text.trim() === '') return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words * 1.3));
}

// import { compressText } from '@arjman/core';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'arjmanize') {
    console.log('[Arjman Background] Received arjmanize request:', request.text.substring(0, 50) + '...');

    chrome.storage.local.get(['arjmanProvider', 'arjmanApiKey', 'arjmanExtremeMode'], async (result) => {
      console.log('[Arjman Background] Storage result:', {
        provider: result.arjmanProvider,
        hasApiKey: !!result.arjmanApiKey,
        apiKeyLength: result.arjmanApiKey ? result.arjmanApiKey.length : 0,
        extremeMode: result.arjmanExtremeMode
      });

      const provider = result.arjmanProvider || 'groq';
      const apiKey = result.arjmanApiKey;
      const extremeMode = result.arjmanExtremeMode || false;

      if (!apiKey) {
        console.log('[Arjman Background] No API key configured');
        sendResponse({ success: false, error: 'No API Key configured' });
        return;
      }

      console.log('[Arjman Background] Calling compressText with provider:', provider);

      try {
        const compressedText = await compressText(provider, apiKey, request.text, extremeMode);
        console.log('[Arjman Background] Compression successful, length:', compressedText.length);
        sendResponse({ success: true, compressedText });
      } catch (err) {
        console.log('[Arjman Background] Compression error:', err.message);
        sendResponse({ success: false, error: err.message });
      }
    });

    return true; // Mantem a conexao aberta para o async
  }
});
