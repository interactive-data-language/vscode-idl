import {
  FindFiles,
  FindIDL,
  IFolderRecursion,
  LoadIDLSearchPaths,
} from '@idl/idl/files';
import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import {
  MCPTrackResources,
  RegisterAllLanguageServerMCPTools,
  RegisterMCPTaskTools,
} from '@idl/mcp/language-server-tools';
import { MCPServer } from '@idl/mcp/server';
import { RegisterStaticMCPResources } from '@idl/mcp/server-resources';
import { RegisterAllMCPTools } from '@idl/mcp/server-tools';
import { IDLIndex } from '@idl/parsing/index';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';
import type { Application } from 'express';

import { CreateIDLBackend } from './create-idl-backend';
import { CreateStandaloneExecutionCallback } from './create-standalone-execution-callback';

/**
 * Starts the language server for our dedicated MCP server - so we can re-use our MCP
 * tools over here.
 *
 * Mounts MCP routes on the provided Express app instead of creating a standalone server.
 */
export async function MCPLanguageServer(app: Application) {
  const logManager = new LogManager({
    alert: () => {
      //
    },
  });

  /**
   * Default path that we need for IDL and discovery
   */
  const idlSearchPath: IFolderRecursion = {};

  /**
   * Find a version of IDL
   */
  const idlPath = FindIDL();

  // verify that we found the IDL search path
  if (!idlPath) {
    throw new Error('Unable to find IDL, cannot proceed');
  }

  // register other paths we need to index
  const isEnviInstalled = LoadIDLSearchPaths(idlSearchPath, idlPath);

  // index
  const index = new IDLIndex(logManager, 1, false);

  /** Find relevant files that we need to index */
  const files = await FindFiles(idlPath);

  /**
   * Index workspace files we found
   */
  await index.indexWorkspaceFiles(files, idlPath, true);

  // load global tokens
  index.loadGlobalTokens(DEFAULT_IDL_EXTENSION_CONFIG);

  /**
   * Create the IDL execution backend (IDL launches on demand via backend.start())
   */
  const backend = CreateIDLBackend(logManager, idlPath);

  /**
   * Create the standalone execution callback that dispatches
   * tool calls directly to the core functions
   */
  const idlExecutionCallback = CreateStandaloneExecutionCallback(
    backend,
    async (code) => {
      return await index.indexerPool.workerio.postAndReceiveMessage(
        index.getNextWorkerID(),
        LSP_WORKER_THREAD_MESSAGE_LOOKUP.PREPARE_IDL_CODE,
        {
          code,
        },
      ).response;
    },
  );

  // start the MCP server with the execution callback, mounting on the provided Express app
  MCPServer.start({
    app,
    logManager,
    idlExecutionCallback,
    failCallback: (err) => {
      logManager.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: ['Error starting MCP server', err],
      });
    },
    toolInvokedCallback: () => {
      // no-op for standalone mode
    },
  });

  /** Get reference to the server singleton */
  const mcpServer = MCPServer.instance;

  // register static resources (documentation links)
  RegisterStaticMCPResources();

  // track dynamic file-based resources
  try {
    MCPTrackResources(logManager);
  } catch (err) {
    logManager.log({
      log: IDL_MCP_LOG,
      type: 'error',
      content: [`Problem tracking resource files`, err],
    });
  }

  // register all of our tools
  RegisterAllMCPTools(isEnviInstalled);

  // register all tools that require the language server (IDL Index) to function
  RegisterAllLanguageServerMCPTools(mcpServer, index, () => []);

  // register MCP task tools
  if (isEnviInstalled) {
    RegisterMCPTaskTools(MCPServer.instance, index);
  }
}
