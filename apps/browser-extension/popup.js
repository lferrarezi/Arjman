document.addEventListener('DOMContentLoaded', () => {
  const providerSelect = document.getElementById('provider');
  const apiKeyInput = document.getElementById('apiKey');
  const extremeModeInput = document.getElementById('extremeMode');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  const versionSpan = document.getElementById('appVersion');

  // Inject dynamic version
  const manifestData = chrome.runtime.getManifest();
  if (versionSpan && manifestData.version) {
    versionSpan.textContent = `v${manifestData.version}`;
  }

  // Load existing settings
  chrome.storage.local.get(['arjmanProvider', 'arjmanApiKey', 'arjmanExtremeMode'], (result) => {
    console.log('[Arjman Popup] Loaded settings:', {
      provider: result.arjmanProvider,
      hasApiKey: !!result.arjmanApiKey,
      apiKeyLength: result.arjmanApiKey ? result.arjmanApiKey.length : 0,
      extremeMode: result.arjmanExtremeMode
    });

    if (result.arjmanProvider) {
      providerSelect.value = result.arjmanProvider;
    }
    if (result.arjmanApiKey) {
      apiKeyInput.value = result.arjmanApiKey;
    }
    if (result.arjmanExtremeMode !== undefined) {
      extremeModeInput.checked = result.arjmanExtremeMode;
    }
  });

  // Save settings
  saveBtn.addEventListener('click', () => {
    const provider = providerSelect.value;
    const apiKey = apiKeyInput.value.trim();
    const extremeMode = extremeModeInput.checked;

    console.log('[Arjman Popup] Saving settings:', {
      provider,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey.length,
      extremeMode
    });

    chrome.storage.local.set({
      arjmanProvider: provider,
      arjmanApiKey: apiKey,
      arjmanExtremeMode: extremeMode
    }, () => {
      statusDiv.textContent = 'Configurações salvas!';
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 2000);
    });
  });
});
