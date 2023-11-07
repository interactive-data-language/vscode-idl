import { CaseStyleFlags, STYLE_FLAG_LOOKUP } from '@idl/assembling/config';

/**
 * Simply adjust the case of text without anything fancy being applied
 */
export function AdjustCase(text: string, flag: CaseStyleFlags) {
  switch (flag) {
    case STYLE_FLAG_LOOKUP.LOWER:
      return text.toLowerCase();
    case STYLE_FLAG_LOOKUP.UPPER:
      return text.toUpperCase();
    default:
      return text;
  }
}
