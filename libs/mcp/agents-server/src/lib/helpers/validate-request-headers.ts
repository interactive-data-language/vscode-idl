/**
 * Headers that callers may not set because they are managed by the HTTP transport
 */
const BLOCKED_REQUEST_HEADERS = new Set([
  'connection',
  'content-length',
  'host',
  'transfer-encoding',
]);

/**
 * Returns an error message if the per-request headers are invalid, otherwise undefined
 */
export function ValidateRequestHeaders(headers: unknown): string | undefined {
  if (headers === undefined) {
    return undefined;
  }
  if (
    typeof headers !== 'object' ||
    headers === null ||
    Array.isArray(headers)
  ) {
    return 'requestHeaders must be an object of string values';
  }
  for (const [name, value] of Object.entries(headers)) {
    if (typeof value !== 'string') {
      return `requestHeaders["${name}"] must be a string`;
    }
    if (BLOCKED_REQUEST_HEADERS.has(name.toLowerCase())) {
      return `requestHeaders["${name}"] is not allowed`;
    }
  }
  return undefined;
}
