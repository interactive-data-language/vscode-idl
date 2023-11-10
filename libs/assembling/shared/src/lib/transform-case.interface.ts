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
 * Regular expression that find text that should always be upper case
 *
 * Needs to be a global regex to replace multiple matches at once
 */
export const PASCAL_POST_PROCESS_REGEX = /idl|envi|roi|json/gim;

/**
 * Regular expressions that indicate we have special text to replace with our
 * case conversions for camel case
 */
export const CAMEL_POST_PROCESS_REGEX = {
  IDL: /^idl(?=[a-z])/im,
  ENVI: /^envi(?=[a-z])/im,
  UPPER: /(?<!^)(?:idl|envi|roi|json)/gim,
};
