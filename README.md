# 🪄 Arjman Ecosystem

**Arjman** é um toolkit multiplataforma projetado para aplicar **Compressão Cognitiva Sem Perdas** (*Lossless Cognitive Compression*) em prompts de Inteligência Artificial. Utilizando o "Estilo Homem das Cavernas" (*Caveman Style*), a ferramenta reduz o tamanho de entrada em até 60%, removendo gorduras gramaticais, conectivos e preposições, mantendo 100% da integridade técnica do comando.
* **Arjman** is a cross-platform toolkit designed to apply **Lossless Cognitive Compression** to Artificial Intelligence prompts. Using the "Caveman Style", the tool reduces the input size by up to 60%, stripping away grammatical fluff, connectives, and prepositions, while maintaining 100% of the technical integrity of the command.*

Esta economia drástica resulta em custos de inferência muito menores nas APIs (como GPT-4, Claude 3, Llama 3) e evita o esgotamento prematuro das janelas de contexto (*context window limits*).
* This drastic savings results in much lower inference costs on APIs (such as GPT-4, Claude 3, Llama 3) and prevents premature exhaustion of context windows.*

## 🏗 Arquitetura Monorepo
* 🏗 Monorepo Architecture*

Este projeto foi construído utilizando um design de **Monorepo**, o que significa que o motor central de otimização de prompts pode ser consumido nativamente de várias formas sem duplicação de código.
* This project was built using a **Monorepo** design, meaning the core prompt optimization engine can be consumed natively in various ways without code duplication.*

### `packages/core`
O "cérebro" do projeto. Um pacote independente em Node.js contendo as heurísticas de compressão, integração com APIs (Groq e OpenAI) e a lógica de contagem de tokens (heurística segura e sem dependências pesadas).
* The "brain" of the project. An independent Node.js package containing the compression heuristics, API integration (Groq and OpenAI), and token counting logic (a safe heuristic with no heavy dependencies).*

### `apps/browser-extension`
Extensão de navegador (Chrome/Edge) que injeta automaticamente um painel de conversão (*Dashboard*) dentro das interfaces originais do ChatGPT, Claude e Gemini. Com apenas um clique, o texto digitado é comprimido em tempo real.
* Browser extension (Chrome/Edge) that automatically injects a conversion panel (Dashboard) directly into the native interfaces of ChatGPT, Claude, and Gemini. With a single click, your typed text is compressed in real-time.*

### `apps/cli`
Utilitário de linha de comando otimizado para *Unix Pipelines*. Desenvolvido para atuar como um filtro intermediário entre você e seus agentes CLI favoritos (Kiro, Devin, Antigravity). Ele intercepta fluxos *stdin*, aplica o motor Arjman e devolve a versão otimizada via *stdout*.
* Command Line Utility optimized for Unix Pipelines. Built to act as an intermediate filter between you and your favorite CLI agents (Kiro, Devin, Antigravity). It intercepts stdin streams, applies the Arjman engine, and returns the optimized version via stdout.*

## ⚡ O "Extreme Mode"
* ⚡ The "Extreme Mode"*

Opcionalmente, o Arjman possui um Modo Extremo. Quando ativado, a conversão é muito mais agressiva: ela converte palavras técnicas em siglas universais (Developer -> Dev, Database -> DB), extirpa todo contexto humano secundário e foca 100% apenas no imperativo lógico.
* Optionally, Arjman features an Extreme Mode. When enabled, the conversion becomes much more aggressive: it converts technical words into universal acronyms (Developer -> Dev, Database -> DB), strips out all secondary human context, and focuses 100% solely on the logical imperative.*

## 🧪 Benchmark de Compressão
* 🧪 Compression Benchmark*

**Prompt Original (68 tokens):**
> "Olá ChatGPT, bom dia. Você poderia por favor me ajudar atuando como um desenvolvedor expert em frontend? Eu gostaria muito que você me ensinasse a criar um botão em React que faz um request numa API genérica. Lembre-se de colocar comentários no código para que eu entenda o que cada linha faz."

**Arjman Extreme Mode (26 tokens) -> Economia de 61.5%:**
> `[ROLE] Dev. [TASK] Create react button. Make api request. Add comments. <SYS>Output: highly detailed professional tone, complete sentences, full reasoning.</SYS>`

## 🛠 Como Instalar & Usar
* 🛠 How to Install & Use*

### Para Navegadores (Chrome/Edge)
* For Browsers (Chrome/Edge)*
1. Abra `chrome://extensions/` no seu navegador. (*Open `chrome://extensions/` in your browser.*)
2. Ative o **Modo do desenvolvedor**. (*Enable **Developer mode**.*)
3. Clique em **Carregar sem compactação**. (*Click **Load unpacked**.*)
4. Selecione a pasta `/apps/browser-extension` deste repositório. (*Select the `/apps/browser-extension` folder of this repository.*)

### Para CLI (Terminal e Agentes)
* For CLI (Terminal and Agents)*
1. Na raiz do projeto, instale o pacote globalmente usando npm:
* From the project root, install the package globally using npm:*
```bash
npm install -g ./apps/cli
```
2. Utilize-o conectando via pipes (ideal para integrações com Antigravity/Kiro/Devin):
* Use it by connecting via pipes (ideal for integrations with Antigravity/Kiro/Devin):*
```bash
echo "Preciso de um script python que baixa um vídeo do youtube" | arjman --key "sua-chave" | kiro
```

## 🔒 Privacidade / Privacy
A sua privacidade é levada a sério. O Arjman exige que você utilize sua própria chave de API (OpenAI ou Groq). Nenhum dado é salvo ou enviado para servidores centrais de terceiros; a comunicação ocorre diretamente entre o seu computador e a provedora da LLM.
* Your privacy is taken seriously. Arjman requires you to provide your own API key (OpenAI or Groq). No data is saved or sent to central third-party servers; all communication happens directly between your local machine and the LLM provider.*
