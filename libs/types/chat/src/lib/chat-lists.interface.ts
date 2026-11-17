import type { ChatInstructionOption } from './chat-types.interface';

/**
 * Response for GET /api/config/list/instructions
 */
export type ListAgentInstructionsResponse =
  WithEnabled<ChatInstructionOption>[];

/**
 * Common shape for items returned from list routes
 */
export interface IListItem {
  /** Optional description */
  description?: string;
  /** Unique ID for the item */
  id: string;
  /** Display name */
  name: string;
}

/**
 * Adds whether an item is enabled (allowed by the current configuration)
 */
export type WithEnabled<T> = {
  /** True if the item is allowed by the current configuration filters */
  enabled: boolean;
} & T;

/**
 * Response for GET /api/config/list/agent-skills
 *
 * Skills with their descriptions
 */
export type ListAgentSkillsResponse = WithEnabled<IListItem>[];

/**
 * Response for GET /api/config/list/idl-locations
 *
 * Available IDL installs that match our version requirement, where the ID
 * and name are the install location
 */
export type ListIDLLocationsResponse = IListItem[];

/**
 * Details for a tool on the MCP server
 */
export interface IMCPToolListItem {
  /** Full description */
  description: string;
  /** Optional icons */
  icons?: {
    src: string;
    mimeType?: string;
    sizes?: string[];
    theme?: 'dark' | 'light';
  }[];
  /** Tool ID (the name it is registered with) */
  id: string;
  /** Display title */
  title: string;
}

/**
 * Response for GET /api/config/list/mcp-tools
 *
 * Details for the tools the MCP server has
 */
export type ListMCPToolsResponse = WithEnabled<IMCPToolListItem>[];

/**
 * Response for GET /api/config/list/envi-tools
 *
 * ENVI tools with their descriptions
 */
export type ListENVIToolsResponse = WithEnabled<IListItem>[];

/**
 * Response for GET /api/config/list/envi-tool-workflows
 *
 * ENVI tool workflows
 */
export type ListENVIToolWorkflowsResponse = WithEnabled<IListItem>[];
