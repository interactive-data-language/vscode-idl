import { StartAgentsServer } from '@idl/mcp/standalone-server';
import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { copy } from 'fast-copy';

async function main() {
  try {
    const config = copy(DEFAULT_AGENT_SERVER_CONFIG);
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
