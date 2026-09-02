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
   * Whitelist of MCP tools to expose via agent
   */
  toolWhitelist: MCPTools[];
  /**
   * Blacklist of MCP tools to hide via agent
   */
  toolBlackList: MCPTools[];
};
