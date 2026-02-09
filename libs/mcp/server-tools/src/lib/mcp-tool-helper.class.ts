import { ObjectifyError } from '@idl/error-shared';
import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { SimplePromiseQueue } from '@idl/shared/extension';
import {
  IMCPToolProgress,
  MCPToolHTTPResponse,
  MCPToolParams,
  MCPToolResponse_VSCode,
  MCPTools,
  MCPTools_VSCode,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { McpServer, ToolCallback } from '@modelcontextprotocol/sdk/server/mcp';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import {
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types';
import { nanoid } from 'nanoid';
import { ZodRawShape } from 'zod';

import {
  IMCPHelperOptions,
  MCPRegistryToolInfo,
  MCPToolCallback,
} from './mcp-tool-helper.interface';

/**
 * Helper class that manages MCP tool registration and context tracking
 * for running tools with progress notifications
 *
 * Combines functionality for:
 * - Registering tools with the MCP server
 * - Tracking tool execution contexts
 * - Sending progress notifications
 * - Managing concurrent tool execution
 */
export class MCPToolHelper implements IMCPHelperOptions {
  /** Log manager */
  logManager: LogManager;

  /**
   * Reference to the MCP server to we can register tools
   */
  mcpServer: McpServer;

  /** CLient messenger to talk to VSCode */
  messenger: VSCodeLanguageServerMessenger;

  /** Callback when a tool is invoked */
  toolInvokedCallback: (toolName: MCPTools) => void;

  /** Tool execution contexts that we are currently handling */
  private contexts: {
    [key: string]: RequestHandlerExtra<ServerRequest, ServerNotification>;
  } = {};

  /** Queue to throttle MCP server requests - only one tool runs at a time */
  private toolExecutionQueue = new SimplePromiseQueue();

  /**
   * Creates a new instance of the MCPToolHelper
   *
   * @param mcpServer - The MCP server instance to register tools with
   */
  constructor(options: IMCPHelperOptions) {
    Object.assign(this, options);
  }

  /**
   * Registers a tool with the MCP server and handles special logic like errors
   * and progress which individual tools shouldn't manage
   *
   * This also manages concurrent execution of tools so that only one runs
   * at a time
   *
   * @param name - The tool name
   * @param info - Tool information (title, description, input schema)
   * @param cb - Callback function to execute when the tool is invoked
   */
  registerTool<Tool extends MCPTools, Args extends ZodRawShape>(
    name: Tool,
    info: MCPRegistryToolInfo<Args>,
    cb: MCPToolCallback<Args, Tool>
  ) {
    return this.mcpServer.registerTool(name, info, (async (params, context) => {
      /** Track context */
      const id = this.registerToolExecutionContext(context);

      try {
        // init result
        let res: MCPToolHTTPResponse<Tool>;

        // call invoked callback
        this.toolInvokedCallback(name);

        // run tool one at a time
        await this.toolExecutionQueue.add(async () => {
          res = await cb(id, params, context);
        });

        // cleanup
        this.removeToolExecutionContext(id);

        // return result
        return res;
      } catch (err) {
        // cleanup
        this.removeToolExecutionContext(id);

        // write to logs
        this.logManager.log({
          log: IDL_MCP_LOG,
          type: 'error',
          content: ['Unknown error while executing toool'],
        });

        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Unknown error while running tool: ${JSON.stringify(
                ObjectifyError(err)
              )}`,
            },
          ],
        };
      }
    }) as ToolCallback<Args>);
  }

  /**
   * Sends a request to VSCode to run a tool
   */
  async sendRequestToVSCode<T extends MCPTools_VSCode>(
    executionId: string,
    tool: T,
    params: MCPToolParams<T>
  ): Promise<MCPToolResponse_VSCode<T>> {
    return this.messenger.sendRequest(LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP, {
      id: executionId,
      tool,
      params,
    }) as MCPToolResponse_VSCode<T>;
  }

  /**
   * For a given context ID, sends a notification to the agent we are interacting with
   */
  async sendToolExecutionNotification(id: string, progress: IMCPToolProgress) {
    if (id in this.contexts) {
      try {
        await this.contexts[id].sendNotification({
          method: 'notifications/message',
          params: {
            level: 'info',
            data: progress,
          },
        });
      } catch (err) {
        // no connection, race condition?
        console.log('Error sending notification', progress);
      }
    }
  }

  /**
   * Registers a context and returns an ID for the context
   *
   * @param context - The request handler context to register
   * @returns An ID that can be used to send notifications or remove the context
   */
  private registerToolExecutionContext(
    context: RequestHandlerExtra<ServerRequest, ServerNotification>
  ): string {
    const id = nanoid();
    this.contexts[id] = context;
    return id;
  }

  /**
   * Removes a context for a running tool
   *
   * @param id - The context ID to remove
   */
  private removeToolExecutionContext(id: string) {
    if (id in this.contexts) {
      delete this.contexts[id];
    }
  }
}
