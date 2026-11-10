import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';

import { MCPSkillRegistry } from './mcp-skill-registry.class';

function Pkg(version: string, skills: any): IAnalyticRepository_ServerPackage {
  return {
    package: {
      name: 'pkg',
      version,
      metadata: { agent_skills: skills },
    } as any,
    server: { url: 'http://localhost' },
  };
}

function Analytics(...results: IAnalyticRepository_ServerPackage[][]) {
  const getAgentSkillPackages = jest.fn();
  for (const result of results) {
    getAgentSkillPackages.mockResolvedValueOnce(result);
  }
  return { getAgentSkillPackages } as any;
}

describe('MCPSkillRegistry repository skills', () => {
  it('replaces repository skills with the latest version and keeps local skills', async () => {
    const registry = new MCPSkillRegistry({
      repository: Analytics(
        [
          Pkg('1.0.0', { Old: '---\nname: Old\ndescription: old\n---\nold' }),
          Pkg('2.0.0', {
            Local: '---\nname: Local\ndescription: conflict\n---\nnope',
            New: '---\nname: New\ndescription: new\n---\nnew prompt',
          }),
        ],
        [],
      ),
    });
    registry.addSkill({
      name: 'Local',
      description: 'local',
      location: {
        type: 'memory',
        meta: { content: '---\nname: x\n---\nlocal' },
      },
    });

    expect(await registry.list()).toEqual({
      Local: 'local',
      New: 'new',
    });

    // listed again with nothing, repository items go away
    expect(Object.keys(await registry.list())).toEqual(['Local']);
  });

  it('retrieves repository content on-demand', async () => {
    const registry = new MCPSkillRegistry({
      repository: Analytics([
        Pkg('1.0.0', {
          New: '---\nname: New\ndescription: new\n---\nnew prompt',
        }),
      ]),
    });
    await registry.list();

    expect(await registry.getSkill('new')).toBe('new prompt');
  });

  it('keeps existing repository skills when the refresh fails', async () => {
    const analytics = Analytics([
      Pkg('1.0.0', {
        New: '---\nname: New\ndescription: new\n---\nnew prompt',
      }),
    ]);
    const registry = new MCPSkillRegistry({ repository: analytics });
    await registry.list();

    analytics.getAgentSkillPackages.mockRejectedValueOnce(new Error('offline'));

    expect(await registry.list()).toEqual({ New: 'new' });
  });

  it('lists local skills when there are no analytics repositories', async () => {
    const registry = new MCPSkillRegistry();
    registry.addSkill({
      name: 'Local',
      description: 'local',
      location: { type: 'memory', meta: { content: 'local' } },
    });

    expect(await registry.list()).toEqual({ Local: 'local' });
  });
});
