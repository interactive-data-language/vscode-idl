import { StartAgentsServer, validateEnv } from '@idl/mcp/standalone-server';

// Validate environment variables
const env = validateEnv();

// WebSocket mode is disabled for the standalone server app
env.WEBSOCKET_ENABLED = 'false';

const host = env.HOST;
const port = Number(env.PORT);

async function main() {
  console.log(env);
  try {
    const result = await StartAgentsServer({
      chatEngine: env.CHAT_ENGINE,
      chatProvider: env.CHAT_PROVIDER,
      copilotGitHubToken: env.COPILOT_GITHUB_TOKEN,
      host,
      ollamaBaseUrl: env.OLLAMA_BASE_URL,
      openaiApiKey: env.OPENAI_API_KEY,
      port,
      websocketEnabled: false,
    });

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
