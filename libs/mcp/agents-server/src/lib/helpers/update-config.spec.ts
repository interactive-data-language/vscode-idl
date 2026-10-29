import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { copy } from 'fast-copy';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';

import { UpdateConfig } from './update-config';

describe('UpdateConfig', () => {
  const tempDir = join(__dirname, '__temp_update_config_test__');
  const tempFile = join(tempDir, 'desktop-agents.config.json');

  beforeEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('merges the patch, fills defaults, and saves to disk', () => {
    const updated = UpdateConfig(
      copy(DEFAULT_AGENT_SERVER_CONFIG),
      { agent: { llm: { config: { apiKey: 'abc' } } } },
      tempFile,
    );

    expect(updated.agent.llm).toMatchObject({
      model: 'openai',
      config: { apiKey: 'abc' },
    });
    expect(updated.server.port).toEqual(
      DEFAULT_AGENT_SERVER_CONFIG.server.port,
    );

    expect(existsSync(tempFile)).toBe(true);
    expect(JSON.parse(readFileSync(tempFile, 'utf-8'))).toEqual(updated);
  });

  it('replaces arrays instead of concatenating them', () => {
    const current = copy(DEFAULT_AGENT_SERVER_CONFIG);
    current.agent.mcp.mcpToolWhitelist = ['a', 'b'];

    const updated = UpdateConfig(
      current,
      { agent: { mcp: { mcpToolWhitelist: ['c'] } } },
      tempFile,
    );

    expect(updated.agent.mcp.mcpToolWhitelist).toEqual(['c']);
  });
});
