#!/usr/bin/env node

import { compressText } from '@arjman/core';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('provider', {
    alias: 'p',
    type: 'string',
    description: 'LLM Provider (groq | openai | nvidia)',
    default: 'groq'
  })
  .option('key', {
    alias: 'k',
    type: 'string',
    description: 'API Key (or set ARJMAN_API_KEY env var)'
  })
  .option('extreme', {
    alias: 'e',
    type: 'boolean',
    description: 'Enable extreme compression mode',
    default: false
  })
  .help()
  .alias('help', 'h')
  .parse();

const apiKey = argv.key || process.env.ARJMAN_API_KEY;
if (!apiKey) {
  console.error("Error: API Key is required. Pass --key or set ARJMAN_API_KEY.");
  process.exit(1);
}

// Ler do stdin (Pipe)
let inputData = '';

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', async () => {
  const text = inputData.trim();
  if (!text) {
    console.error("Error: No input provided. Please pipe text to arjman.");
    process.exit(1);
  }

  try {
    const compressed = await compressText(argv.provider, apiKey, text, argv.extreme);
    // Imprime direto no stdout para seguir o pipe
    process.stdout.write(compressed);
  } catch (err) {
    console.error("Error compressing text:", err.message);
    process.exit(1);
  }
});
