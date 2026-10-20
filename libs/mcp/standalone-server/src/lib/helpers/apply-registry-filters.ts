import {
  ENVI_TOOL_WORKFLOW_REGISTRY,
  MCP_SKILL_REGISTRY,
} from '@idl/mcp/server-tools';
import { IAgentServerConfig } from '@idl/types/agents';

import { MCP_INSTRUCTION_REGISTRY } from '../mcp/create-standalone-mcp-server';

/**
 * Applies whitelist/blacklist filters from the server config to our
 * instruction, skill, and tool workflow registries
 */
export function ApplyRegistryFilters(config: IAgentServerConfig) {
  MCP_INSTRUCTION_REGISTRY.filters.updateFilters({
    whitelist: config.agent.mcp.instructionsWhitelist,
    blacklist: config.agent.mcp.instructionsBlacklist,
  });

  MCP_SKILL_REGISTRY.filters.updateFilters({
    whitelist: config.agent.mcp.skillWhitelist,
    blacklist: config.agent.mcp.skillBlacklist,
  });

  ENVI_TOOL_WORKFLOW_REGISTRY.filters.updateFilters({
    whitelist: config.agent.mcp.enviToolWorkflowWhitelist,
    blacklist: config.agent.mcp.enviToolWorkflowBlacklist,
  });
}
