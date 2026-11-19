import { CHAT_OPENAPI_PATHS } from '../routes/chat.openapi';
import { CONFIG_OPENAPI_PATHS } from '../routes/config.openapi';
import type { OpenAPIObject } from './openapi.interface';
import { OPENAPI_SCHEMAS } from './openapi-schemas';

/**
 * Express route prefix where Swagger UI is served
 */
export const API_DOCS_ROUTE = '/api/docs';

/**
 * OpenAPI document for the agents server, assembled from the per-routes files
 */
export const API_ROUTES_CONFIG: OpenAPIObject = {
  openapi: '3.0.3',
  info: {
    title: 'IDL Agents Server API',
    version: '1.0.0',
    description: 'HTTP API for the IDL/ENVI agents server',
  },
  tags: [
    { name: 'Chat', description: 'Chat sessions and streaming completions' },
    { name: 'Config', description: 'Server configuration and list data' },
  ],
  paths: {
    ...CHAT_OPENAPI_PATHS,
    ...CONFIG_OPENAPI_PATHS,
  },
  components: { schemas: OPENAPI_SCHEMAS },
};
