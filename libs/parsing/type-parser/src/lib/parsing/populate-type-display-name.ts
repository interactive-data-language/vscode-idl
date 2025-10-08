import {
  CUSTOM_TYPE_DISPLAY_NAMES,
  IDL_TYPE_LOOKUP,
  IDLDataType,
  TYPE_ALIASES,
} from '@idl/types/idl-data-types';

import { PostProcessTypeName, TASK_NAME_REGEX } from './post-process-type-name';

/**
 * Recurse into our type statement and parse everything
 */
export function PopulateTypeDisplayName(types: IDLDataType) {
  // do any post-processing for types
  PostProcessTypeName(types);

  // process each type
  for (let z = 0; z < types.length; z++) {
    // get our type
    const zType = types[z];

    /** Initialize display name */
    let base = zType.name;

    // get the lower case name
    let lc = base.toLowerCase();

    // check if we have a task
    if (TASK_NAME_REGEX.test(base)) {
      if (lc.startsWith('envi')) {
        base = 'ENVITask';
        lc = 'envitask';
      } else {
        base = 'IDLTask';
        lc = 'idltask';
      }
    }

    switch (true) {
      case lc in TYPE_ALIASES:
        base = TYPE_ALIASES[lc];
        break;
      case lc in CUSTOM_TYPE_DISPLAY_NAMES:
        base = CUSTOM_TYPE_DISPLAY_NAMES[lc];
        break;
      default:
        break;
    }

    /** Initialize literal display name */
    let baseLiteral: string = base;
    if (zType?.value?.length > 0) {
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
        PopulateTypeDisplayName(args);

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
