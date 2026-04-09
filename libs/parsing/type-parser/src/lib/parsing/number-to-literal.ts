import { IDL_TYPE_LOOKUP, IDLDataTypeBase } from '@idl/types/idl-data-types';
import {
  BYTE_REGEX,
  COMPLEX_REGEX,
  DOUBLE_REGEX,
  EXPLICIT_FLOAT_REGEX,
  FLOAT_REGEX,
  INT_REGEX,
  LONG_REGEX,
  LONG64_REGEX,
  NUMBER_STRING_TEST,
  UINT_REGEX,
  ULONG_REGEX,
  ULONG64_REGEX,
} from '@idl/types/tokenizer';

/**
 * Serializes a number and converts to a format we can re-parse
 */
export function NumberToLiteral(typeName: string, values: string[]) {
  switch (typeName) {
    case IDL_TYPE_LOOKUP.BYTE:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'b'));
    case IDL_TYPE_LOOKUP.COMPLEX_DOUBLE:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'di'));
    case IDL_TYPE_LOOKUP.COMPLEX_FLOAT:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'i'));
    case IDL_TYPE_LOOKUP.DOUBLE:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'd'));
    case IDL_TYPE_LOOKUP.INTEGER:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 's'));
    case IDL_TYPE_LOOKUP.LONG:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'l'));
    case IDL_TYPE_LOOKUP.LONG64:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'll'));
    case IDL_TYPE_LOOKUP.UNSIGNED_INTEGER:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'us'));
    case IDL_TYPE_LOOKUP.UNSIGNED_LONG:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'lu'));
    case IDL_TYPE_LOOKUP.UNSIGNED_LONG64:
      return values.map((value) => value.replace(NUMBER_STRING_TEST, 'ull'));
    default:
      break;
  }
}

/**
 * Double as compile otpion
 */
const double = false;

/**
 * Attempts to determine the type from numbers
 *
 * TODO:
 *
 * - 0x (hex)
 * - 0o (octal)
 * - 0b (binary)
 */
export function UpdateNumberBaseType(
  type: IDLDataTypeBase<string>,
  match: string,
) {
  // set type value
  type.value = [match.toLowerCase()];

  // check from highest to lo
  // west type
  switch (true) {
    case DOUBLE_REGEX.test(match):
      if (COMPLEX_REGEX.test(match)) {
        type.name = IDL_TYPE_LOOKUP.COMPLEX_DOUBLE;
      } else {
        type.name = IDL_TYPE_LOOKUP.DOUBLE;
      }
      break;
    case FLOAT_REGEX.test(match):
      // check if we should promote to double
      if (!EXPLICIT_FLOAT_REGEX.test(match) && double) {
        if (COMPLEX_REGEX.test(match)) {
          type.name = IDL_TYPE_LOOKUP.COMPLEX_DOUBLE;
        } else {
          type.name = IDL_TYPE_LOOKUP.DOUBLE;
        }
      } else {
        if (COMPLEX_REGEX.test(match)) {
          type.name = IDL_TYPE_LOOKUP.COMPLEX_FLOAT;
        } else {
          type.name = IDL_TYPE_LOOKUP.FLOAT;
        }
      }
      break;
    // check if we added complex notation to a number, but it isnt double or
    // float, so we need to make it float complex minimally
    case COMPLEX_REGEX.test(match):
      type.name = IDL_TYPE_LOOKUP.COMPLEX_FLOAT;
      break;
    case ULONG64_REGEX.test(match):
      type.name = IDL_TYPE_LOOKUP.UNSIGNED_LONG64;
      break;
    case LONG64_REGEX.test(match):
      type.name = IDL_TYPE_LOOKUP.LONG64;
      break;
    case ULONG_REGEX.test(match):
      type.name = IDL_TYPE_LOOKUP.UNSIGNED_LONG;
      break;
    case LONG_REGEX.test(match):
      type.name = IDL_TYPE_LOOKUP.LONG;
      break;
    case BYTE_REGEX.test(match):
      type.name = IDL_TYPE_LOOKUP.BYTE;
      break;
    case UINT_REGEX.test(match):
      type.name = IDL_TYPE_LOOKUP.UNSIGNED_INTEGER;
      break;
    case INT_REGEX.test(match):
      type.name = IDL_TYPE_LOOKUP.INTEGER;
      break;
    default:
      type.name = IDL_TYPE_LOOKUP.INTEGER;
      break;
  }
}
