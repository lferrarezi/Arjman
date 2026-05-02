# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-05-02

### Fixed
- Browser extension button now properly captures active input field on ChatGPT and other sites with dynamic UIs
- Content script no longer causes page loading to hang by deferring DOM operations and throttling MutationObserver updates
- Fixed version synchronization between package.json and manifest.json for browser extension
- Improved error handling in browser extension API calls

### Added
- Automatic version synchronization script (`sync-version`) in browser extension build pipeline
- Comprehensive ESLint and Prettier configuration for code quality
- Jest test framework with basic compression engine tests
- Build and test scripts for all packages in monorepo
- Quality assurance and development best practices documentation

### Changed
- Version bumped to 1.1.2 across all packages for consistency
- Browser extension build now runs version sync automatically
- Content script uses `requestAnimationFrame` for debounced UI updates
- Improved selector priorities for ChatGPT's contenteditable fields

## [1.1.1] - 2026-05-02

### Fixed
- Corrected extension error reporting to display actual API error messages instead of a generic missing API key warning.
- Improved background key loading checks and popup storage behavior.

### Added
- **NVIDIA API support**: Third LLM provider option with Llama-3-8B-Instruct model
- **Enhanced provider selection**: Browser extension popup now includes NVIDIA option
- **Updated CLI options**: `--provider nvidia` support in command-line interface
- **Documentation updates**: Examples and usage instructions for NVIDIA integration

### Changed
- **Multi-provider support expanded**: Now supports OpenAI, Groq, and NVIDIA APIs
- **Error messages updated**: Provider validation includes NVIDIA in error messages

## [1.0.0] - 2026-05-02

### Added
- **Core compression engine** (`packages/core`): Lossless cognitive compression using OpenAI and Groq APIs
- **Browser extension** (`apps/browser-extension`): Automatic prompt compression in ChatGPT, Claude, and Gemini interfaces
- **CLI tool** (`apps/cli`): Unix pipeline-compatible compression for integration with AI agents
- **Extreme mode**: Aggressive compression with acronyms and context stripping for maximum token savings
- **Token estimation**: Heuristic token counting for cost prediction
- **Multi-provider support**: OpenAI (GPT-4o-mini), Groq (Llama-3.1-8b-instant), and NVIDIA (Llama-3-8B-Instruct)

### Features
- **Browser integration**: One-click compression in supported LLM interfaces
- **CLI pipelines**: Compatible with Devin CLI, Claude Code, and other AI agents
- **Privacy-first**: Uses only user-provided API keys, no data collection
- **Error handling**: Comprehensive error messages for API failures and network issues
- **Real-time feedback**: Visual indicators showing token savings in browser extension

### Integrations
- **Devin CLI**: Pipe compression for automated coding tasks
- **Claude Code**: Prompt optimization for technical code generation
- **Codex/OpenAI**: Direct integration via OpenAI provider
- **ChatGPT/Claude/Gemini**: Browser extension with automatic button injection

### Technical
- **Monorepo architecture**: Shared core engine across browser and CLI implementations
- **ES modules**: Modern JavaScript with proper module resolution
- **Chrome Extension Manifest V3**: Future-proof browser extension architecture
- **Commander.js integration**: Robust CLI argument parsing and help system

### Known Limitations
- Requires user API keys for OpenAI, Groq, or NVIDIA
- Browser extension limited to Chrome/Edge (Firefox support planned)
- No offline compression mode yet
- Token estimation is heuristic (±20% accuracy)

### Performance
- **Compression ratio**: 40-60% token reduction depending on input
- **Response time**: ~2-5 seconds per compression (API-dependent)
- **Memory usage**: Minimal (< 50MB for browser extension)

---

## Development Notes
- Built with Node.js ES modules
- Uses esbuild for browser extension bundling
- Tested with OpenAI GPT-4o-mini and Groq Llama-3.1-8b-instant
- Cross-platform compatibility (macOS, Windows, Linux)

### Fixed
- Corrected extension error reporting to display actual API error messages instead of a generic missing API key warning.
- Improved background key loading checks and popup storage behavior.

### Added
- **NVIDIA API support**: Third LLM provider option with Llama-3-8B-Instruct model
- **Enhanced provider selection**: Browser extension popup now includes NVIDIA option
- **Updated CLI options**: `--provider nvidia` support in command-line interface
- **Documentation updates**: Examples and usage instructions for NVIDIA integration

### Changed
- **Multi-provider support expanded**: Now supports OpenAI, Groq, and NVIDIA APIs
- **Error messages updated**: Provider validation includes NVIDIA in error messages

## [1.0.0] - 2026-05-02

### Added
- **Core compression engine** (`packages/core`): Lossless cognitive compression using OpenAI and Groq APIs
- **Browser extension** (`apps/browser-extension`): Automatic prompt compression in ChatGPT, Claude, and Gemini interfaces
- **CLI tool** (`apps/cli`): Unix pipeline-compatible compression for integration with AI agents
- **Extreme mode**: Aggressive compression with acronyms and context stripping for maximum token savings
- **Token estimation**: Heuristic token counting for cost prediction
- **Multi-provider support**: OpenAI (GPT-4o-mini), Groq (Llama-3.1-8b-instant), and NVIDIA (Llama-3-8B-Instruct)

### Features
- **Browser integration**: One-click compression in supported LLM interfaces
- **CLI pipelines**: Compatible with Devin CLI, Claude Code, and other AI agents
- **Privacy-first**: Uses only user-provided API keys, no data collection
- **Error handling**: Comprehensive error messages for API failures and network issues
- **Real-time feedback**: Visual indicators showing token savings in browser extension

### Integrations
- **Devin CLI**: Pipe compression for automated coding tasks
- **Claude Code**: Prompt optimization for technical code generation
- **Codex/OpenAI**: Direct integration via OpenAI provider
- **ChatGPT/Claude/Gemini**: Browser extension with automatic button injection

### Technical
- **Monorepo architecture**: Shared core engine across browser and CLI implementations
- **ES modules**: Modern JavaScript with proper module resolution
- **Chrome Extension Manifest V3**: Future-proof browser extension architecture
- **Commander.js integration**: Robust CLI argument parsing and help system

### Known Limitations
- Requires user API keys for OpenAI or Groq
- Browser extension limited to Chrome/Edge (Firefox support planned)
- No offline compression mode yet
- Token estimation is heuristic (±20% accuracy)

### Performance
- **Compression ratio**: 40-60% token reduction depending on input
- **Response time**: ~2-5 seconds per compression (API-dependent)
- **Memory usage**: Minimal (< 50MB for browser extension)

---

## Development Notes
- Built with Node.js ES modules
- Uses esbuild for browser extension bundling
- Tested with OpenAI GPT-4o-mini and Groq Llama-3.1-8b-instant
- Cross-platform compatibility (macOS, Windows, Linux)