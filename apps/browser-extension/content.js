// content.js

function injectArjmanButton() {
  // Tentar encontrar textareas principais
  const textareas = document.querySelectorAll('textarea');
  if (textareas.length === 0) return;

  // Filtra textareas provaveis (ex: prompt.set)
  textareas.forEach((textarea) => {
    // Evitar injetar duplo
    if (textarea.parentElement.querySelector('.arjman-btn')) return;

    // Criar botao
    const btn = document.createElement('button');
    btn.className = 'arjman-btn';
    btn.innerText = '🪄 Arjmanize';
    btn.title = 'Comprimir este prompt para o formato Arjman';

    // Posicionar (relativo ao parent)
    textarea.parentElement.style.position = 'relative';
    textarea.parentElement.appendChild(btn);

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const originalText = textarea.value;
      
      if (!originalText || originalText.trim() === '') return;

      btn.innerText = '⏳ Comprimindo...';
      btn.disabled = true;

      // Chama o background script para fazer a requisicao pra API
      try {
        const response = await chrome.runtime.sendMessage({
          action: 'arjmanize',
          text: originalText
        });

        if (response.success) {
          const origWords = originalText.trim().split(/\s+/).length;
          const newWords = response.compressedText.trim().split(/\s+/).length;
          const origTokens = Math.max(1, Math.round(origWords * 1.3));
          const newTokens = Math.max(1, Math.round(newWords * 1.3));
          const savings = Math.round(100 - ((newTokens / origTokens) * 100));

          textarea.value = response.compressedText;
          // Dispara input event pro react/vue reconhecer a mudanca
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          
          if (savings > 0) {
            btn.innerText = `✨ ${newTokens} tkns (-${savings}%)`;
          } else {
            btn.innerText = `✨ ${newTokens} tkns`;
          }
        } else {
          btn.innerText = '❌ Erro (Sem API Key?)';
          console.error(response.error);
        }
      } catch (err) {
        btn.innerText = '❌ Falha de Conexão';
      }

      setTimeout(() => {
        btn.innerText = '🪄 Arjmanize';
        btn.disabled = false;
      }, 3000);
    });
  });
}

// Injeta o MutationObserver para pegar UIs que carregam dinamicamente (React/Vue/Angular)
const observer = new MutationObserver(() => {
  injectArjmanButton();
});

observer.observe(document.body, { childList: true, subtree: true });

// Primeira tentativa
injectArjmanButton();
