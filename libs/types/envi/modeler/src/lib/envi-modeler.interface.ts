/**
 * A single input parameter definition exposed in an inputparameters node
 */
export interface ENVIModelerInputParameter {
  /** Description shown to users at runtime */
  description?: string;
  /** Human-readable display name shown to users */
  display_name?: string;
  /** Parameter identifier (uppercase recommended, e.g. INPUT_RASTER) */
  name: string;
  /** ENVI parameter type (e.g. ENVIRASTER, ENVIRASTERARRAY, STRING, DOUBLE, ENVIROIARRAY, ENVIVIRTUALIZABLEURI) */
  type: string;
}

/**
 * A node in the ENVI Modeler workflow graph.
 *
 * Node types and what extra fields they use:
 * - task            → task_name (required), revision?, static_input?
 * - inputparameters → parameters (required)
 * - outputparameters → (no extra fields)
 * - iterator        → (no extra fields)
 * - aggregator      → extract? (default 1)
 * - arrayvalues     → value (required), data_type? (default "String")
 * - view            → (no extra fields)
 * - datamanager     → (no extra fields)
 * - comment         → display_name (required)
 * - propertyextractor → (no extra fields)
 * - arrayextractor  → indices (required)
 */
export interface ENVIModelerNode {
  /**
   * For type='arrayvalues': data type of the values.
   * Examples: "String", "Integer", "Unsigned Integer", "Float", "Double"
   */
  data_type?: string;
  /**
   * Human-readable display name for this node.
   * Auto-generated from task_name if omitted for task nodes.
   */
  display_name?: string;
  /**
   * For type='aggregator': number of items to extract when closing the
   * iterator loop. Default is 1.
   */
  extract?: number;
  /**
   * User-defined identifier used to reference this node in edges.
   * Must be unique within the workflow.
   */
  id: string;
  /**
   * For type='arrayextractor': zero-based indices of the elements to extract.
   */
  indices?: number[];
  /**
   * For type='inputparameters': parameters exposed to the user at runtime.
   */
  parameters?: ENVIModelerInputParameter[];
  /**
   * ENVI Task revision string (e.g. "1.0.0").
   * Omit to use latest.
   */
  revision?: string;
  /**
   * Static (hardcoded) input parameters for type='task'.
   * Only include parameters that differ from their defaults.
   * Get parameter names and defaults from 'get-envi-tool-parameters'.
   */
  static_input?: Record<string, unknown>;
  /**
   * ENVI Task name for type='task' or type='arrayextractor'.
   * Get valid task names from 'list-envi-tools'.
   */
  task_name?: string;
  /** Node type */
  type:
    | 'aggregator'
    | 'arrayextractor'
    | 'arrayvalues'
    | 'comment'
    | 'datamanager'
    | 'inputparameters'
    | 'iterator'
    | 'outputparameters'
    | 'propertyextractor'
    | 'task'
    | 'view';
  /**
   * For type='arrayvalues': the literal values in the array.
   */
  value?: unknown[];
}

/**
 * A directed edge connecting two nodes in the ENVI Modeler workflow.
 *
 * To connect non-parameter ports (e.g. iterator → task, or task → aggregator),
 * use `[""]` for both from_parameters and to_parameters.
 */
export interface ENVIModelerEdge {
  /** The id of the source node (matches ENVIModelerNode.id) */
  from: string;
  /**
   * The output parameter names on the source node to connect.
   * Use [""] for nodes whose connection carries no named parameter
   * (e.g. arrayvalues → iterator, iterator → task port, task → aggregator).
   */
  from_parameters: string[];
  /** The id of the target node (matches ENVIModelerNode.id) */
  to: string;
  /**
   * The input parameter names on the target node to connect.
   * Use [""] for nodes whose connection carries no named parameter.
   */
  to_parameters: string[];
}
