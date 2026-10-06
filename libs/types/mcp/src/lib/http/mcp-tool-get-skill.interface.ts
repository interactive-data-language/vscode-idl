/**
 * Get Skill
 */
export type MCPTool_GetSkill = 'get-skill';

/**
 * Parameters for Get Skill
 */
export interface MCPToolParams_GetSkill {
  /** The name of the skill to fetch */
  name: string;
}

/**
 * Response for Get Skill
 */
export type MCPToolResponse_GetSkill = string;
