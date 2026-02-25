/**
 * List Prompts
 */
export type MCPTool_ListPrompts = 'list-prompts';

/**
 * Parameters for List Prompts
 */
export interface MCPToolParams_ListPrompts {
  /**
   * Category to filter prompts by: 'ENVI', 'IDL', or 'ALL'
   */
  filter?: 'all' | 'envi' | 'idl';
}
