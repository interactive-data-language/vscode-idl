/**
 * When adjusting the case of strings, which characters do
 * we make sure to preserve so we don't break case conversion?
 */
export const PRESERVE_CHARS: string[] = [
  '_', // always keep underscore so we dont change syntax
  '$', // valid character
  '!', // classes/system variables
  '.', // methods and properties
  '(', // functions
  ':', // methods
  '-', // methods
  '>', // methods
];

/**
 * Regular expressions that indicate we have special text to replace with our
 * case conversions for pascal case
 */
export const PASCAL_POST_PROCESS_REGEX = {
  IDL: /idl/gim,
  ENVI: /envi/gim,
  ROI: /roi/gim,
};

/**
 * Regular expressions that indicate we have special text to replace with our
 * case conversions for camel case
 */
export const CAMEL_POST_PROCESS_REGEX = {
  IDL: /^idl(?=[a-z])/im,
  ENVI: /^envi(?=[a-z])/im,
};
