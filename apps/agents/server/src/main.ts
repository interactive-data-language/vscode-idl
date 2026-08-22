import { StartAgentsServer, validateEnv } from '@idl/mcp/standalone-server';
import { DEFAULT_ELECTRON_CONFIG } from '@idl/types/electron';
import { copy } from 'fast-copy';

// Validate environment variables
const env = validateEnv();

// WebSocket mode is disabled for the standalone server app
env.WEBSOCKET_ENABLED = 'false';

// /**
//  * Builds the `llm` config for the selected chat provider from validated env vars.
//  */
// function GetLlmConfig(): IElectronConfig['agent']['llm'] {
//   switch (env.CHAT_PROVIDER) {
//     case 'copilot':
//       return {
//         model: 'copilot',
//         config: { gitHubToken: env.COPILOT_GITHUB_TOKEN ?? '' },
//       };
//     case 'ollama':
//       return {
//         model: 'ollama',
//         config: {
//           url: env.OLLAMA_BASE_URL,
//           maxPromptTokens: 110000,
//           maxOutputTokens: 18000,
//         },
//       };
//     case 'openai':
//     default:
//       return { model: 'openai', config: { apiKey: env.OPENAI_API_KEY ?? '' } };
//   }
// }

async function main() {
  console.log(env);
  try {
    const config = copy(DEFAULT_ELECTRON_CONFIG);
    config.server.port = 3000;

    const result = await StartAgentsServer(config);

    // Graceful shutdown — stop the server so on-disk state flushes
    const shutdown = async (signal: NodeJS.Signals) => {
      console.log(`[server] Received ${signal}, shutting down...`);
      await result.stop();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
