import express, { Router } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { serve, setup } from 'swagger-ui-express';

import { API_ROUTES_CONFIG } from '../docs/api-routes-config';

/**
 * Folder with Swagger UI's static files, copied next to the bundle by the
 * server's webpack config
 */
const SWAGGER_UI_ASSETS = join(__dirname, 'swagger-ui');

/**
 * Create routes that serve Swagger UI and the raw OpenAPI document
 */
export function CreateDocsRoutes(): Router {
  const router = Router();

  /**
   * GET /api/docs/openapi.json
   * Returns the raw OpenAPI document
   */
  router.get('/openapi.json', (_req, res) => {
    res.json(API_ROUTES_CONFIG);
  });

  /**
   * GET /api/docs
   * Swagger UI
   *
   * `serve[0]` generates swagger-ui-init.js. We use our own static folder
   * instead of `serve[1]` because that path breaks when bundled; when we run
   * unbundled, fall back to the package's own handler.
   */
  router.use(
    '/',
    existsSync(SWAGGER_UI_ASSETS)
      ? [serve[0], express.static(SWAGGER_UI_ASSETS, { index: false })]
      : serve,
    setup(API_ROUTES_CONFIG),
  );

  return router;
}
