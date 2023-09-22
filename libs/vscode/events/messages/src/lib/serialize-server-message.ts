/**
 * Serialize messages to/from the language server
 */
export function SerializeServerMessage(message: any) {
  return JSON.stringify(message);
}
