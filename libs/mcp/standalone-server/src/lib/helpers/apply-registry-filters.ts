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
    whitelist: config.mcp.instructionsWhitelist,
    blacklist: config.mcp.instructionsBlacklist,
  });

  MCP_SKILL_REGISTRY.filters.updateFilters({
    whitelist: config.mcp.skillWhitelist,
    blacklist: config.mcp.skillBlacklist,
  });

  ENVI_TOOL_WORKFLOW_REGISTRY.filters.updateFilters({
    whitelist: config.mcp.enviToolWorkflowWhitelist,
    blacklist: config.mcp.enviToolWorkflowBlacklist,
  });
}
