import { ObjectifyError } from '@idl/error-shared';
import { MCP_SERVER } from '@idl/mcp/server';
import { SimplePromiseQueue } from '@idl/shared/extension';
import { MCPToolHTTPResponse, MCPTools } from '@idl/types/mcp';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp';
import { ZodRawShape } from 'zod';

import { MCPRegistryToolCallback } from './mcp-tool-registry.interface';
import { MCP_TOOL_CONTEXT } from './register-all-mcp-tools';

/**
 * Queu to throttle MCP server requests
 */
const TOOL_EXECUTION_QUEUE = new SimplePromiseQueue();

/**
 * Registers tools with our MCP server and handles special logic like errors
 * and progress which individual tools shouldn't manage
 *
 * This also manages concurrent execution of tools so that only one runs
 * at a time
 */
export class MCPToolRegistry {
  /**
   * Register a tool with the MCP server
   */
  static registerTool<Tool extends MCPTools, Args extends ZodRawShape>(
    name: Tool,
    displayName: string,
    description: string,
    paramsSchema: Args,
    cb: MCPRegistryToolCallback<Args, Tool>
  ) {
    return MCP_SERVER.registerTool(
      name,
      {
        title: displayName,
        description,
        inputSchema: paramsSchema,
        // outputSchema: { result: z.number() },
      },
      (async (params, context) => {
        /** Track context */
        const id = MCP_TOOL_CONTEXT.registerContext(context);

        try {
          // init result
          let res: MCPToolHTTPResponse<Tool>;

          // run tool one at a time
          await TOOL_EXECUTION_QUEUE.add(async () => {
            res = await cb(id, params, context);
          });

          // cleanup
          MCP_TOOL_CONTEXT.removeContext(id);

          // return result
          return res;
        } catch (err) {
          // cleanup
          MCP_TOOL_CONTEXT.removeContext(id);

          return {
            content: [
              {
                type: 'text',
                text: `Unknown error while running tool (could be server-based or in IDL/ENVI): ${JSON.stringify(
                  ObjectifyError(err)
                )}`,
              },
            ],
          };
        }
      }) as ToolCallback<Args>
    );
  }
}
