import { createServer, type Server } from 'net';

import { AssertPortAvailable } from './assert-port-available';

describe('AssertPortAvailable', () => {
  let blocker: Server | undefined;

  afterEach(async () => {
    await new Promise<void>((resolve) =>
      blocker ? blocker.close(() => resolve()) : resolve(),
    );
    blocker = undefined;
  });

  it('resolves when the port is free', async () => {
    await expect(AssertPortAvailable('127.0.0.1', 0)).resolves.toBeUndefined();
  });

  it('throws when the port is in use', async () => {
    blocker = createServer();
    await new Promise<void>((resolve) =>
      blocker?.listen(0, '127.0.0.1', () => resolve()),
    );
    const port = (blocker.address() as { port: number }).port;

    await expect(AssertPortAvailable('127.0.0.1', port)).rejects.toThrow(
      `Port ${port} is already in use`,
    );
  });
});
