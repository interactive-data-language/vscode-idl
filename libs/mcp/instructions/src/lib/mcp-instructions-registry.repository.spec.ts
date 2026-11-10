import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';

import { MCPInstructionsRegistry } from './mcp-instructions-registry.class';

function Pkg(
  version: string,
  instructions: { [key: string]: string },
): IAnalyticRepository_ServerPackage {
  return {
    package: {
      name: 'pkg',
      version,
      metadata: { agent_instructions: instructions },
    } as any,
    server: { url: 'http://localhost' },
  };
}

function Analytics(...results: IAnalyticRepository_ServerPackage[][]) {
  const getAgentInstructionPackages = jest.fn();
  for (const result of results) {
    getAgentInstructionPackages.mockResolvedValueOnce(result);
  }
  return { getAgentInstructionPackages } as any;
}

describe('MCPInstructionsRegistry repository instructions', () => {
  it('uses the latest version, strips frontmatter, and replaces stale items', async () => {
    const registry = new MCPInstructionsRegistry({
      repository: Analytics(
        [
          Pkg('1.0.0', { old: 'old content' }),
          Pkg('2.0.0', {
            'my-key': '---\nid: my-key\nname: Custom\n---\nnew content',
            mismatch: '---\nid: other\n---\nskipped',
          }),
        ],
        [],
      ),
    });

    expect((await registry.list()).map((item) => item.id)).toEqual([
      'none',
      'my-key',
    ]);
    expect(registry.hasInstruction('old')).toBe(false);
    expect(registry.getInstruction('my-key')).toBe('new content');

    expect((await registry.list()).map((item) => item.id)).toEqual(['none']);
  });

  it('lets local instructions win ID conflicts', async () => {
    const registry = new MCPInstructionsRegistry({
      repository: Analytics([Pkg('1.0.0', { shared: 'repository content' })]),
    });
    registry.addInstruction('shared', 'local content');

    await registry.list();

    expect(registry.getInstruction('shared')).toBe('local content');
  });

  it('keeps existing repository instructions when the refresh fails', async () => {
    const analytics = Analytics([Pkg('1.0.0', { kept: 'kept content' })]);
    const registry = new MCPInstructionsRegistry({ repository: analytics });
    await registry.list();

    analytics.getAgentInstructionPackages.mockRejectedValueOnce(
      new Error('offline'),
    );

    expect((await registry.list()).map((item) => item.id)).toEqual([
      'none',
      'kept',
    ]);
  });
});
