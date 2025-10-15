import { ObjectifyError } from '@idl/error-shared';
import { MCP_SERVER } from '@idl/mcp/server';
import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp';
import { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { ZodRawShape } from 'zod';

import { MCPRegistryToolCallback } from './mcp-tool-registry.interface';
import { MCP_TOOL_CONTEXT } from './register-all-mcp-tools';

/**
 * Registers tools with our MCP server and handles special logic like errors
 * and progress which individual tools shouldn't manage
 */
export class MCPToolRegistry {
  /**
   * Register a tool with the MCP server
   */
  static tool<Args extends ZodRawShape>(
    name: string,
    description: string,
    paramsSchema: Args,
    cb: MCPRegistryToolCallback<Args>
  ) {
    return MCP_SERVER.tool(name, description, paramsSchema, (async (
      params,
      context
    ) => {
      /** Track context */
      const id = MCP_TOOL_CONTEXT.registerContext(context);

      try {
        // run our tool - force types to set - it return unknown for some reason
        const res = (await cb(id, params, context)) as CallToolResult;

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
    }) as ToolCallback<Args>);
  }
}
