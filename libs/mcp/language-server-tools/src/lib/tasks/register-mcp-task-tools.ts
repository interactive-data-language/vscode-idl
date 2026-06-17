import { GetExtensionPath } from '@idl/idl/files';
import { TransformersEmbeddingProvider } from '@idl/indexing/embeddings';
import { Indexer } from '@idl/indexing/indexer';
import { IDL_LSP_LOG, IDL_MCP_LOG } from '@idl/logger';
import { MCPServer } from '@idl/mcp/server';
import {
  RegisterMCPTool_CreateENVIModelerWorkflow,
  RegisterMCPTool_GetENVIToolParameters,
  RegisterMCPTool_ListENVITools,
  RegisterMCPTool_RunENVITool,
  RegisterMCPTool_SearchENVITools,
} from '@idl/mcp/server-tools';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDLIndex } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';
import { join } from 'path';
import { performance } from 'perf_hooks';

/**
 * Registers MCP Task tools from parsed code on IDL's search path
 */
export async function RegisterMCPTaskTools(server: MCPServer, index: IDLIndex) {
  server.logManager.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: 'Registering MCP user tools',
  });

  const distDir = GetExtensionPath('dist');
  const onnxDir = join(distDir, 'onnx');

  /** Create embedding provider and indexer for semantic task search */
  const embeddingProvider = new TransformersEmbeddingProvider(
    'Xenova/all-MiniLM-L6-v2',
    onnxDir,
  );
  const indexer = new Indexer(embeddingProvider);

  /** Create task registry */
  const registry = new MCPTaskRegistry(server.logManager, false, indexer);

  // listen for task changes
  index.onParse.on('envi-task', async (parsed) => {
    server.logManager.log({
      log: IDL_MCP_LOG,
      type: 'debug',
      content: `Updating task definition for "${parsed.globals.function.name}"`,
    });

    // register task
    registry.registerTask(parsed.globals.function, parsed.globals.structure);

    // update/add embeddings for the newly added task
    await registry.buildSearchIndex();
  });

  // register tools for tasks
  RegisterMCPTool_ListENVITools(server, registry);
  RegisterMCPTool_GetENVIToolParameters(server, registry);
  RegisterMCPTool_RunENVITool(server, registry);
  RegisterMCPTool_CreateENVIModelerWorkflow(server, registry);
  RegisterMCPTool_SearchENVITools(server, registry);

  /** Register tasks that we have found */
  await registry.registerTasksFromGlobalTokens(
    index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.FUNCTION],
    index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE],
  );

  /** Get initial time */
  const t0 = performance.now();
  server.logManager.log({
    log: IDL_MCP_LOG,
    type: 'info',
    content: `Building embeddings for tool search and discovery`,
  });
  registry
    .buildSearchIndex()
    .then(() => {
      server.logManager.log({
        log: IDL_MCP_LOG,
        type: 'info',
        content: `Embedding creation time (ms): ${performance.now() - t0}`,
      });
    })
    .catch((err) => {
      server.logManager.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`Error while building embeddings`, err],
      });
    });

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
