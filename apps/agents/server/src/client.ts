/**
 * Public client of the `@idl/agents-server` package, available to consumers
 * as `@idl/agents-server/client`.
 *
 * Works in Node and the browser: all requests go through an axios instance
 * that the caller provides.
 *
 * The client is built by tools/node/build-agents-server-client.js, which is
 * called by `npm run package-agents-server`
 */

export type {
  IAgentsServerClientOptions,
  IAgentsServerRequestOptions,
} from '@idl/mcp/agents-server-client';
export { AgentsServerClient } from '@idl/mcp/agents-server-client';
