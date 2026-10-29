import type { IAgentServerConfig } from '@idl/types/agents';
import { Router } from 'express';

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

  return router;
}
