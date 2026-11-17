import { ANALYTICS_REPOSITORY_REGISTRY } from '@idl/mcp/analytics-repository';
import { MCP_TASK_REGISTRY } from '@idl/mcp/language-server-tools';
import { MCPServer } from '@idl/mcp/server';
import {
  ENVI_TOOL_WORKFLOW_REGISTRY,
  MCP_SKILL_REGISTRY,
} from '@idl/mcp/server-tools';
import type { IAgentServerConfig } from '@idl/types/agents';

import { MCP_INSTRUCTION_REGISTRY } from '../mcp/create-standalone-mcp-server';

/**
 * Updates server configuration across different server components
 */
export function UpdateServerConfig(config: IAgentServerConfig) {
  ANALYTICS_REPOSITORY_REGISTRY.setServers(config.packages.repositories);

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

  if (MCPServer.isStarted) {
    MCPServer.instance.filters.updateFilters({
      whitelist: config.agent.mcp.mcpToolWhitelist,
    });
  }

  MCP_TASK_REGISTRY?.filters?.updateFilters({
    whitelist: config.agent.mcp.enviToolWhitelist,
    blacklist: config.agent.mcp.enviToolBlacklist,
  });
}
