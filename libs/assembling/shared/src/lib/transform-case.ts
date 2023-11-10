import {
  CaseStyleFlags,
  FullCaseStyleFlags,
  STYLE_FLAG_LOOKUP,
} from '@idl/assembling/config';
import { camelCase, pascalCase } from 'case-anything';

import { AdjustCase } from './adjust-case';
import {
  CAMEL_POST_PROCESS_REGEX,
  PASCAL_POST_PROCESS_REGEX,
  PRESERVE_CHARS,
} from './transform-case.interface';

/**
 * Transforms text to pascal case with special cases for ENVI and IDL
 */
function PascalCaseTransform(referenceText: string) {
  return pascalCase(referenceText, { keep: PRESERVE_CHARS }).replace(
    PASCAL_POST_PROCESS_REGEX,
    (m) => m.toUpperCase()
  );
}

/**
 * Transforms text to pascal case with special cases for ENVI and IDL
 */
function CamelCaseTransform(referenceText: string) {
  /** Convert */
  let converted = camelCase(referenceText, { keep: PRESERVE_CHARS }).replace(
    CAMEL_POST_PROCESS_REGEX.UPPER,
    (m) => m.toUpperCase()
  );

  // check for special character combinations
  switch (true) {
    case CAMEL_POST_PROCESS_REGEX.IDL.test(referenceText):
      {
        converted =
          converted.substring(0, 3).toLowerCase() +
          converted.substring(3, 4).toUpperCase() +
          converted.substring(4);
      }
      break;
    case CAMEL_POST_PROCESS_REGEX.ENVI.test(referenceText):
      converted =
        converted.substring(0, 4).toLowerCase() +
        converted.substring(4, 5).toUpperCase() +
        converted.substring(5);
      break;
    default:
      break;
  }

  return converted;
}

/**
 * Transforms the case of text to a different type given the
 * reference/defined case
 */
export function TransformCase(referenceText: string, flag: FullCaseStyleFlags) {
  switch (flag) {
    case STYLE_FLAG_LOOKUP.MATCH:
      return referenceText;
    case STYLE_FLAG_LOOKUP.CAMEL:
      return CamelCaseTransform(referenceText);
    case STYLE_FLAG_LOOKUP.PASCAL:
      return PascalCaseTransform(referenceText);
    default:
      return AdjustCase(referenceText, flag as CaseStyleFlags);
  }
}
