import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';

import {
  SINK_TYPES,
  SOURCE_TYPES,
} from './validate-envi-modeler-nodes.interface';

/**
 * Validates the inputs for an ENVI Modeler node
 */
export function ValidateENVIModelerNodes(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
  registry: MCPTaskRegistry,
): string[] {
  // ---- validate edges reference valid node ids and obey source/sink rules
  const nodeIds = new Set(nodes.map((n) => n.id));
  const nodeTypeById = new Map(nodes.map((n) => [n.id, n.type]));

  /** Track validation errors */
  const errors: string[] = [];

  // validate task nodes
  for (const node of nodes) {
    // validate based on type
    switch (node.type) {
      case 'task':
        // make sure there is a name
        if (node.task_name) {
          // make sure it is a known task
          if (!registry.hasTask(node.task_name)) {
            errors.push(
              `Node "${node.id}" references an unknown task "${node.task_name}"`,
            );
          }

          /** Get task information and validate a bit */
          const info = registry.getTaskDetail(node.task_name);

          // validate input parameters
          for (const param of Object.keys(node.static_input || {})) {
            if (!(param.toLowerCase() in info.structure.meta.props)) {
              errors.push(
                `Node "${node.id}" has an unknown input parameter of "${param}"`,
              );
            }
          }
        } else {
          errors.push(`Node "${node.id}" is a task but is missing a task name`);
        }
        break;

      default:
        break;
    }
  }

  // check each edge
  for (const edge of edges) {
    if (!nodeIds.has(edge.from)) {
      errors.push(`Edge references unknown source node id "${edge.from}"`);
    }
    if (!nodeIds.has(edge.to)) {
      errors.push(`Edge references unknown target node id "${edge.to}"`);
    }

    const fromType = nodeTypeById.get(edge.from);
    if (fromType && SINK_TYPES.has(fromType)) {
      errors.push(
        `Node "${edge.from}" (type "${fromType}") is a sink-only node and cannot be an edge source`,
      );
    }
    if (fromType === 'aggregator') {
      edge.from_parameters = ['output'];
    }

    const toType = nodeTypeById.get(edge.to);
    if (toType && SOURCE_TYPES.has(toType)) {
      errors.push(
        `Node "${edge.to}" (type "${toType}") is a source-only node and cannot be an edge target`,
      );
    }
  }

  return errors;
}
