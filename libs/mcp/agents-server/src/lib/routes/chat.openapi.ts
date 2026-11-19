import {
  ErrorResponse,
  JsonBody,
  JsonResponse,
  type OpenAPIPaths,
  SchemaRef,
} from '../docs/openapi.interface';

/**
 * OpenAPI paths for the routes in chat.routes.ts
 */
export const CHAT_OPENAPI_PATHS: OpenAPIPaths = {
  '/api/chat/models': {
    post: {
      tags: ['Chat'],
      summary: 'List available models',
      description:
        'Uses POST so optional request headers (e.g. bearer tokens) stay out of the URL.',
      requestBody: JsonBody(SchemaRef('AvailableModelsRequest'), false),
      responses: {
        200: JsonResponse(
          'Available models and the default',
          SchemaRef('AvailableModelsResponse'),
        ),
        400: ErrorResponse('Invalid request headers'),
        500: ErrorResponse('Failed to list models'),
      },
    },
  },
  '/api/chat/example-prompts': {
    get: {
      tags: ['Chat'],
      summary: 'List example prompts for the welcome screen',
      responses: {
        200: JsonResponse(
          'Configured example prompts',
          SchemaRef('ExamplePromptsResponse'),
        ),
        500: ErrorResponse('Failed to list example prompts'),
      },
    },
  },
  '/api/chat/instructions': {
    get: {
      tags: ['Chat'],
      summary: 'List chat instruction options',
      responses: {
        200: JsonResponse(
          'Instruction options and the default selection',
          SchemaRef('ChatInstructionsResponse'),
        ),
        500: ErrorResponse('Failed to list instructions'),
      },
    },
  },
  '/api/chat/{sessionId}/cancel': {
    post: {
      tags: ['Chat'],
      summary: 'Cancel the in-flight turn for a session',
      description:
        'Interrupts the current turn without closing the session, so follow-up messages keep full context.',
      parameters: [
        {
          name: 'sessionId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        204: { description: 'Turn cancelled' },
        500: ErrorResponse('Failed to cancel session'),
      },
    },
  },
  '/api/chat/message': {
    post: {
      tags: ['Chat'],
      summary: 'Send a chat message and stream the reply',
      description:
        'Streams Server-Sent Events. Each event is `data: <JSON ChatStreamChunk>`, discriminated by `type`. Idle connections receive `: keepalive` comments. The stream ends after an `error` or `cancelled` chunk, or when the turn completes. Swagger UI cannot display streams, so use "Try it out" only for validation errors.',
      requestBody: JsonBody(SchemaRef('ChatMessageRequest')),
      responses: {
        200: {
          description: 'Stream of chat chunks',
          content: {
            'text/event-stream': { schema: SchemaRef('ChatStreamChunk') },
          },
        },
        400: ErrorResponse('Missing required fields or invalid headers'),
        500: ErrorResponse('Internal server error'),
      },
    },
  },
};
