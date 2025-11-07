import { EXTENSION_FULL_NAME } from '@idl/shared/extension';
import { MCPTools } from '@idl/types/mcp';

/**
 * Gets the name of an MCP Tool that is scoped to the name/configuration of our
 * extension.
 */
export function GetMCPToolName(name: MCPTools) {
  return `${EXTENSION_FULL_NAME}/${name}`;
}
