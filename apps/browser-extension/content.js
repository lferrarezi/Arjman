// content.js

const floatingButton = document.createElement('button');
floatingButton.className = 'arjman-btn hidden';
floatingButton.textContent = 'Arjmanize';
floatingButton.title = 'Comprimir o prompt em Caveman Style';

let activeInput = null;
let updateScheduled = false;

function getSelectorsForHost(hostname) {
  if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
    return ['[role="textbox"][contenteditable="true"]', '[role="textbox"]', 'form textarea', 'textarea'];
  }
  if (hostname.includes('claude.ai') || hostname.includes('gemini.google.com')) {
    return ['[contenteditable="true"]', '[role="textbox"]', 'textarea'];
  }
  return ['textarea', '[contenteditable="true"]', '[contenteditable]'];
}

function findActiveInput() {
  const selectors = getSelectorsForHost(window.location.hostname);

  const activeEl = document.activeElement;
  if (activeEl && activeEl.matches && selectors.some((selector) => activeEl.matches(selector))) {
    const rect = activeEl.getBoundingClientRect();
    if (rect.width >= 100 && rect.height >= 20 && rect.top >= 0 && rect.left >= 0) {
      return activeEl;
    }
  }

  for (const selector of selectors) {
    const elements = Array.from(document.querySelectorAll(selector));
    const visible = elements.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width >= 100 && rect.height >= 20 && rect.top >= 0 && rect.left >= 0;
    });
    if (visible.length > 0) {
      return visible[0];
    }
  }
  return null;
}

function updateFloatingButton() {
  activeInput = findActiveInput();
  if (!activeInput) {
    floatingButton.classList.add('hidden');
    return;
  }
  floatingButton.classList.remove('hidden');
  floatingButton.textContent = 'Arjmanize';
  floatingButton.title = 'Comprimir o prompt em Caveman Style';
}

function scheduleUpdate() {
  if (updateScheduled) return;
  updateScheduled = true;
  window.requestAnimationFrame(() => {
    updateScheduled = false;
    updateFloatingButton();
  });
}

floatingButton.addEventListener('mousedown', () => {
  activeInput = findActiveInput();
});

floatingButton.addEventListener('click', async (event) => {
  event.preventDefault();
  activeInput = activeInput || findActiveInput();
  if (!activeInput) return;

  const originalText = activeInput.tagName === 'TEXTAREA'
    ? activeInput.value
    : activeInput.innerText || activeInput.textContent;
  if (!originalText || originalText.trim() === '') return;

  floatingButton.innerText = '⏳';
  floatingButton.disabled = true;

  try {
    const response = await chrome.runtime.sendMessage({ action: 'arjmanize', text: originalText });
    if (response.success) {
      const origWords = originalText.trim().split(/\s+/).length;
      const newWords = response.compressedText.trim().split(/\s+/).length;
      const origTokens = Math.max(1, Math.round(origWords * 1.3));
      const newTokens = Math.max(1, Math.round(newWords * 1.3));
      const savings = Math.round(100 - ((newTokens / origTokens) * 100));

      if (activeInput.tagName === 'TEXTAREA') {
        activeInput.value = response.compressedText;
        activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        activeInput.innerText = response.compressedText;
        activeInput.dispatchEvent(new Event('input', { bubbles: true }));
        activeInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (savings > 0) {
        floatingButton.innerText = `✨ ${newTokens} (-${savings}%)`;
      } else {
        floatingButton.innerText = `✨ ${newTokens}`;
      }
    } else {
      const errorMessage = response.error || 'Unknown error';
      floatingButton.innerText = '❌';
      floatingButton.title = errorMessage;
      console.error('[Arjman] API Error:', errorMessage);
    }
  } catch (err) {
    floatingButton.innerText = '❌';
    floatingButton.title = err.message;
    console.error('[Arjman] Connection Error:', err);
  }

  setTimeout(() => {
    floatingButton.innerText = 'Arjmanize';
    floatingButton.disabled = false;
    floatingButton.title = 'Comprimir o prompt em Caveman Style';
  }, 3000);
});

function initContentScript() {
  if (!document.body) {
    window.addEventListener('DOMContentLoaded', initContentScript, { once: true });
    return;
  }

  document.body.appendChild(floatingButton);

  const observer = new MutationObserver(scheduleUpdate);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('focusin', scheduleUpdate);
  window.addEventListener('resize', scheduleUpdate);

  updateFloatingButton();
}

initContentScript();

console.log('[Arjman] Floating content script loaded and observing for changes');
