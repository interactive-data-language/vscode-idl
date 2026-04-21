import { ITaskInformation } from '@idl/mcp/tasks';
import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { IDL_TYPE_LOOKUP } from '@idl/types/idl-data-types';
import { ENVIModelerEdge } from '@idl/types/mcp';

import { ValidateTypes } from './validate-types';

/**
 * Validates a node connection
 *
 * Assumes that the connection is *valid* and we have a
 * source and sink node
 *
 * All errors are reported as "from" problems
 */
export function ValidateNodeConnection(
  edge: ENVIModelerEdge,
  toInfo: ITaskInformation,
  fromInfo: ITaskInformation,
  fromErrs: string[],
) {
  switch (true) {
    /**
     * Same number of input and output to match 1:1
     */
    case edge.from_parameters.length === edge.to_parameters.length:
      for (let z = 0; z < edge.from_parameters.length; z++) {
        // extract what we connect from
        const fromName = edge.from_parameters[z];
        const fromProp = fromInfo.structure.meta.props[fromName.toLowerCase()];

        // extract what we connect to
        const toName = edge.to_parameters[z];
        const toProp = toInfo.structure.meta.props[toName.toLowerCase()];

        // validate the types
        ValidateTypes(fromName, fromProp.type, toName, toProp.type, fromErrs);
      }
      break;

    /**
     * Multiple input parameters connected at once
     *
     * These will have an aggregator automatically connected, but we need to check the type
     */
    case edge.from_parameters.length > 1 && edge.to_parameters.length === 1: {
      const toName = edge.to_parameters[0];
      const toProp = toInfo.structure.meta.props[toName.toLowerCase()];

      // make sure it is an array type
      if (!IDLTypeHelper.isType(toProp.type, IDL_TYPE_LOOKUP.ARRAY)) {
        fromErrs.push(
          `  Connected parameter "${toName}" is not an array parameter and cannot be connected`,
        );
        return;
      }

      /**
       * Get the type of the array
       */
      const typeArgs = IDLTypeHelper.getAllTypeArgs(toProp.type);

      // validate all connections are matching type args
      for (let z = 0; z < edge.from_parameters.length; z++) {
        const fromName = edge.from_parameters[z];
        const fromProp = fromInfo.structure.meta.props[fromName.toLowerCase()];

        // validate the types
        ValidateTypes(fromName, fromProp.type, toName, typeArgs, fromErrs);
      }
      break;
    }
    default:
      break;
  }
}
