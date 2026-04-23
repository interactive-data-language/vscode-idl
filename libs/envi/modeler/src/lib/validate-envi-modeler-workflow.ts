import { ITaskInformation, MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/envi/modeler';
import {
  IDL_NUMBER_TYPE_ORDER,
  IDL_TYPE_LOOKUP,
} from '@idl/types/idl-data-types';

import { BuildConnectionMap } from './helpers/build-connection-map';
import { ValidateNodeConnection } from './helpers/validate-node-connection';
import {
  DATAMANAGER_TYPE_TO_PARAMETER_MAP,
  SINK_TYPES,
  SOURCE_TYPES,
  VIEW_TYPE_TO_PARAMETER_MAP,
} from './validate-envi-modeler-workflow.interface';

/**
 * Validates the inputs for an ENVI Modeler node
 */
export function ValidateENVIModelerWorkflow(
  nodes: ENVIModelerNode[],
  edges: ENVIModelerEdge[],
  registry: MCPTaskRegistry,
): string[] {
  /** Create map for nodes */
  const nodeMap: { [key: string]: ENVIModelerNode } = {};
  for (let i = 0; i < nodes.length; i++) {
    nodeMap[nodes[i].id] = nodes[i];
  }

  /** Track validation errors */
  const errors: string[] = [];

  // validate task nodes
  for (const node of nodes) {
    // validate based on type
    switch (node.type) {
      case 'task':
        // make sure there is a name
        if (node.task_name) {
          /** Get task information and validate a bit */
          const info = registry.getTaskDetail(node.task_name);

          // verify that we have a known task
          if (!info) {
            errors.push(
              `Node "${node.id}" references an unknown task "${node.task_name}"`,
            );
            continue;
          }

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

  /** Flag if we need to skip */
  let edgeProblem = false;

  /**
   * Validate all of our edges
   */
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    // verify that we have correct IDs for connections
    if (!(edge.from in nodeMap)) {
      errors.push(
        `Edge ${i} (zero-based) references unknown source node id "${edge.from}"`,
      );
      edgeProblem = true;
    }
    if (!(edge.to in nodeMap)) {
      errors.push(
        `Edge ${i} (zero-based) references unknown target node id "${edge.to}"`,
      );
      edgeProblem = true;
    }

    // skip if bad node references
    if (edgeProblem) {
      continue;
    }

    // extract nodes
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];

    // verify we arent coming from a sink
    if (SINK_TYPES.has(from.type)) {
      errors.push(
        `Node "${edge.from}" (type "${from.type}") is a sink-only node and cannot be an edge source`,
      );
    }

    // verify type we arent going to a source
    if (SOURCE_TYPES.has(to.type)) {
      errors.push(
        `Node "${edge.to}" (type "${to.type}") is a source-only node and cannot be an edge target`,
      );
    }

    /** Task info for our from node */
    let fromInfo: ITaskInformation | undefined;

    /** Errors for from parameters */
    const fromErrs: string[] = [];

    /** Track if we encounter unknown parameters */
    let unknownParams = false;

    /**
     * Validate from task parameters
     */
    if (from.type === 'task') {
      // make sure we have a task name
      if (from.task_name) {
        fromInfo = registry.getTaskDetail(from.task_name);
      }

      // make sure we have info
      if (fromInfo) {
        // validate from parameters
        for (let j = 0; j < edge.from_parameters.length; j++) {
          const fromParam = edge.from_parameters[j];
          const fromProp =
            fromInfo.structure.meta.props[fromParam.toLowerCase()];

          // make sure it is a real parameter we are coming from
          if (!fromProp) {
            fromErrs.push(
              `  "${fromParam}" is not a known parameter of "${from.task_name}"`,
            );
            unknownParams = true;
            continue;
          }

          // make sure output
          if (!(fromProp.direction === 'out')) {
            fromErrs.push(
              `  "${fromParam}" is not an output parameter and cannot be connected`,
            );
          }
        }
      }
    }

    /** Task info for our to node */
    let toInfo: ITaskInformation | undefined;

    // track to errors
    const toErrors: string[] = [];

    /**
     * Validate to task parameters
     */
    if (to.type === 'task') {
      // make sure we have a task name
      if (to.task_name) {
        toInfo = registry.getTaskDetail(to.task_name);
      }

      // make sure we have info
      if (toInfo) {
        // validate ti parameters
        for (let j = 0; j < edge.to_parameters.length; j++) {
          const toParam = edge.to_parameters[j];
          const toProp = toInfo.structure.meta.props[toParam.toLowerCase()];

          // make sure it is a real parameter we are coming from
          if (!toProp) {
            toErrors.push(
              `  "${toParam}" is not a known parameter of "${to.task_name}"`,
            );
            unknownParams = true;
            continue;
          }

          // make sure output
          if (!(toProp.direction === 'in')) {
            toErrors.push(
              `  "${toParam}" is not an input parameter and cannot be connected`,
            );
          }
        }
      }
    }

    /**
     * Determine how to proceed
     */
    if (!unknownParams) {
      switch (true) {
        case !!toInfo && !!fromInfo:
          ValidateNodeConnection(edge, toInfo, fromInfo, fromErrs);
          break;
        case !!fromInfo && to.type === 'datamanager':
          /**
           * Validate the connected parameter is of type: ENVIRaster, ENVIVector, ENVIRasterSeries, ENVIAnnotationSet
           *
           * The datamanager node automatically infers the correct input parameter name based on the type:
           * - ENVIRaster -> input_raster
           * - ENVIVector -> input_vector
           * - ENVIRasterSeries -> input_raster_series
           * - ENVIAnnotationSet -> input_annotation_set
           */

          /** Clear to_parameters and rebuild based on types */
          edge.to_parameters = [];

          for (let z = 0; z < edge.from_parameters.length; z++) {
            const fromParam = edge.from_parameters[z];
            const fromProp =
              fromInfo.structure.meta.props[fromParam.toLowerCase()];

            // get the type (handle arrays by extracting element type)
            let typeToCheck = fromProp.type;

            // check for array
            if (IDLTypeHelper.isType(fromProp.type, IDL_TYPE_LOOKUP.ARRAY)) {
              typeToCheck = IDLTypeHelper.getAllTypeArgs(fromProp.type);
            }

            // get the type name
            const typeName = typeToCheck[0].name.toLowerCase();

            // check if type is allowed
            if (typeName in DATAMANAGER_TYPE_TO_PARAMETER_MAP) {
              // add the mapped parameter name
              edge.to_parameters.push(
                DATAMANAGER_TYPE_TO_PARAMETER_MAP[typeName],
              );
            } else {
              fromErrs.push(
                `  "${fromParam}" has type "${typeToCheck[0].name}" and cannot be connected to datamanager; expected ENVIRaster, ENVIVector, ENVIRasterSeries, or ENVIAnnotationSet`,
              );
            }
          }
          break;
        case !!fromInfo && to.type === 'view':
          /**
           * Validate the connected parameter is of type: ENVIRaster, ENVIVector, ENVIRasterSeries, ENVIAnnotationSet, ENVIPointCloud, String, Number
           *
           * Number types are promoted (any numeric type is acceptable).
           * The view node automatically infers the correct input parameter name based on the type:
           * - ENVIRaster -> input_raster
           * - ENVIVector -> input_vector
           * - ENVIRasterSeries -> input_raster_series
           * - ENVIAnnotationSet -> input_annotation_set
           * - ENVIPointCloud -> input_point_cloud
           * - String -> input_string
           * - Number (Byte, Int, Long, Float, Double, etc.) -> input_number
           */

          /** Clear to_parameters and rebuild based on types */
          edge.to_parameters = [];

          for (let z = 0; z < edge.from_parameters.length; z++) {
            const fromParam = edge.from_parameters[z];
            const fromProp =
              fromInfo.structure.meta.props[fromParam.toLowerCase()];

            // get the type (handle arrays by extracting element type)
            let typeToCheck = fromProp.type;

            // check for array
            if (IDLTypeHelper.isType(fromProp.type, IDL_TYPE_LOOKUP.ARRAY)) {
              typeToCheck = IDLTypeHelper.getAllTypeArgs(fromProp.type);
            }

            // get the type name
            const typeName = typeToCheck[0].name.toLowerCase();

            // check if it's a number type
            const isNumber = typeToCheck[0].name in IDL_NUMBER_TYPE_ORDER;

            switch (true) {
              case typeName in VIEW_TYPE_TO_PARAMETER_MAP:
                edge.to_parameters.push(VIEW_TYPE_TO_PARAMETER_MAP[typeName]);
                break;
              case isNumber:
                edge.to_parameters.push('input_number');
                break;
              default:
                fromErrs.push(
                  `  "${fromParam}" has type "${typeToCheck[0].name}" and cannot be connected to view; expected ENVIRaster, ENVIVector, ENVIRasterSeries, ENVIAnnotationSet, ENVIPointCloud, String, or Number`,
                );
                break;
            }
          }
          break;
        default:
          break;
      }
    }

    // format errors
    if (fromErrs.length > 0) {
      errors.push(
        `The "from_parameters" property on edge node ${i} (zero-based) has problems that need resolved:`,
      );
      errors.push(...fromErrs);
    }

    // format errors
    if (toErrors.length > 0) {
      errors.push(
        `The "to_parameters" property on edge node ${i} (zero-based) has problems that need resolved:`,
      );
      errors.push(...toErrors);
    }
  }

  // return if edge problems
  if (edgeProblem) {
    return errors;
  }

  /**
   * Build connection map to validate array-based input parameters
   */
  const map = BuildConnectionMap(nodes, edges);

  // get IDs
  const ids = Object.keys(map);

  /**
   * Validate array connections that we will automatically add aggregators to so
   * so that we actually have arrays
   */
  for (let i = 0; i < ids.length; i++) {
    // skip if not a task
    if (nodeMap[ids[i]]?.type !== 'task') {
      continue;
    }

    // get parameter names to verify
    const byParam = map[ids[i]];

    // get parameters
    const params = Object.keys(byParam);

    // process each parameter
    for (let j = 0; j < params.length; j++) {
      const param = params[j];
      const connections = byParam[param];

      // check for multiple connections
      if (connections.length > 1) {
        const info = registry.getTaskDetail(nodeMap[ids[i]]?.task_name || '');
        if (info) {
          // check if unknown parameter
          if (!(param in info.structure.meta.props)) {
            continue;
          }

          if (
            !IDLTypeHelper.isType(
              info.structure.meta.props[param].type,
              IDL_TYPE_LOOKUP.ARRAY,
            )
          ) {
            errors.push(
              `The node "${ids[i]}" has multiple inputs for the task the parameter "${param}", but this parameter is not an array type and does not accept multiple inputs`,
            );
          }
        }
      }
    }
  }

  return errors;
}
