import { Router } from 'express';

import { CreateChatRoutes } from '../routes/chat.routes';
import { CreateConfigRoutes } from '../routes/config.routes';
import { API_ROUTES_CONFIG } from './api-routes-config';

/**
 * Lists `method path` for every route on a router, using OpenAPI path syntax
 */
function ListRoutes(prefix: string, router: Router): string[] {
  return (router as any).stack
    .filter((layer: any) => layer.route)
    .flatMap((layer: any) =>
      Object.keys(layer.route.methods).map((method) =>
        `${method} ${prefix}${layer.route.path === '/' ? '' : layer.route.path}`.replace(
          /:(\w+)/g,
          '{$1}',
        ),
      ),
    );
}

describe('API docs', () => {
  it('documents every route', () => {
    const routes = [
      ...ListRoutes('/api/chat', CreateChatRoutes({} as any)),
      ...ListRoutes('/api/config', CreateConfigRoutes({} as any, 'unused')),
    ].sort();

    const documented = Object.entries(API_ROUTES_CONFIG['paths'] as object)
      .flatMap(([path, ops]) =>
        Object.keys(ops).map((method) => `${method} ${path}`),
      )
      .sort();

    expect(documented).toEqual(routes);
  });

  it('only references schemas that exist', () => {
    const json = JSON.stringify(API_ROUTES_CONFIG);
    const schemas = (API_ROUTES_CONFIG['components'] as any).schemas;

    for (const [, name] of json.matchAll(/#\/components\/schemas\/(\w+)/g)) {
      expect(schemas[name]).toBeDefined();
    }
  });
});
