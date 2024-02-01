import { CUSTOM_TYPE_DISPLAY_NAMES } from '../..';
import { IDLDataType } from '../idl-data-types.interface';
import { PARSED_TO_KNOWN_TYPES } from './parsed-to-known-type-map.interface';
import { PostProcessTypeName, TASK_NAME_REGEX } from './post-process-type-name';

/**
 * Recurse into our type statement and parse everything
 */
export function PopulateDisplayName(types: IDLDataType) {
  // do any post-processing for types
  PostProcessTypeName(types);

  // process each type
  for (let z = 0; z < types.length; z++) {
    // get our type
    const struct = types[z];

    /** initialize display name */
    let base = struct.name;

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
      case lc in PARSED_TO_KNOWN_TYPES:
        base = PARSED_TO_KNOWN_TYPES[lc];
        break;
      case lc in CUSTOM_TYPE_DISPLAY_NAMES:
        base = CUSTOM_TYPE_DISPLAY_NAMES[lc];
        break;
      default:
        break;
    }

    // check if we have type args to process
    if (struct.args.length > 0) {
      base += '<';
      for (let i = 0; i < struct.args.length; i++) {
        if (i > 0) {
          base += ', ';
        }

        const args = struct.args[i];

        // populate the display name of the child
        PopulateDisplayName(args);

        // process each arg
        for (let j = 0; j < args.length; j++) {
          if (j > 0) {
            base += ' | ';
          }
          base += args[j].display;
        }
      }
      base += '>';
    }

    // set the display name
    struct.display = base;
  }
}
