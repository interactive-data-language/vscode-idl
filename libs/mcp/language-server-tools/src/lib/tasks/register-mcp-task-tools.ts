import { IDL_LSP_LOG, IDL_MCP_LOG } from '@idl/logger';
import { MCPServer } from '@idl/mcp/server';
import {
  RegisterMCPTool_CreateENVIModelerWorkflow,
  RegisterMCPTool_GetENVIToolParameters,
  RegisterMCPTool_ListENVITools,
  RegisterMCPTool_RunENVITool,
} from '@idl/mcp/server-tools';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDLIndex } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';

/**
 * Registers MCP Task tools from parsed code on IDL's search path
 */
export async function RegisterMCPTaskTools(server: MCPServer, index: IDLIndex) {
  server.logManager.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: 'Registering MCP user tools',
  });

  /** Create task registry */
  const registry = new MCPTaskRegistry(server.logManager);

  // listen for task changes
  index.onParse.on('envi-task', (parsed) => {
    server.logManager.log({
      log: IDL_MCP_LOG,
      type: 'debug',
      content: `Updating task definition for "${parsed.globals.function.name}"`,
    });

    // register task
    registry.registerTask(parsed.globals.function, parsed.globals.structure);
  });

  // register tools for tasks
  RegisterMCPTool_ListENVITools(server, registry);
  RegisterMCPTool_GetENVIToolParameters(server, registry);
  RegisterMCPTool_RunENVITool(server, registry);
  RegisterMCPTool_CreateENVIModelerWorkflow(server, registry);

  /** Register tasks that we have found */
  registry.registerTasksFromGlobalTokens(
    index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.FUNCTION],
    index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE],
  );

  // server.logManager.log({
  //   log: IDL_MCP_LOG,
  //   type: 'info',
  //   content: `Attempting to load user ENVI Tool notes`,
  // });

  // // load notes
  // RegisterENVITaskNotes(registry, server.logManager);

  // emit MCP event that tools have changed
  server.sendToolListChanged();
}
