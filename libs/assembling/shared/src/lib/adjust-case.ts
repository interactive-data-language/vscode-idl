import { CaseStyleFlags, STYLE_FLAG_LOOKUP } from '@idl/assembling/config';

/**
 * Sets case based on styling
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
