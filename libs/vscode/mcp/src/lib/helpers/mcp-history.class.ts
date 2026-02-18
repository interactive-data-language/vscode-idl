import { MCPToolParams, MCPTools } from '@idl/types/mcp';

/**
 * Data structure for a history item
 */
type MCPToolHistoryItem<T extends MCPTools> = {
  tool: T;
  params: MCPToolParams<T>;
};

/**
 * Helper class to track history for MCP tools
 *
 * Used for test harness
 */
export class MCPHistory {
  /** Past tool runs */
  private history: MCPToolHistoryItem<MCPTools>[] = [];

  /** Max history we save */
  private maxHistory = 100;

  /**
   * Track a tool run
   */
  add<T extends MCPTools>(tool: T, params: MCPToolParams<T>) {
    // save in history
    this.history.push({ tool, params });

    // remove if too many items
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Buckets our history by names of tools that were called
   */
  bucket() {
    /**
     * Init resp
     */
    const resp: { [T in MCPTools]?: MCPToolParams<T>[] } = {};

    // populate
    for (let i = 0; i < this.history.length; i++) {
      // add key
      if (!(this.history[i].tool in resp)) {
        resp[this.history[i].tool] = [];
      }

      // save
      resp[this.history[i].tool].push(this.history[i].params as any);
    }

    return resp;
  }

  /**
   * Gets ENVI tools that we ran
   */
  getHistory<T extends MCPTools>(tool: T): MCPToolParams<T>[] {
    return this.history
      .filter((item) => item.tool === tool)
      .map((item) => item.params as MCPToolParams<T>);
  }

  /**
   * Reset the history
   */
  reset() {
    this.history = [];
  }
}
