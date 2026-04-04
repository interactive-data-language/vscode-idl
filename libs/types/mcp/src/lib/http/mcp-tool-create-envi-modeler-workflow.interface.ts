import {
  ENVIModelerEdge,
  ENVIModelerInputParameter,
  ENVIModelerNode,
} from '@idl/types/envi/modeler';

export { ENVIModelerEdge, ENVIModelerInputParameter, ENVIModelerNode };

/**
 * Create ENVI Modeler Workflow
 */
export type MCPTool_CreateENVIModelerWorkflow = 'create-envi-modeler-workflow';

/**
 * Parameters for Create ENVI Modeler Workflow
 *
 * Builds an ENVI Modeler `.model` file from a simplified node and edge
 * description.  Node positions are computed automatically.
 *
 * ## Critical usage rules
 * - Task names MUST come from the 'list-envi-tools' MCP tool.
 * - Task parameter names MUST come from 'get-envi-tool-parameters'.
 * - Only include parameters in `static_input` that differ from their
 *   defaults — omitting default-valued parameters keeps workflows clean.
 * - Every edge's `from` and `to` values must match an `id` in the nodes
 *   array.
 */
export interface MCPToolParams_CreateENVIModelerWorkflow {
  /**
   * Array of directed edges that connect node outputs to node inputs.
   */
  edges: ENVIModelerEdge[];
  /**
   * Ordered array of nodes that make up the workflow graph.
   * Nodes are laid out left-to-right in the order they appear here.
   */
  nodes: ENVIModelerNode[];
  /**
   * Fully qualified output file path.  Should end in ".model".
   * Example: "C:/Users/me/Documents/my-workflow.model"
   */
  output_path: string;
}
