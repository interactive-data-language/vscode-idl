import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

/**
 * Shared description for our MCP tools that run ENVI tools
 */
export const ENVI_TOOL_INSTRUCTIONS = `
For image processing and remote sensing or spectral questions, follow these rules:

If you have not loaded an ENVI prompt, retrieve the prompt "envi" from "${MCP_TOOL_LOOKUP.GET_PROMPT}" for instructions prior to running any tools below.

You can control a software system by using 3 tools.

1. "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}" - Use this to discover what tools ENVI has available. This returns a list of tool names and descriptions.

  -  *CRITICAL* load this entire response into your context window to make sure you can properly answer questions.

  - (Optional) Use "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS}" and "${MCP_TOOL_LOOKUP.GET_ENVI_TOOL_WORKFLOW}" to find combinations of ENVI's tools to solve specific problems.

2. "${MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS}" - Once you know a capability you want to use, call this tool with one or more names of capabilities. It will return the parameter schema (what inputs each capability needs).

3. "${MCP_TOOL_LOOKUP.RUN_ENVI_TOOL}" - Finally, use this tool to run a capability, providing the correct parameters as JSON (matching the schema you retrieved).

💡 RULES:
- Always call "${MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS}" first when you need to check what capabilities are available.
- Always call "${MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS}" before trying to run a capability, so you know what inputs are required.
- Do not guess parameters - retrieve the schema first.
`;
