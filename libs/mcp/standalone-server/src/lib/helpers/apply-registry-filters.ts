import { MCP_TASK_REGISTRY } from '@idl/mcp/language-server-tools';
import {
  ENVI_TOOL_WORKFLOW_REGISTRY,
  MCP_SKILL_REGISTRY,
} from '@idl/mcp/server-tools';
import type { IAgentServerConfig } from '@idl/types/agents';

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

  MCP_TASK_REGISTRY?.filters?.updateFilters({
    whitelist: config.agent.mcp.enviToolWhitelist,
    blacklist: config.agent.mcp.enviToolBlacklist,
  });
}
