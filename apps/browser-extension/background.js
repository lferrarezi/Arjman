import { compressText } from '@arjman/core';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'arjmanize') {
    chrome.storage.local.get(['arjmanProvider', 'arjmanApiKey', 'arjmanExtremeMode'], async (result) => {
      const provider = result.arjmanProvider || 'groq';
      const apiKey = result.arjmanApiKey;
      const extremeMode = result.arjmanExtremeMode || false;

      if (!apiKey) {
        sendResponse({ success: false, error: 'No API Key configured' });
        return;
      }

      try {
        const compressedText = await compressText(provider, apiKey, request.text, extremeMode);
        sendResponse({ success: true, compressedText });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    });

    return true; // Mantem a conexao aberta para o async
  }
});
