import { FindMatchingIDLInstalls } from '@idl/idl/files';
import { MCP_TASK_REGISTRY } from '@idl/mcp/language-server-tools';
import { MCPServer } from '@idl/mcp/server';
import {
  ENVI_TOOL_WORKFLOW_REGISTRY,
  MCP_SKILL_REGISTRY,
} from '@idl/mcp/server-tools';
import {
  AGENT_SERVER_CONFIG_SCHEMA,
  type IAgentServerConfig,
} from '@idl/types/agents';
import type {
  ListAgentInstructionsResponse,
  ListAgentSkillsResponse,
  ListENVIToolsResponse,
  ListENVIToolWorkflowsResponse,
  ListIDLLocationsResponse,
  ListMCPToolsResponse,
} from '@idl/types/chat';
import merge from 'deepmerge';
import { Router } from 'express';
import { copy } from 'fast-copy';

import { GetRestartReasons } from '../helpers/get-restart-reasons';
import { SaveConfig } from '../helpers/load-config';
import { UpdateServerConfig } from '../helpers/update-server-config';
import { ValidateConfig } from '../helpers/validate-config';
import { MCP_INSTRUCTION_REGISTRY } from '../mcp/create-standalone-mcp-server';

/**
 * Create config routes
 *
 * The config object passed in is updated in place so other consumers
 * (e.g. `Chat`) holding the same reference see updates.
 *
 * If `configFile` is provided, updates are saved to it, otherwise the default
 * config location is used.
 */
export function CreateConfigRoutes(
  config: IAgentServerConfig,
  configFile?: string,
): Router {
  /**
   * Snapshot of what the running server was started with, used to figure out
   * if changes need a restart
   */
  const runningConfig = copy(config);

  /** Create router */
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
   * Deep-merges the request body into the current configuration, validates and
   * saves it, and returns the new configuration.
   *
   * Properties that can't change while running are saved, but they are
   * reported in `restartReasons` and `requiresRestart` is true.
   */
  router.put('/', (req, res) => {
    const body = req.body;
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      res.status(400).json({ error: 'Request body must be a JSON object' });
      return;
    }

    // arrays replace instead of concatenate, and version can't change
    const merged = merge(copy(config), body, {
      arrayMerge: (_target, source) => source,
    });
    merged.version = config.version;

    const parsed = AGENT_SERVER_CONFIG_SCHEMA.safeParse(merged);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: 'Invalid configuration', issues: parsed.error.issues });
      return;
    }
    const next = parsed.data as IAgentServerConfig;

    const problems = ValidateConfig(next);
    if (problems.length > 0) {
      res.status(400).json({ error: 'Invalid configuration', problems });
      return;
    }

    try {
      SaveConfig(next, configFile);
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to save config',
      });
      return;
    }

    // update in place so everything holding the reference sees the change
    for (const key of Object.keys(config)) {
      delete (config as any)[key];
    }
    Object.assign(config, next);

    // apply what can change while running
    UpdateServerConfig(config);

    const restartReasons = GetRestartReasons(runningConfig, config);
    res.json({
      config,
      requiresRestart: restartReasons.length > 0,
      restartReasons,
    });
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
    () => MCP_INSTRUCTION_REGISTRY.list({ ignoreFilters: true }),
  );

  /**
   * Returns agent skill names and descriptions
   */
  addListRoute<ListAgentSkillsResponse>(
    '/list/agent-skills',
    'Agent Skills',
    async () =>
      Object.entries(
        await MCP_SKILL_REGISTRY.list({ ignoreFilters: true }),
      ).map(([name, description]) => ({ id: name, name, description })),
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
    async () =>
      Object.entries(
        (await MCP_TASK_REGISTRY?.list({ ignoreFilters: true })) || {},
      ).map(([name, description]) => ({
        id: name,
        name,
        description,
      })),
  );

  /**
   * GET /api/config/list/envi-tool-workflows
   * Returns the names of ENVI Tool workflows
   */
  addListRoute<ListENVIToolWorkflowsResponse>(
    '/list/envi-tool-workflows',
    'ENVI Tool workflows',
    async () =>
      (await ENVI_TOOL_WORKFLOW_REGISTRY.list({ ignoreFilters: true })).map(
        (name) => ({ id: name, name }),
      ),
  );

  /**
   * Lists options for IDL installation
   */
  addListRoute<ListIDLLocationsResponse>(
    '/list/idl-locations',
    'IDL Locations',
    async () =>
      (await FindMatchingIDLInstalls('9.2', '>=')).map((location) => ({
        id: location,
        name: location,
      })),
  );

  return router;
}
