import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';
import { IDL_TYPE_LOOKUP } from '@idl/types/idl-data-types';

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

  // Validate that task input parameters receiving multiple edges are array-typed.
  // When a parameter has 2+ incoming edges, InjectAggregatorNodes will insert an
  // aggregator — but only if the target parameter actually accepts an array.
  const inputEdgeCount = new Map<string, number>();

  for (const edge of edges) {
    if (nodeTypeById.get(edge.to) !== 'task') {
      continue;
    }

    if (edge.to_parameters.length === 0 || edge.to_parameters[0] === '') {
      continue;
    }

    const key = `${edge.to}::${edge.to_parameters.join(',')}`;
    inputEdgeCount.set(key, (inputEdgeCount.get(key) ?? 0) + 1);
  }

  for (const [key, count] of inputEdgeCount) {
    if (count <= 1) {
      continue;
    }

    const separatorIdx = key.indexOf('::');
    const toId = key.slice(0, separatorIdx);
    const paramName = key.slice(separatorIdx + 2);

    const toNode = nodes.find((n) => n.id === toId);
    if (!toNode || toNode.type !== 'task' || !toNode.task_name) {
      continue;
    }

    if (!registry.hasTask(toNode.task_name)) {
      continue;
    }

    const info = registry.getTaskDetail(toNode.task_name);
    const prop = info.structure.meta.props[paramName.toLowerCase()];

    if (!prop) {
      continue;
    }

    if (!IDLTypeHelper.isType(prop.type, IDL_TYPE_LOOKUP.ARRAY)) {
      errors.push(
        `Node "${toId}" parameter "${paramName}" receives ${count} edges but is not an array type; aggregator injection is not valid`,
      );
    }
  }

  return errors;
}
