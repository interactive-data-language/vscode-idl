import type {
  AvailableModelsRequest,
  AvailableModelsResponse,
  ChatInstructionsResponse,
  ChatMessageRequest,
  ChatStreamChunk,
  ExamplePromptsResponse,
} from '@idl/types/chat';
import type {
  MCPToolHTTPResponse,
  MCPToolParams,
  MCPToolParams_ParameterOverride,
  MCPTools,
  MCPTools_ParameterOverride,
} from '@idl/types/mcp';
import type { AxiosInstance } from 'axios';
import { createParser } from 'eventsource-parser';

import type {
  IAgentsServerClientOptions,
  IAgentsServerRequestOptions,
} from './agents-server-client.class.interface';

/**
 * Parses the body of an MCP HTTP response, which is either JSON or a
 * single server-sent event containing the JSON-RPC message
 */
function ParseMCPBody(body: string): any {
  const trimmed = body.trim();
  if (trimmed.startsWith('{')) {
    return JSON.parse(trimmed);
  }

  let message: any;
  createParser({
    onEvent: (event) => {
      message = JSON.parse(event.data);
    },
  }).feed(body);
  return message;
}

/**
 * Client for the REST API of the standalone IDL/ENVI agents server.
 *
 * Mirrors the routes in `libs/mcp/agents-server/src/lib/routes` and works in
 * Node and the browser because all requests go through the axios instance
 * that is provided.
 */
export class AgentsServerClient {
  /** Axios instance for all requests */
  readonly axios: AxiosInstance;

  /** Counter for JSON-RPC request IDs */
  private rpcID = 0;

  constructor(options: IAgentsServerClientOptions) {
    this.axios = options.axios;
    if (options.baseUrl !== undefined) {
      this.axios.defaults.baseURL = options.baseUrl;
    }
  }

  /**
   * POST /mcp
   *
   * Calls an MCP tool and returns the strictly-typed response. Tool-level
   * failures are returned (`isError`), protocol-level failures throw.
   */
  async callMCPTool<T extends MCPTools>(
    tool: T,
    params: T extends MCPTools_ParameterOverride
      ? MCPToolParams_ParameterOverride<T>
      : MCPToolParams<T>,
    options?: IAgentsServerRequestOptions,
  ): Promise<MCPToolHTTPResponse<T>> {
    const resp = await this.axios.post<string>(
      '/mcp',
      {
        jsonrpc: '2.0',
        id: ++this.rpcID,
        method: 'tools/call',
        params: { name: tool, arguments: params },
      },
      {
        responseType: 'text',
        transformResponse: (data) => data,
        signal: options?.signal,
        headers: { Accept: 'application/json, text/event-stream' },
      },
    );

    const message = ParseMCPBody(resp.data);
    if (message?.error) {
      throw new Error(
        `MCP error calling "${tool}": ${message.error.message ?? 'Unknown error'}`,
      );
    }
    if (!message?.result) {
      throw new Error(`MCP tool "${tool}" returned no result`);
    }
    return message.result as MCPToolHTTPResponse<T>;
  }

  /**
   * POST /api/chat/:sessionId/cancel
   *
   * Interrupts the in-flight turn, the session stays open for follow-up messages
   */
  async cancelSession(
    sessionId: string,
    options?: IAgentsServerRequestOptions,
  ): Promise<void> {
    await this.axios.post(
      `/api/chat/${encodeURIComponent(sessionId)}/cancel`,
      {},
      options,
    );
  }

  /**
   * GET /api/config
   */
  async getConfig<Config = Record<string, unknown>>(
    options?: IAgentsServerRequestOptions,
  ): Promise<Config> {
    return (await this.axios.get<Config>('/api/config', options)).data;
  }

  /**
   * GET /api/chat/example-prompts
   */
  async getExamplePrompts(
    options?: IAgentsServerRequestOptions,
  ): Promise<ExamplePromptsResponse> {
    return (
      await this.axios.get<ExamplePromptsResponse>(
        '/api/chat/example-prompts',
        options,
      )
    ).data;
  }

  /**
   * GET /api/chat/instructions
   */
  async getInstructions(
    options?: IAgentsServerRequestOptions,
  ): Promise<ChatInstructionsResponse> {
    return (
      await this.axios.get<ChatInstructionsResponse>(
        '/api/chat/instructions',
        options,
      )
    ).data;
  }

  /**
   * POST /api/chat/models
   */
  async getModels(
    request: AvailableModelsRequest = {},
    options?: IAgentsServerRequestOptions,
  ): Promise<AvailableModelsResponse> {
    return (
      await this.axios.post<AvailableModelsResponse>(
        '/api/chat/models',
        request,
        options,
      )
    ).data;
  }

  /**
   * POST /api/chat/message
   *
   * Streams the server's chunks, as-is, to `onChunk` and resolves when the
   * server closes the stream (it ends right after an `error` or `cancelled`
   * chunk, and the optional `title` chunk comes after `done`).
   *
   * Abort with `options.signal`; the server cancels the session when the
   * connection closes.
   */
  async postMessage(
    request: ChatMessageRequest,
    onChunk: (chunk: ChatStreamChunk) => void,
    options?: IAgentsServerRequestOptions,
  ): Promise<void> {
    // fetch adapter returns a web stream in both Node and the browser
    const resp = await this.axios.post<ReadableStream<Uint8Array>>(
      '/api/chat/message',
      request,
      {
        adapter: 'fetch',
        responseType: 'stream',
        signal: options?.signal,
        headers: { Accept: 'text/event-stream' },
      },
    );

    const parser = createParser({
      onEvent: (event) => onChunk(JSON.parse(event.data) as ChatStreamChunk),
    });

    const reader = resp.data.getReader();
    const decoder = new TextDecoder();
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        parser.feed(decoder.decode(value, { stream: true }));
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * PUT /api/config
   *
   * Merges the config into the server config and returns the result
   */
  async putConfig<Config = Record<string, unknown>>(
    config: Partial<Config>,
    options?: IAgentsServerRequestOptions,
  ): Promise<Config> {
    return (await this.axios.put<Config>('/api/config', config, options)).data;
  }
}
