import type { ChatInstructionOption } from './chat-types.interface';

/**
 * Response for GET /api/config/list/instructions
 */
export type ListAgentInstructionsResponse = ChatInstructionOption[];

/**
 * Response for GET /api/config/list/skills
 *
 * Skill names and their descriptions
 */
export type ListAgentSkillsResponse = { [name: string]: string };

/**
 * Response for GET /api/config/list/idl-installs
 *
 * Available IDL versions that match our version requirement
 */
export type ListIDLLocationsResponse = string[];

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
export type ListMCPToolsResponse = IMCPToolListItem[];

/**
 * Response for GET /api/config/list/envi-tools
 *
 * ENVI tool display names and their descriptions
 */
export type ListENVIToolsResponse = { [displayName: string]: string };

/**
 * Response for GET /api/config/list/envi-tool-workflows
 *
 * Names of ENVI tool workflows
 */
export type ListENVIToolWorkflowsResponse = string[];
