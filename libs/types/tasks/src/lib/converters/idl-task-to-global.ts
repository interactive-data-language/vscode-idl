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
  IDLTask,
  IDLTaskParameter,
  IDLTaskSchema12,
  IDLTaskSchemaVersion,
} from '../idltask.interface';
import { IGlobalsToTrack } from '../task-to-global-token.interface';
import { TaskTypeToIDLType } from './task-type-to-idl-type';

/**
 * Converts an IDL Task to global tokens for auto-complete
 */
export function IDLTaskToGlobal(
  task: IDLTask<IDLTaskSchemaVersion>,
): IGlobalsToTrack {
  // make sure we have description
  task.description = task.description || '';

  /** Get the name of our task */
  const name = `IDL${task.name}Task`;

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
      inherits: ['idltask'], // lower-case
      docsLookup: {},
      props: {},
    },
  };

  // check if we have tags
  if (Array.isArray(task.tags)) {
    struct.meta.tags = task.tags;
  }

  // create properties
  const props: IPropertyLookup = {};
  for (let i = 0; i < task.parameters.length; i++) {
    const param = task.parameters[i];
    const propName = param.name.toLowerCase();
    const dir = (param.direction || 'input').toLowerCase();

    /** Create type metadata for URI specials */
    const meta: IDLDataTypeBaseMetadata = {};

    // set min
    if ((param as IDLTaskParameter<IDLTaskSchema12>)?.min !== undefined) {
      meta.min = (param as IDLTaskParameter<IDLTaskSchema12>)?.min;
    }

    // set max
    if ((param as IDLTaskParameter<IDLTaskSchema12>)?.max !== undefined) {
      meta.max = (param as IDLTaskParameter<IDLTaskSchema12>)?.max;
    }

    // set default
    if ((param as IDLTaskParameter<IDLTaskSchema12>)?.default !== undefined) {
      meta.default = (param as IDLTaskParameter<IDLTaskSchema12>)?.default;
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
      type: TaskTypeToIDLType(
        param.type,
        meta,
        param.choice_list,
        param.dimensions,
      ),
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
