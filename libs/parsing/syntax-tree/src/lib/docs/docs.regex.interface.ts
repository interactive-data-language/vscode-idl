/** Regex t detect the header tag in a string */
export const HEADER_TAG = /(?<!:):(?!:)([^:]+)(?<!:):(?!:)/i;

/** Regex to detect arguments or keywords */
export const ARG_KW_PROPERTY_TAG = /^\s*([^:\s]*)\s*(?<!:):(?!:)/i;
