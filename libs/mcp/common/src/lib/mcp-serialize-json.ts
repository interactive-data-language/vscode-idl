/**
 * Serializes an object to pass to IDL
 *
 * Needed to escape single quotes since that's what we
 * wrap this with.
 */
export function MCPSerializeJSON(obj: any) {
  return JSON.stringify(obj).replace(/'/gim, "''");
}
