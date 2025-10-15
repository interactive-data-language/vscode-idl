import { IMCPToolProgress } from '@idl/types/mcp';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import {
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types';
import { nanoid } from 'nanoid';

/**
 * Tracks the context for running MCP tools so that we can send progress notifications
 * during tool executions
 */
export class MCPToolContext {
  /** Contexts that we are handling */
  contexts: {
    [key: string]: RequestHandlerExtra<ServerRequest, ServerNotification>;
  } = {};

  /**
   * Registers context and returns an ID for the context
   */
  registerContext(
    context: RequestHandlerExtra<ServerRequest, ServerNotification>
  ) {
    const id = nanoid();

    // save
    this.contexts[id] = context;

    return id;
  }

  /**
   * Remove a context for a running tool
   */
  removeContext(id: string) {
    if (id in this.contexts) {
      delete this.contexts[id];
    }
  }

  /**
   * For a given context ID, sends a notification to the agent
   * we are interacting with
   */
  sendNotification(id: string, progress: IMCPToolProgress) {
    if (id in this.contexts) {
      this.contexts[id].sendNotification({
        method: 'notifications/message',
        params: {
          level: 'info',
          data: progress,
        },
      });
    }
  }
}
