import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp';
import { ZodRawShape } from 'zod';

/**
 * Callback that adds a new argument to each function so that
 * we have an ID we can send/receive progress messages on
 */
export type MCPRegistryToolCallback<Args extends ZodRawShape> =
  ToolCallback<Args> extends (...a: infer U) => infer R
    ? (id: string, ...a: U) => R
    : never;
