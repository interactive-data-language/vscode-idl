import { IDL_TYPE_LOOKUP, IDLDataType } from '@idl/types/idl-data-types';

import { NormalizeTypeName } from './normalize-type-name';
import { PostProcessTypeName, TASK_NAME_REGEX } from './post-process-type-name';

/**
 * Normalize names of our types for name, display name, and create
 * the serialized versions of the types
 */
export function PopulateTypeProperties(types: IDLDataType, isTask = false) {
  // do any post-processing for types
  PostProcessTypeName(types);

  // process each type
  for (let z = 0; z < types.length; z++) {
    // get our type
    const zType = types[z];

    /** Initialize display name */
    let base = zType.name;

    // normalize our name
    zType.name = NormalizeTypeName(zType.name);

    /** Track if we are a task */
    let iIsTask = false;

    // check if we have a task
    if (TASK_NAME_REGEX.test(base)) {
      iIsTask = true;
      if (base.toLowerCase().startsWith('envi')) {
        base = 'ENVITask';
      } else {
        base = 'IDLTask';
      }
    } else {
      /**
       * If we are not a task, make our name lower case
       *
       * This flag will be set when we are a type arg during recursion
       * and helps make the display name cleaner for tasks that we may
       * parse, but don't know about
       */
      if (!isTask) {
        base = zType.name;
      }
    }

    /** Initialize literal display name */
    let baseLiteral: string = base;
    if (Array.isArray(zType.value)) {
      switch (true) {
        case zType.name === IDL_TYPE_LOOKUP.STRING:
          baseLiteral = zType.value
            .map((val) => JSON.stringify(val).replace(/"/g, "'"))
            .join(' | ');
          break;
        default:
          baseLiteral = zType.value.join(' | ');
          break;
      }
    }

    // check if we have type args to process
    if (zType.args.length > 0) {
      base += '<';
      baseLiteral += '<';
      for (let i = 0; i < zType.args.length; i++) {
        if (i > 0) {
          base += ', ';
          baseLiteral += ', ';
        }

        const args = zType.args[i];

        // populate the display name of the child
        PopulateTypeProperties(args, iIsTask);

        // process each arg
        for (let j = 0; j < args.length; j++) {
          if (j > 0) {
            base += ' | ';
            baseLiteral += ' | ';
          }
          base += args[j].display;
          baseLiteral += args[j].serialized;
        }
      }
      base += '>';
      baseLiteral += '>';
    }

    // set the display name
    zType.display = base;
    zType.serialized = baseLiteral;
  }
}
