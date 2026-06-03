/**
 * IP addresses for local machine and not remote
 */
export const LOCAL_IPS: { [key: string]: any } = {};
LOCAL_IPS['127.0.0.1'] = true; // IPv4
LOCAL_IPS['::1'] = true; // IPv6
LOCAL_IPS['::ffff:127.0.0.1'] = true; // IPv6
LOCAL_IPS['localhost'] = true;

/**
 * Hostnames that refer to the local loopback interface.
 *
 * Used to validate the `Host`/`Origin` headers of incoming requests. A source
 * IP check alone is not enough to keep the MCP server private: a malicious web
 * page can use DNS-rebinding (rebind its domain to 127.0.0.1) so the source IP
 * looks local, while the `Host`/`Origin` header still carries the attacker's
 * domain. Rejecting non-loopback hosts closes that hole.
 */
const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

/**
 * Returns whether a `Host` or `Origin` header value refers to the local
 * loopback interface. Handles optional scheme, path, port, and bracketed IPv6
 * (e.g. `localhost:4142`, `http://127.0.0.1:4142`, `[::1]:4142`).
 */
export function IsLoopbackHost(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  let host = value.trim().toLowerCase();

  // strip scheme for Origin headers (e.g. "http://localhost:4142")
  const scheme = host.indexOf('://');
  if (scheme !== -1) {
    host = host.slice(scheme + 3);
  }

  // strip any path
  const slash = host.indexOf('/');
  if (slash !== -1) {
    host = host.slice(0, slash);
  }

  // exact match without a port (covers "::1", "localhost", "127.0.0.1")
  if (LOOPBACK_HOSTNAMES.has(host)) {
    return true;
  }

  // bracketed IPv6, e.g. "[::1]" or "[::1]:4142"
  if (host.startsWith('[')) {
    const end = host.indexOf(']');
    return end !== -1 && host.slice(1, end) === '::1';
  }

  // strip a trailing ":port" for IPv4 / hostnames
  const colon = host.lastIndexOf(':');
  if (colon !== -1) {
    host = host.slice(0, colon);
  }

  return LOOPBACK_HOSTNAMES.has(host);
}
