import { IDLDataType } from '@idl/types/idl-data-types';
import { copy } from 'fast-copy';

import { DEFAULT_TYPE_ARGS } from './default-type-args.interface';

/**
 * Processes each parsed type and sets defaults for args and strips
 * out excess args from types that don't belong.
 *
 * This ensures that, for example, arrays always have an indexed type
 */
export function SetDefaultTypes(types: IDLDataType) {
  for (let z = 0; z < types.length; z++) {
    const struct = types[z];
    switch (true) {
      case struct.name in DEFAULT_TYPE_ARGS:
        switch (true) {
          // add default
          case struct.args.length === 0:
            struct.args.push(...copy(DEFAULT_TYPE_ARGS[struct.name]));
            break;
          // remove excess types
          case struct.args.length > 1:
            struct.args = struct.args.splice(0);
            break;
          default:
            break;
        }
        break;
      default:
        // do nothing
        break;
    }

    // check if we have args to process as well
    if (struct.args.length > 0) {
      for (let i = 0; i < struct.args.length; i++) {
        SetDefaultTypes(struct.args[i]);
      }
    }
  }
}
