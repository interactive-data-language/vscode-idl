import { CaseStyleFlags, STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { camelCase, pascalCase } from 'case-anything';

import { AdjustCase } from './adjust-case';
import {
  PASCAL_POST_PROCESS_REGEX,
  PRESERVE_CHARS,
} from './transform-case.interface';

/**
 * Transforms text to pascal case with special cases for ENVI and IDL
 */
function PascalCaseTransform(referenceText: string) {
  /** Convert */
  let converted = pascalCase(referenceText, { keep: PRESERVE_CHARS });

  // check for special character combinations
  switch (true) {
    case PASCAL_POST_PROCESS_REGEX.IDL.test(referenceText):
      converted = converted.replace(PASCAL_POST_PROCESS_REGEX.IDL, 'IDL');
      break;
    case PASCAL_POST_PROCESS_REGEX.ENVI.test(referenceText):
      converted = converted.replace(PASCAL_POST_PROCESS_REGEX.ENVI, 'ENVI');
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
export function TransformCase(referenceText: string, flag: CaseStyleFlags) {
  switch (flag) {
    case STYLE_FLAG_LOOKUP.CAMEL:
      return camelCase(referenceText, { keep: PRESERVE_CHARS });
    case STYLE_FLAG_LOOKUP.PASCAL:
      return PascalCaseTransform(referenceText);
    default:
      return AdjustCase(referenceText, flag);
  }
}
