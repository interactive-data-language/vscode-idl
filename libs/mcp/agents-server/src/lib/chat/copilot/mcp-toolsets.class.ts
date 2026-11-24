import type { SessionEvent } from '@github/copilot-sdk';
import { SimplePromiseQueue } from '@idl/shared/extension';

import {
  COPILOT_ALLOWED_TOOLS,
  IDL_MCP_NAME,
} from './copilot-chat-framework.interface';
import {
  type IMCPToolsetLoadResult,
  LOAD_TOOLSET_NAME,
  LOAD_TOOLSET_PARAMETERS,
  MCP_CORE_TOOLS,
  MCP_TOOLSETS,
  type MCPToolsetName,
} from './mcp-toolsets.interface';

/**
 * Tracks deferred MCP tools for one conversation without changing the shared server.
 */
export class CopilotMCPToolsets {
  /** MCP tools permitted by the server's existing whitelist and blacklist. */
  private readonly allowedTools: ReadonlySet<string>;
  /** Optional groups successfully exposed to this conversation. */
  private loadedToolsets = new Set<MCPToolsetName>();
  /** Serialize filter updates so concurrent loads cannot overwrite each other. */
  private readonly loadQueue = new SimplePromiseQueue();

  constructor(allowedTools: readonly string[]) {
    this.allowedTools = new Set(allowedTools);
  }

  /** Get the source-qualified filter used for session creation and resumption. */
  getAvailableTools(): string[] {
    return this.buildAvailableTools(this.loadedToolsets);
  }

  /** Expose a group and its dependencies, committing state only after the SDK accepts it. */
  async load(
    toolset: string,
    updateTools: (availableTools: string[]) => Promise<void>,
  ): Promise<IMCPToolsetLoadResult> {
    const name = LOAD_TOOLSET_PARAMETERS.shape.toolset.parse(toolset);
    const requested = new Set<MCPToolsetName>();
    this.addDependencies(name, requested);

    for (const group of requested) {
      if (
        !MCP_TOOLSETS[group].tools.some((tool) => this.allowedTools.has(tool))
      ) {
        throw new Error(
          `Toolset "${group}" has no tools enabled by the server's MCP tool policy.`,
        );
      }
    }

    await this.loadQueue.add(async () => {
      const next = new Set([...this.loadedToolsets, ...requested]);
      if (next.size !== this.loadedToolsets.size) {
        await updateTools(this.buildAvailableTools(next));
        this.loadedToolsets = next;
      }
    });

    const tools = [...requested].flatMap((group) => MCP_TOOLSETS[group].tools);
    return {
      loadedToolsets: ['core', ...this.loadedToolsets],
      tools: tools
        .filter((tool) => this.allowedTools.has(tool))
        .map((tool) => `${IDL_MCP_NAME}-${tool}`),
      unavailableTools: tools.filter((tool) => !this.allowedTools.has(tool)),
    };
  }

  /** Restore successful loads from the SDK journal after eviction or a server restart. */
  restore(events: readonly SessionEvent[]): void {
    const pending = new Map<string, MCPToolsetName>();
    for (const event of events) {
      if (event.agentId !== undefined) {
        continue;
      }
      if (
        event.type === 'tool.execution_start' &&
        event.data.toolName === LOAD_TOOLSET_NAME
      ) {
        const params = LOAD_TOOLSET_PARAMETERS.safeParse(event.data.arguments);
        if (params.success) {
          pending.set(event.data.toolCallId, params.data.toolset);
        }
      } else if (event.type === 'tool.execution_complete') {
        const name = pending.get(event.data.toolCallId);
        pending.delete(event.data.toolCallId);
        if (event.data.success && name !== undefined) {
          this.addDependencies(name, this.loadedToolsets);
        }
      }
    }
  }

  /** Resolve dependencies before the requested group. */
  private addDependencies(
    name: MCPToolsetName,
    groups: Set<MCPToolsetName>,
  ): void {
    if (groups.has(name)) {
      return;
    }
    for (const dependency of MCP_TOOLSETS[name].dependencies) {
      this.addDependencies(dependency, groups);
    }
    groups.add(name);
  }

  /** Keep deferred MCP schemas out of model requests while preserving custom and built-in tools. */
  private buildAvailableTools(groups: ReadonlySet<MCPToolsetName>): string[] {
    const tools = new Set([
      ...MCP_CORE_TOOLS,
      ...[...groups].flatMap((group) => MCP_TOOLSETS[group].tools),
    ]);

    return [
      ...COPILOT_ALLOWED_TOOLS.map((tool) => `builtin:${tool}`),
      'custom:*',
      ...[...tools]
        .filter((tool) => this.allowedTools.has(tool))
        .map((tool) => `mcp:${IDL_MCP_NAME}-${tool}`),
    ];
  }
}
