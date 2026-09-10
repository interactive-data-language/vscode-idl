/**
 * Type of data that an Agent Workflow Template is related to
 */
export type WorkflowTemplateDataTag = 'DSM' | 'EO' | 'LiDAR' | 'SAR';

/**
 * A workflow template that describes a repeatable multi-step process that
 * starts with data discovery
 */
export interface AgentWorkflowTemplate {
  /** Description of what the template is for */
  description: string;
  /** Unique identifier for the template */
  id: string;
  /** Display name of the template */
  name: string;
  /** Placeholder prompt text sent to the LLM as a starting point */
  promptPlaceholder: string;
  /** Types of data this template is related to */
  tags: WorkflowTemplateDataTag[];
  /** Name of an automated tool workflow to reference, if any */
  toolWorkflowName?: string;
}

/**
 * Response for GET /api/workflow-templates
 */
export interface WorkflowTemplatesResponse {
  /** Available Agent Workflow Templates */
  templates: AgentWorkflowTemplate[];
}

/**
 * Response for GET /api/workflow-templates/tool-workflows
 */
export interface ToolWorkflowNamesResponse {
  /** Names of known automated tool workflows */
  names: string[];
}
