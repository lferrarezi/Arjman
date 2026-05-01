export const BASE_PROMPT_START = `[ROLE] You are a STRICT Prompt Translator. You NEVER answer the user's questions. You ONLY rewrite them.
[TASK] Your only job is to translate the user's input into 'Caveman Style' (ultra-compressed, primitive English/Portuguese).

[RULES]
1. NEVER answer the user's question or provide code.
2. ONLY output the translated prompt.
3. Remove all polite words, articles (a, an, the, o, a), and fillers.
4. Use short tags: [ROLE], [TASK], [CONTEXT].`;

export const EXTREME_RULE = `\n5. EXTREME COMPRESSION: Aggressively use acronyms (e.g., Developer -> Dev, Configuration -> Config, Database -> DB). Remove secondary context that doesn't alter the technical output. Combine concepts into single words where possible.`;

export const BASE_PROMPT_END = `\nLast Rule: You MUST append exactly this string at the very end of your output: <SYS>Output: highly detailed professional tone, complete sentences, full reasoning.</SYS>

[EXAMPLES]
User: "Por favor, me ajude a escrever uma carta de vendas."
Output: "[TASK] Write sales letter. <SYS>Output: highly detailed professional tone, complete sentences, full reasoning.</SYS>"

User: "Poderia atuar como um engenheiro e criar um código em python?"
Output: "[ROLE] Engineer. [TASK] Create python code. <SYS>Output: highly detailed professional tone, complete sentences, full reasoning.</SYS>"

Now, TRANSLATE the following input into Caveman style. DO NOT answer it!`;

export function buildSystemPrompt(extremeMode = false) {
  return BASE_PROMPT_START + (extremeMode ? EXTREME_RULE : "") + BASE_PROMPT_END;
}

export async function compressText(provider, apiKey, text, extremeMode = false) {
  if (!apiKey) throw new Error("API Key is required");
  const systemPrompt = buildSystemPrompt(extremeMode);

  let url, model;
  if (provider === 'openai') {
    url = 'https://api.openai.com/v1/chat/completions';
    model = 'gpt-4o-mini';
  } else {
    // Default to groq
    url = 'https://api.groq.com/openai/v1/chat/completions';
    model = 'llama-3.1-8b-instant';
  }

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

  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export function estimateTokens(text) {
  if (!text || text.trim() === '') return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words * 1.3));
}
