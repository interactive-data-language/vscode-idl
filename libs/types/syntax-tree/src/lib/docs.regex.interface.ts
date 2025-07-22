/**
 *  Regex to detect the header tag in a string
 */
export const HEADER_TAG = /^\s*(?<!:):(?!:)([^:]+)(?<!:):(?!:)/i;

/**
 * Regex to detect arguments or keywords
 */
export const ARG_KW_PROPERTY_TAG = /^\s*([^:\s]*)\s*:(?!:|\/\/)/i;
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
 * If we have an input parameter
 */
export const LEGACY_PARAMETER_DIRECTION_IN = /\{(?:input|in)\}/i;

/**
 * If we have an output parameter
 */
export const LEGACY_PARAMETER_DIRECTION_OUT = /\{(?:output|out)\}/i;

/**
 * If we have an optional parameter (default is required)
 */
export const LEGACY_PARAMETER_OPTIONAL = /\{(?:optional)\}/i;

/**
 * If we have an optional parameter (default is required)
 */
export const LEGACY_PARAMETER_REQUIRED = /\{(?:required)\}/i;

/**
 * If we have type information
 */
export const LEGACY_PARAMETER_TYPE = /\{(?:type=)([a-z0-9_!$]+)\}/i;

/**
 * Matches all docs strings with legacy docs
 */
export const LEGACY_PARAMETER_INFO = /{([^}]*)}/gi;
