import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionToken,
  GlobalStructureToken,
  IDLDataTypeBaseMetadata,
  IGlobalIndexedToken,
  IPropertyLookup,
} from '@idl/types/idl-data-types';

import {
  ENVITask,
  ENVITaskParameter,
  ENVITaskSchema32,
  ENVITaskSchemaVersion,
} from '../envitask.interface';
import { IGlobalsToTrack } from '../task-to-global-token.interface';
import { TaskTypeToIDLType } from './task-type-to-idl-type';

/**
 * Converts an ENVI Task to global tokens for auto-complete
 */
export function ENVITaskToGlobal(
  task: ENVITask<ENVITaskSchemaVersion>
): IGlobalsToTrack {
  /** Get the name of our task */
  const name = `ENVI${task.name}Task`;

  /** Lower-case name */
  const useName = name.toLowerCase();

  /** Structure */
  const struct: IGlobalIndexedToken<GlobalStructureToken> = {
    type: GLOBAL_TOKEN_TYPES.STRUCTURE,
    name: useName,
    pos: [0, 0, 0],
    meta: {
      display: name,
      source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
      docs: task.description,
      private: false,
      inherits: ['envitask'], // lower-case
      docsLookup: {},
      props: {},
    },
  };

  // create properties
  const props: IPropertyLookup = {};
  for (let i = 0; i < task.parameters.length; i++) {
    const param = task.parameters[i];
    const propName = param.name.toLowerCase();
    const dir = (param.direction || 'input').toLowerCase();

    /**
     * Don't parse dag types
     */
    if (
      param.type.toLowerCase() === 'dag' ||
      param.type.toLowerCase() === 'envimetataskdag'
    ) {
      continue;
    }

    /** Create type metadata for URI specials */
    const meta: IDLDataTypeBaseMetadata = {};

    // set folder - note that URI is automatically detected in the `TaskTypeToIDlType` function
    if ((param as ENVITaskParameter<ENVITaskSchema32>)?.is_directory) {
      meta.isFolder = true;
    }

    // save our property
    props[propName] = {
      source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
      code: true,
      pos: [0, 0, 0],
      direction: dir === 'input' ? 'in' : 'out',
      private: param.hidden ? true : false,
      display: task.parameters[i].name.toLowerCase(),
      docs: param.description || '',
      type: TaskTypeToIDLType(param.type, meta, param.choice_list),
      req: param.required,
    };
  }

  // save properties
  struct.meta.props = props;

  /** Function */
  const func: IGlobalIndexedToken<GlobalFunctionToken> = {
    type: GLOBAL_TOKEN_TYPES.FUNCTION,
    name: useName,
    pos: [0, 0, 0],
    meta: {
      display: name,
      source: GLOBAL_TOKEN_SOURCE_LOOKUP.USER,
      docs: task.description,
      private: false,
      returns: IDLTypeHelper.parseIDLType(useName),
      args: {},
      kws: {},
      docsLookup: {},
      struct: [],
    },
  };

  return {
    function: func,
    structure: struct,
  };
}
