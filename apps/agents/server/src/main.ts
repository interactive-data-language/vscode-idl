import { GetExtensionPath } from '@idl/idl/files';
import { StartAgentsServer } from '@idl/mcp/standalone-server';
import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { copy } from 'fast-copy';
import { readFileSync } from 'fs';

async function main() {
  try {
    let config = copy(DEFAULT_AGENT_SERVER_CONFIG);

    // try to load our config from disk
    try {
      const file = GetExtensionPath('desktop-agents.config.json');
      console.log('[Config] Loading config from file on disk');
      config = JSON.parse(readFileSync(file, 'utf-8'));
    } catch (err) {
      console.log('Problem loading config from file');
      console.log(err);
    }

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
