import { FindMatchingIDLInstalls } from '@idl/idl/files';
import { MCP_TASK_REGISTRY } from '@idl/mcp/language-server-tools';
import { MCPServer } from '@idl/mcp/server';
import {
  ENVI_TOOL_WORKFLOW_REGISTRY,
  MCP_SKILL_REGISTRY,
} from '@idl/mcp/server-tools';
import type { IAgentServerConfig } from '@idl/types/agents';
import type {
  ListAgentInstructionsResponse,
  ListAgentSkillsResponse,
  ListENVIToolsResponse,
  ListENVIToolWorkflowsResponse,
  ListIDLLocationsResponse,
  ListMCPToolsResponse,
} from '@idl/types/chat';
import { Router } from 'express';
import { existsSync } from 'fs';

import { MCP_INSTRUCTION_REGISTRY } from '../mcp/create-standalone-mcp-server';

/**
 * Create config routes
 *
 * No schema validation yet — the config object passed in is mutated in
 * place so other consumers (e.g. `Chat`) holding the same reference see updates.
 */
export function CreateConfigRoutes(config: IAgentServerConfig): Router {
  const router = Router();

  /**
   * GET /api/config
   * Returns the current server configuration.
   */
  router.get('/', (_req, res) => {
    res.json(config);
  });

  /**
   * PUT /api/config
   * Merges the request body into the current configuration and returns it.
   */
  router.put('/', (req, res) => {
    Object.assign(config, req.body);
    res.json(config);
  });

  /**
   * Registers a GET route that returns the native result of a list method
   */
  const addListRoute = <T>(
    path: string,
    label: string,
    list: () => Promise<T> | T,
  ) => {
    router.get(path, async (_req, res) => {
      try {
        res.json(await list());
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error:
            error instanceof Error ? error.message : `Failed to list ${label}`,
        });
      }
    });
  };

  /**
   * Returns the agent instruction options
   */
  addListRoute<ListAgentInstructionsResponse>(
    '/list/agent-instructions',
    'Agent Instructions',
    () => MCP_INSTRUCTION_REGISTRY.list(),
  );

  /**
   * Returns agent skill names and descriptions
   */
  addListRoute<ListAgentSkillsResponse>(
    '/list/agent-skills',
    'Agent Skills',
    () => MCP_SKILL_REGISTRY.list(),
  );

  /**
   * Returns details for the tools our MCP server has, empty until it starts
   */
  addListRoute<ListMCPToolsResponse>('/list/mcp-tools', 'MCP tools', () =>
    MCPServer.isStarted ? MCPServer.instance.listTools() : [],
  );

  /**
   * Returns descriptions for ENVI tools, empty until the language server has
   * created the task registry
   */
  addListRoute<ListENVIToolsResponse>(
    '/list/envi-tools',
    'ENVI tools',
    async () => (await MCP_TASK_REGISTRY?.list()) || {},
  );

  /**
   * GET /api/config/list/envi-tool-workflows
   * Returns the names of ENVI Tool workflows
   */
  addListRoute<ListENVIToolWorkflowsResponse>(
    '/list/envi-tool-workflows',
    'ENVI Tool workflows',
    () => ENVI_TOOL_WORKFLOW_REGISTRY.list(),
  );

  /**
   * Lists options for IDL installation
   */
  addListRoute<ListIDLLocationsResponse>(
    '/list/idl-locations',
    'IDL Locations',
    () => {
      // load candidate locations for version 9.2 or later (required for agent)
      const candidates = FindMatchingIDLInstalls('9.2');

      // return which folders exist
      return candidates.filter((item) => existsSync(item));
    },
  );

  return router;
}
