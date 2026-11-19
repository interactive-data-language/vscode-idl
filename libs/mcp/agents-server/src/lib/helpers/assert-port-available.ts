import { createConnection, createServer } from 'net';

/**
 * Resolves true if something accepts connections on the host and port
 */
function IsListening(host: string, port: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const socket = createConnection({ host, port, timeout: 1000 });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => resolve(false));
  });
}

/**
 * Throws an error if something is already listening on the host and port.
 *
 * On Windows, a server bound to a specific address (e.g. 127.0.0.1) can coexist
 * with one bound to a wildcard address (e.g. 0.0.0.0), so trying to bind is not
 * enough. We also try to connect on the loopback addresses to find those.
 */
export async function AssertPortAvailable(
  host: string,
  port: number,
): Promise<void> {
  const inUse = new Error(`Port ${port} is already in use on ${host}`);

  await new Promise<void>((resolve, reject) => {
    const tester = createServer();

    tester.once('error', (err: NodeJS.ErrnoException) => {
      reject(err.code === 'EADDRINUSE' ? inUse : err);
    });

    tester.once('listening', () => {
      tester.close((err) => (err ? reject(err) : resolve()));
    });

    tester.listen(port, host);
  });

  // port 0 means "any free port", nothing to connect to
  if (port === 0) {
    return;
  }

  const results = await Promise.all(
    [host, '127.0.0.1', '::1'].map((address) => IsListening(address, port)),
  );
  if (results.some((listening) => listening)) {
    throw inUse;
  }
}
