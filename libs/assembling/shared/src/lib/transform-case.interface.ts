/**
 * When adjusting the case of strings, which characters do
 * we make sure to preserve so we don't break case conversion?
 */
export const PRESERVE_CHARS: string[] = ['_', '$', '!'];

/**
 * Regular expressions that indicate we have special text to replace with our
 * case conversions
 */
export const PASCAL_POST_PROCESS_REGEX = {
  IDL: /^idl/im,
  ENVI: /^envi/im,
};
