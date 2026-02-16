/**
 * Get Prompt
 */
export type MCPTool_GetPrompt = 'get-prompt';

/**
 * Parameters for Get Prompt
 */
export interface MCPToolParams_GetPrompt {
  /**
   * The names of the prompts to fetch
   */
  names: string[];
}
