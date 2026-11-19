import { ANALYTICS_REPOSITORY_REGISTRY } from '@idl/mcp/analytics-repository';
import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { copy } from 'fast-copy';

import { UpdateServerConfig } from './update-server-config';

jest.mock('@idl/mcp/analytics-repository', () => ({
  ANALYTICS_REPOSITORY_REGISTRY: { setServers: jest.fn() },
}));
jest.mock('@idl/mcp/language-server-tools', () => ({
  MCP_TASK_REGISTRY: undefined,
}));
jest.mock('@idl/mcp/server', () => ({ MCPServer: { isStarted: false } }));
jest.mock('@idl/mcp/server-tools', () => {
  const registry = { filters: { updateFilters: jest.fn() } };
  return {
    ENVI_TOOL_WORKFLOW_REGISTRY: registry,
    MCP_SKILL_REGISTRY: registry,
  };
});
jest.mock('../mcp/create-standalone-mcp-server', () => ({
  MCP_INSTRUCTION_REGISTRY: { filters: { updateFilters: jest.fn() } },
}));

describe('UpdateServerConfig', () => {
  it('ensures analytics repository URLs have a protocol', () => {
    const config = copy(DEFAULT_AGENT_SERVER_CONFIG);
    config.packages.repositories = [
      { headers: {}, url: 'example.com' },
      { headers: {}, url: ' localhost:3000 ' },
      { headers: {}, url: 'http://a.com' },
      { headers: {}, url: 'HTTPS://b.com' },
    ];

    UpdateServerConfig(config);

    const servers = (ANALYTICS_REPOSITORY_REGISTRY.setServers as jest.Mock).mock
      .calls[0][0];
    expect(servers.map((s: { url: string }) => s.url)).toEqual([
      'http://example.com',
      'http://localhost:3000',
      'http://a.com',
      'HTTPS://b.com',
    ]);
    expect(config.packages.repositories[0].url).toBe('example.com');
  });
});
