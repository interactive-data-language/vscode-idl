/**
 * Parse messages to/from the language server
 */
export function ParseServerMessage(message: any) {
  if (typeof message === 'string') {
    return JSON.parse(message);
  } else {
    return message;
  }
}
