import type { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * OpenAI ChatCompletionTool format
 */
export interface OpenAITool {
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
    strict?: boolean;
  };
  type: 'function';
}

/**
 * Converts MCP tool definitions to OpenAI ChatCompletionTool format
 * for use with LangChain's ChatOpenAI model
 *
 * @param mcpTools - Array of tools from MCP server's listTools() response
 * @returns Array of tools in OpenAI format
 */
export function convertMCPToolsToOpenAI(mcpTools: Tool[]): OpenAITool[] {
  return mcpTools.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema as Record<string, unknown>,
      // Enable strict mode for better validation if the schema supports it
      strict: false,
    },
  }));
}
