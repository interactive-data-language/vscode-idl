import { ENVITestDatasets } from '@idl/envi/test-datasets';
import { FindIDL } from '@idl/idl/files';
import { StartAgentsServer } from '@idl/mcp/standalone-server';
import { Sleep } from '@idl/shared/extension';
import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { copy } from 'fast-copy';

import { CallMCPTool, CreateMCPClient } from './client';

async function Main() {
  /** Get server config */
  const config = copy(DEFAULT_AGENT_SERVER_CONFIG);

  // port
  config.server.port = 3000;
  // config.mcp.enviToolWhitelist = ['hastybeachstudy'];

  // start the server
  const result = await StartAgentsServer(config);

  /** Set IDL dir (assumes ENVI + IDL isntalled) */
  ENVITestDatasets.setIDLDir(FindIDL() || '');

  // wait for all the magic to happen
  await Sleep(1000);

  // init a client to the server
  await CreateMCPClient(config.server.port);

  // call a tool
  console.log(
    await CallMCPTool(MCP_TOOL_LOOKUP.RUN_IDL_CODE, {
      code: 'e = envi(/headless)',
    }),
  );

  /** Bare filename with no directory component */
  const fileName = 'envi_tool_session_test.dat';

  // call a tool
  console.log(
    await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
      toolName: 'ISODataClassification',
      inputParameters: {
        input_raster: ENVITestDatasets.raster(),
        output_raster_uri: fileName,
      },
      interactive: false,
    }),
  );
}

Main().catch((err) => console.log(err));
