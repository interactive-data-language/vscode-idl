import {
  CUSTOM_TYPE_DISPLAY_NAMES,
  IDL_TYPE_LOOKUP,
  IDLDataType,
} from '@idl/types/idl-data-types';

/**
 * Regular expression to detect ENVI or IDL tasks so we can nicely format the display name
 */
const TASK_NAME_REGEX = /^(?:ENVI|IDL)(.+)Task$/i;

/**
 * Gets the display name for a task from the class "(envi or idl)mytasknametask"
 */
function GetTaskNameDisplayName(name: string) {
  const displayName =
    name in CUSTOM_TYPE_DISPLAY_NAMES ? CUSTOM_TYPE_DISPLAY_NAMES[name] : name;
  return TASK_NAME_REGEX.exec(displayName)?.[1] || displayName;
}

/**
 * Normalize names of our types for name, display name, and create
 * the serialized versions of the types
 */
export function PopulateTypeProperties(types: IDLDataType) {
  // process each type
  for (let z = 0; z < types.length; z++) {
    // get our type
    const zType = types[z];

    // check what types we have to process
    switch (zType.name) {
      /**
       * Handle ENVI tasks
       */
      case IDL_TYPE_LOOKUP.ENVI_TASK: {
        const arg = zType.args[0][0];
        if (arg.name === IDL_TYPE_LOOKUP.ANY) {
          zType.name = `envitask`;
        } else {
          zType.name = `envi${arg.name.toLowerCase()}task`;

          // check if we have a known task and there's a display name we should match
          if (zType.name in CUSTOM_TYPE_DISPLAY_NAMES) {
            arg.display = GetTaskNameDisplayName(zType.name);
            arg.serialized = arg.display;
          }
        }

        // strip other args to force our formatting style
        zType.args[0] = [arg];

        // update properties
        zType.serialized = `ENVITask<${arg.display}>`;
        zType.display = zType.serialized;
        break;
      }

      /**
       * Handle IDL tasks
       */
      case IDL_TYPE_LOOKUP.IDL_TASK: {
        const arg = zType.args[0][0];
        if (arg.name === IDL_TYPE_LOOKUP.ANY) {
          zType.name = `idltask`;
        } else {
          zType.name = `idl${arg.name.toLowerCase()}task`;

          // check if we have a known task and there's a display name we should match
          if (zType.name in CUSTOM_TYPE_DISPLAY_NAMES) {
            arg.display = GetTaskNameDisplayName(zType.name);
            arg.serialized = arg.display;
          }
        }

        // strip other args to force our formatting style
        zType.args[0] = [arg];

        // update properties
        zType.serialized = `IDLTask<${arg.display}>`;
        zType.display = zType.serialized;
        break;
      }

      /**
       * Process all other types
       */
      default: {
        /** Initialize display name */
        let base = zType.name;

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
            PopulateTypeProperties(args);

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
  }
}
