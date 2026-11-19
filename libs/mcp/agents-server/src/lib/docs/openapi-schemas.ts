import { AGENT_SERVER_CONFIG_SCHEMA } from '@idl/types/agents';
import { z } from 'zod';

import type { OpenAPIObject } from './openapi.interface';

/** Reference to a string schema */
const STRING = { type: 'string' };

/** Free-form string map */
const STRING_MAP = { type: 'object', additionalProperties: STRING };

/** Builds an object schema */
function Obj(
  properties: OpenAPIObject,
  required: string[] = [],
): OpenAPIObject {
  return { type: 'object', properties, required };
}

/** Builds a reference to another schema */
function Ref(name: string): OpenAPIObject {
  return { $ref: `#/components/schemas/${name}` };
}

/** Chunk with a literal type and extra properties */
function Chunk(
  type: string,
  properties: OpenAPIObject = {},
  required: string[] = [],
  base = false,
): OpenAPIObject {
  return Obj(
    {
      type: { type: 'string', enum: [type] },
      ...(base
        ? {
            stepId: STRING,
            timestamp: {
              type: 'number',
              description: 'Epoch milliseconds from the source event',
            },
          }
        : {}),
      ...properties,
    },
    ['type', ...required],
  );
}

/**
 * Shared schemas referenced by the route docs
 *
 * The config schema is generated from our zod schema; the rest mirror the
 * interfaces in `@idl/types/chat`
 */
