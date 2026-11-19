import {
  ErrorResponse,
  JsonBody,
  JsonResponse,
  type OpenAPIObject,
  type OpenAPIPaths,
  SchemaRef,
} from '../docs/openapi.interface';

/**
 * Builds the GET operation for a list route
 */
function ListOperation(
  summary: string,
  schemaName: string,
  label: string,
): OpenAPIObject {
  return {
    get: {
      tags: ['Config'],
      summary,
      responses: {
        200: JsonResponse(summary, SchemaRef(schemaName)),
        500: ErrorResponse(`Failed to list ${label}`),
      },
    },
  };
}

/**
 * OpenAPI paths for the routes in config.routes.ts
 */
export const CONFIG_OPENAPI_PATHS: OpenAPIPaths = {
  '/api/config': {
    get: {
      tags: ['Config'],
      summary: 'Get the current server configuration',
      responses: {
        200: JsonResponse(
          'Current configuration',
          SchemaRef('AgentServerConfig'),
        ),
      },
    },
    put: {
      tags: ['Config'],
      summary: 'Update the server configuration',
      description:
        'Deep-merges the body into the current configuration (arrays are replaced), validates, and saves it. Properties that cannot change while running are saved and reported in `restartReasons`.',
      requestBody: JsonBody({
        type: 'object',
        description: 'Partial configuration to merge',
      }),
      responses: {
        200: JsonResponse(
          'Updated configuration',
          SchemaRef('UpdateConfigResponse'),
        ),
        400: ErrorResponse('Body is not an object or configuration is invalid'),
        500: ErrorResponse('Failed to save configuration'),
      },
    },
  },
  '/api/config/list/agent-instructions': ListOperation(
    'List agent instruction options',
    'ListAgentInstructionsResponse',
    'Agent Instructions',
  ),
  '/api/config/list/agent-skills': ListOperation(
    'List agent skills',
    'ListEnabledItemsResponse',
    'Agent Skills',
  ),
  '/api/config/list/mcp-tools': ListOperation(
    'List MCP tools (empty until the MCP server starts)',
    'ListMCPToolsResponse',
    'MCP tools',
  ),
  '/api/config/list/envi-tools': ListOperation(
    'List ENVI tools (empty until the language server is ready)',
    'ListEnabledItemsResponse',
    'ENVI tools',
  ),
  '/api/config/list/envi-tool-workflows': ListOperation(
    'List ENVI tool workflows',
    'ListEnabledItemsResponse',
    'ENVI Tool workflows',
  ),
  '/api/config/list/idl-locations': ListOperation(
    'List matching IDL installations',
    'ListIDLLocationsResponse',
    'IDL Locations',
  ),
};
