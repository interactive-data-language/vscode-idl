import { IDL_TYPE_LOOKUP, IDLDataType } from '@idl/types/idl-data-types';
import { IDL_NUMBER_REGEX } from '@idl/types/tokenizer';

let canPrint = false;

setTimeout(() => {
  canPrint = true;
}, 2500);

/**
 * Handles literal types that we have parsed
 */
export function ProcessLiteralTypes(type: IDLDataType) {
  // process top-level types as type args are recursed into during
  // parsing and this code will get called
  for (let i = 0; i < type.length; i++) {
    switch (true) {
      // check for a string
      case /^(?:'|")/im.test(type[i].name):
        // replace value first since it is based on the name
        type[i].value = [type[i].name];

        // reset name and display
        type[i].name = IDL_TYPE_LOOKUP.STRING;
        type[i].display = IDL_TYPE_LOOKUP.STRING;
        break;
      // check for numbers
      case IDL_NUMBER_REGEX.test(type[i].name):
        // replace value first since it is based on the name
        type[i].value = [type[i].name];

        // reset name and display
        type[i].name = IDL_TYPE_LOOKUP.NUMBER;
        type[i].display = IDL_TYPE_LOOKUP.NUMBER;
        break;
      default:
        break;
    }

    // // process any type arguments
    // for (let j = 0; j < type[i].args.length; j++) {
    //   ProcessLiteralTypes(type[i].args[j])
    // }
  }

  if (canPrint) {
    console.log({ type });
  }
}
