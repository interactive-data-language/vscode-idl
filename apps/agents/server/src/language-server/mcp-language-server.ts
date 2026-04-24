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

import { CreateStandaloneExecutionCallback } from './create-standalone-execution-callback';
import { StartIDL } from './start-idl';

/**
 * Starts the language server for our dedicated MCP server - so we can re-use our MCP
 * tools over here
 */
export async function MCPLanguageServer() {
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
    console.log('Unable to find IDL, cannot proceed');
    process.exit(1);
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
   * Start IDL and get the execution backend
   */
  const backend = await StartIDL(logManager, idlPath);

  /**
   * Create the standalone execution callback that dispatches
   * tool calls directly to the core functions
   */
  const idlExecutionCallback = CreateStandaloneExecutionCallback(
    backend,
    async (code) => {
      /**
       * TODO: Wire up code preparation through the IDLIndex worker
       * for the standalone path. For now, return a simple pass-through.
       */
      return {
        code,
        codeWithoutPrint: code,
        emptyMain: false,
        hasMain: true,
        isBatch: false,
        offset: 0,
      };
    },
  );

  // start the MCP server with the execution callback
  MCPServer.start({
    logManager,
    idlExecutionCallback,
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
  RegisterMCPTaskTools(MCPServer.instance, index);
}
