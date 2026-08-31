import { IMCPConfig } from '@idl/vscode/extension-config';

/**
 * MCP config for agents, without the "enabled" flag
 *
 * Mirror what we set for VSCode
 */
export type IAgentsMCPConfig = Omit<IMCPConfig, 'enabled'>;