export const OPENAPI_SCHEMAS: OpenAPIObject = {
  ErrorResponse: Obj({ error: STRING }, ['error']),
  AgentServerConfig: z.toJSONSchema(AGENT_SERVER_CONFIG_SCHEMA, {
    io: 'input',
    unrepresentable: 'any',
  }),
  UpdateConfigResponse: Obj(
    {
      config: Ref('AgentServerConfig'),
      requiresRestart: { type: 'boolean' },
      restartReasons: { type: 'array', items: STRING },
    },
    ['config', 'requiresRestart', 'restartReasons'],
  ),
  AvailableModelsRequest: Obj({
    requestHeaders: { ...STRING_MAP, description: 'Headers for the LLM call' },
  }),
  AvailableModelsResponse: Obj(
    {
      defaultModelID: STRING,
      models: {
        type: 'array',
        items: Obj({ id: STRING, name: STRING, description: STRING }, [
          'id',
          'name',
          'description',
        ]),
      },
    },
    ['defaultModelID', 'models'],
  ),
  ExamplePromptsResponse: Obj(
    {
      prompts: {
        type: 'array',
        description:
          'Each prompt is a string or array of lines joined by blank lines',
        items: { oneOf: [STRING, { type: 'array', items: STRING }] },
      },
    },
    ['prompts'],
  ),
  ChatInstructionOption: Obj(
    { id: STRING, name: STRING, description: STRING },
    ['id', 'name', 'description'],
  ),
  ChatInstructionsResponse: Obj(
    {
      defaultInstructions: STRING,
      options: { type: 'array', items: Ref('ChatInstructionOption') },
    },
    ['defaultInstructions', 'options'],
  ),
  TodoItem: Obj(
    {
      id: STRING,
      status: {
        type: 'string',
        enum: ['done', 'in-progress', 'pending', 'skipped'],
      },
      text: STRING,
    },
    ['id', 'status', 'text'],
  ),
  ChatMessageContent: Obj(
    {
      payload: STRING,
      type: {
        type: 'string',
        enum: [
          'result',
          'text',
          'thinking',
          'tool_call',
          'tool_error',
          'tool_result',
        ],
      },
    },
    ['payload', 'type'],
  ),
  ChatMessage: Obj(
    {
      id: STRING,
      type: { type: 'string', enum: ['system', 'thinking', 'tool', 'user'] },
      content: { type: 'array', items: Ref('ChatMessageContent') },
      status: { type: 'string', enum: ['done', 'in-progress', 'stopped'] },
      isFinal: { type: 'boolean' },
      stepId: STRING,
      title: STRING,
      startedAt: { type: 'number' },
      endedAt: { type: 'number' },
    },
    ['id', 'type', 'content'],
  ),
  ChatMessageRequest: Obj(
    {
      message: { ...STRING, description: "The user's message" },
      model: { ...STRING, description: "Model ID, e.g. 'gpt-4o-mini'" },
      sessionId: { ...STRING, description: 'Chat session identifier' },
      instructions: {
        ...STRING,
        description: 'Instruction type to load as the system instruction',
      },
      conversationHistory: { type: 'array', items: Ref('ChatMessage') },
      currentTodos: { type: 'array', items: Ref('TodoItem') },
      requestHeaders: {
        ...STRING_MAP,
        description: 'Headers for this request’s LLM calls',
      },
    },
    ['message', 'model', 'sessionId', 'instructions', 'conversationHistory'],
  ),
  ChatTokenUsage: Obj(
    {
      currentTokens: { type: 'number' },
      tokenLimit: { type: 'number' },
      conversationTokens: { type: 'number' },
      systemTokens: { type: 'number' },
      toolDefinitionsTokens: { type: 'number' },
    },
    ['currentTokens', 'tokenLimit'],
  ),
  ChatStreamChunk: {
    description: 'Discriminated by `type`',
    oneOf: [
      Chunk('done'),
      Chunk('cancelled'),
      Chunk('error', { error: STRING }, ['error']),
      Chunk('title', { title: STRING }, ['title']),
      Chunk('step_start', { agentId: STRING, model: STRING }, ['stepId'], true),
      Chunk(
        'step_end',
        { hasToolCalls: { type: 'boolean' } },
        ['hasToolCalls', 'stepId'],
        true,
      ),
      Chunk(
        'message_start',
        { messageId: STRING, isFinal: { type: 'boolean' } },
        ['messageId', 'isFinal', 'stepId'],
        true,
      ),
      Chunk(
        'message_end',
        { messageId: STRING, isFinal: { type: 'boolean' } },
        ['messageId', 'isFinal', 'stepId'],
        true,
      ),
      Chunk('intent', { intent: STRING, toolCallId: STRING }, ['intent'], true),
      Chunk(
        'text_chunk',
        { content: STRING, messageId: STRING },
        ['content'],
        true,
      ),
      Chunk(
        'thinking_chunk',
        { content: STRING, done: { type: 'boolean' }, thinkingId: STRING },
        ['content', 'done', 'thinkingId'],
        true,
      ),
      Chunk(
        'tool_call',
        {
          toolCallId: STRING,
          toolName: STRING,
          toolArgs: { type: 'object', additionalProperties: true },
        },
        ['toolCallId', 'toolName', 'toolArgs'],
        true,
      ),
      Chunk(
        'tool_result',
        {
          toolCallId: STRING,
          toolName: STRING,
          toolOutput: STRING,
          toolError: { type: 'boolean' },
        },
        ['toolCallId', 'toolName', 'toolOutput', 'toolError'],
        true,
      ),
      Chunk(
        'todo_update',
        { todos: { type: 'array', items: Ref('TodoItem') } },
        ['todos'],
      ),
      {
        allOf: [
          Ref('ChatTokenUsage'),
          Obj({ type: { type: 'string', enum: ['token_usage'] } }, ['type']),
        ],
      },
    ],
    discriminator: { propertyName: 'type' },
  },
  ListItem: Obj({ id: STRING, name: STRING, description: STRING }, [
    'id',
    'name',
  ]),
  ListEnabledItemsResponse: {
    type: 'array',
    items: {
      allOf: [
        Ref('ListItem'),
        Obj({ enabled: { type: 'boolean' } }, ['enabled']),
      ],
    },
  },
  ListAgentInstructionsResponse: {
    type: 'array',
    items: {
      allOf: [
        Ref('ChatInstructionOption'),
        Obj({ enabled: { type: 'boolean' } }, ['enabled']),
      ],
    },
  },
  ListMCPToolsResponse: {
    type: 'array',
    items: Obj(
      {
        id: STRING,
        title: STRING,
        description: STRING,
        enabled: { type: 'boolean' },
        icons: {
          type: 'array',
          items: Obj(
            {
              src: STRING,
              mimeType: STRING,
              sizes: { type: 'array', items: STRING },
              theme: { type: 'string', enum: ['dark', 'light'] },
            },
            ['src'],
          ),
        },
      },
      ['id', 'title', 'description', 'enabled'],
    ),
  },
  ListIDLLocationsResponse: { type: 'array', items: Ref('ListItem') },
};
