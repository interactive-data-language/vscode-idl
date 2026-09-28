import {
  FindFiles,
  FindIDL,
  GetExtensionPath,
  IFolderRecursion,
  LoadIDLSearchPaths,
} from '@idl/idl/files';
import { IDL_LSP_LOG, IDL_MCP_LOG, LogManager } from '@idl/logger';
import {
  MCPTrackResources,
  RegisterAllLanguageServerMCPTools,
  RegisterMCPTaskTools,
} from '@idl/mcp/language-server-tools';
import { MCPServer } from '@idl/mcp/server';
import { RegisterStaticMCPResources } from '@idl/mcp/server-resources';
import {
  ENVI_TOOL_WORKFLOW_REGISTRY,
  RegisterAllMCPTools,
} from '@idl/mcp/server-tools';
import {
  WebSocketExecutionBackend,
  WebSocketToolBridge,
} from '@idl/mcp/websocket';
import { IDLIndex } from '@idl/parsing/index';
import { IAgentServerConfig } from '@idl/types/agents';
import {
  IIDLMCPExecutionBackend,
  PrepareIDLCodeCallback,
} from '@idl/types/mcp';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';
import type { Application } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import { CreateIDLMachineBackend } from './create-idl-machine-backend';

/**
 * Configuration for the MCP language server.
 */
export interface IMCPLanguageServerOptions {
  /**
   * WebSocket bridge that ENVI tool calls are routed through whenever a
   * client is connected. Everything else always runs via the local IDL
   * Machine backend.
   */
  websocketBridge: WebSocketToolBridge;
}

/**
 * Log manager for the server
 */
export const LOG_MANAGER = new LogManager({
  alert: () => {
    //
  },
});

/**
 * Starts the language server for our dedicated MCP server - so we can re-use our MCP
 * tools over here.
 *
 * Mounts MCP routes on the provided Express app instead of creating a standalone server.
 */
export async function CreateStandaloneMCPServer(
  app: Application,
  config: IAgentServerConfig,
  options: IMCPLanguageServerOptions,
) {
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

  // force dark mode
  process.env['IDL_THEME'] = '1';

  /**
   * Check for configuration packaged with our app
   *
   * This allows us to include extensions, custom_code, and tool workflows
   * without having to install in other locations
   *
   * Premise of this is a simpler setup/use without manipulating file systems
   */
  try {
    /**
     * Check for local config at root of extension directory
     */
    const configDir = GetExtensionPath('config');

    // log that we found it if we make it here
    LOG_MANAGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: `Found local config folder, checking for content to load`,
    });

    /**
     * See if we have custom code
     */
    const customCode = join(configDir, 'custom_code');
    if (existsSync(customCode)) {
      LOG_MANAGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Registering config/custom_code`,
      });
      process.env['ENVI_CUSTOM_CODE'] = customCode;
      idlSearchPath[customCode] = true;
    }

    /**
     * See if we have extensions
     */
    const extensions = join(configDir, 'extensions');
    if (existsSync(extensions)) {
      LOG_MANAGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Registering config/extensions`,
      });
      process.env['ENVI_EXTENSIONS'] = extensions;
      idlSearchPath[extensions] = true;
    }

    /**
     * See if we have workflows
     */
    const workflows = join(configDir, 'envi-tool-workflows');
    if (existsSync(workflows)) {
      LOG_MANAGER.log({
        log: IDL_LSP_LOG,
        type: 'info',
        content: `Registering config/envi-tool-workflows`,
      });
      // load and overwrite any that we already have
      ENVI_TOOL_WORKFLOW_REGISTRY.loadWorkflowsFromFolder(workflows, true);
    }
  } catch (err) {
    LOG_MANAGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: [`Did not find local config folder`, err],
    });
  }

  // index
  const index = new IDLIndex(LOG_MANAGER, 1, false);

  // load global tokens
  index.loadGlobalTokens(DEFAULT_IDL_EXTENSION_CONFIG);

  /** Find relevant files that we need to index */
  const files = await FindFiles(idlSearchPath);

  // alert users
  LOG_MANAGER.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: [
      'Language server initialized, indexing code in these folders:',
      idlSearchPath,
    ],
  });

  /**
   * Index workspace files we found
   */
  await index.indexWorkspaceFiles(files, idlSearchPath, true);

  // load global tokens
  index.loadGlobalTokens(DEFAULT_IDL_EXTENSION_CONFIG);

  /**
   * Callback to prepare code
   */
  const codePrepare: PrepareIDLCodeCallback = async (code) => {
    return await index.indexerPool.workerio.postAndReceiveMessage(
      index.getNextWorkerID(),
      LSP_WORKER_THREAD_MESSAGE_LOOKUP.PREPARE_IDL_CODE,
      {
        code,
      },
    ).response;
  };

  /**
   * Hybrid backend: forwards the small set of allowed ENVI tools to a
   * connected WS client, and runs everything else via the local IDL
   * Machine process.
   */
  const backend: IIDLMCPExecutionBackend = CreateIDLMachineBackend(
    LOG_MANAGER,
    idlPath,
    codePrepare,
    options.websocketBridge,
  );

  // eslint-disable-next-line prefer-const
  let mcpServer: MCPServer;

  // start the MCP server with the execution callback, mounting on the provided Express app
  MCPServer.start({
    app,
    logManager: LOG_MANAGER,
    idlExecutionCallback: (id, tool, params) => {
      return backend.runMCPTool(id, tool, params, (message) => {
        if (mcpServer) {
          mcpServer.sendToolExecutionNotification(id, {
            message,
          });
        }
      });
    },
    idlIndex: index,
    failCallback: (err) => {
      LOG_MANAGER.log({
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
  mcpServer = MCPServer.instance;

  // register static resources (documentation links)
  RegisterStaticMCPResources();

  // track dynamic file-based resources
  try {
    MCPTrackResources(LOG_MANAGER);
  } catch (err) {
    LOG_MANAGER.log({
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
    RegisterMCPTaskTools(MCPServer.instance, index, {
      whitelist: config.mcp.enviToolWhitelist,
      blacklist: config.mcp.enviToolBlacklist,
    });
  }
}
