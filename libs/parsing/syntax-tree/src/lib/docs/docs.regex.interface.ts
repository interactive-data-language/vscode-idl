/**
 *  Regex to detect the header tag in a string
 */
export const HEADER_TAG = /^\s*(?<!:):(?!:)([^:]+)(?<!:):(?!:)/i;

/**
 * Regex to detect arguments or keywords
 */
export const ARG_KW_PROPERTY_TAG =
  /^\s*([^:\s]*)\s*(?<!:|https?|ftp|s3|file):(?!:)/i;
// export const ARG_KW_PROPERTY_TAG = /^\s*([^:\s]*)\s*(?<!:):(?!:)/i;

/**
 * Header tags for "@param" style of docs
 *
 * Should have the same number of capture groups as the HEADER_TAG above
 */
export const HEADER_TAG_LEGACY = /^\s*@([a-z_$0-9]+)/i;

/**
 * If we have an input direction parameter
 */
export const LEGACY_PARAMETER_NAME_SPLIT = /^\s*(?:[a-z_0-9$]+(,\s*)?)+/i;

/**
 * If we have an input direction parameter
 */
export const LEGACY_PARAMETER_DIRECTION = /\{input\}/gi;
