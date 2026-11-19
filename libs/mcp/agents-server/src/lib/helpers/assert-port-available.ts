import { createServer } from 'net';

/**
 * Throws an error if something is already listening on the host and port.
 *
 * Note that on Windows, a server bound to a specific address (e.g. 127.0.0.1)
 * can coexist with one bound to a wildcard address (e.g. 0.0.0.0), so this only
 * detects conflicts the OS reports for the exact host we will listen on.
 */
export async function AssertPortAvailable(
  host: string,
  port: number,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const tester = createServer();

    tester.once('error', (err: NodeJS.ErrnoException) => {
      reject(
        err.code === 'EADDRINUSE'
          ? new Error(`Port ${port} is already in use on ${host}`)
          : err,
      );
    });

    tester.once('listening', () => {
      tester.close((err) => (err ? reject(err) : resolve()));
    });

    tester.listen(port, host);
  });
}
