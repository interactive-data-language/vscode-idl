import { StartAgentsServer } from '@idl/mcp/standalone-server';
import { Sleep } from '@idl/shared/extension';
import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { copy } from 'fast-copy';

import { CallMCPTool, CreateMCPClient } from './client';

async function Main() {
  /** Get server config */
  const config = copy(DEFAULT_AGENT_SERVER_CONFIG);

  // port
  config.server.port = 3000;

  // start the server
  const result = await StartAgentsServer(config);

  // wait for all the magic to happen
  await Sleep(1000);

  // init a client to the server
  CreateMCPClient(config.server.port);

  // call a tool
  console.log(await CallMCPTool('list-envi-tools', {}));
}

Main().catch((err) => console.log(err));
