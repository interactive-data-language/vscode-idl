import { MCPTools } from '@idl/types/mcp';
import { IMCPConfig } from '@idl/vscode/extension-config';

/**
 * MCP config for agents, without the "enabled" flag
 *
 * Mirror what we set for VSCode without readonly
 */
export type IAgentsMCPConfig = {
  -readonly [Key in keyof Omit<IMCPConfig, 'enabled'>]: IMCPConfig[Key];
} & {
  /**
   * Whitelist of ENVI tool workflow names to expose via agent (empty = all allowed)
   */
  enviToolWorkflowWhitelist: string[];
  /**
   * Blacklist of ENVI tool workflow names to hide via agent
   */
  enviToolWorkflowBlacklist: string[];
  /**
   * Whitelist of instruction IDs to expose via agent (empty = all allowed)
   */
  instructionsWhitelist: string[];
  /**
   * Blacklist of instruction IDs to hide via agent
   */
  instructionsBlacklist: string[];
  /**
   * Whitelist of MCP tools to expose via agent
   */
  mcpToolWhitelist: MCPTools[];
  /**
   * Blacklist of MCP tools to hide via agent
   */
  mcpToolBlackList: MCPTools[];
  /**
   * Whitelist of skill names to expose via agent (empty = all allowed)
   */
  skillWhitelist: string[];
  /**
   * Blacklist of skill names to hide via agent
   */
  skillBlacklist: string[];
};
