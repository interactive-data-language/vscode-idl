import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { copy } from 'fast-copy';

import { GetRestartReasons } from './get-restart-reasons';

describe('GetRestartReasons', () => {
  it('returns nothing for live-updatable changes', () => {
    const next = copy(DEFAULT_AGENT_SERVER_CONFIG);
    next.agent.mcp.skillBlacklist = ['a'];
    next.packages.repositories = [{ headers: {}, url: 'http://x' }];

    expect(GetRestartReasons(DEFAULT_AGENT_SERVER_CONFIG, next)).toEqual([]);
  });

  it('flags port, host, IDL directory, and package paths', () => {
    const next = copy(DEFAULT_AGENT_SERVER_CONFIG);
    next.server.port += 1;
    next.server.host = '0.0.0.0';
    next.idl.directory = '/idl';
    next.packages.paths = ['/packages'];

    expect(GetRestartReasons(DEFAULT_AGENT_SERVER_CONFIG, next)).toEqual([
      'server.port',
      'server.host',
      'idl.directory',
      'packages.paths',
    ]);
  });

  it('ignores duplicate package paths', () => {
    const running = copy(DEFAULT_AGENT_SERVER_CONFIG);
    running.packages.paths = ['/packages'];
    const next = copy(running);
    next.packages.paths = ['/packages', '/packages'];

    expect(GetRestartReasons(running, next)).toEqual([]);
  });
});
