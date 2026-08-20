/**
 * First match is the index, second is the line number, third is "attributes", and the foruth
 * is the file that it is in
 */
export const IDL_BREAKPOINT_REGEX = /^([0-9]+)\s*([0-9]+)\s*([^\s]*)\s+(.*)/gim;
