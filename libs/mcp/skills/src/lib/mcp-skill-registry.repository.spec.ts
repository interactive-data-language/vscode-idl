import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';

import { MCPSkillRegistry } from './mcp-skill-registry.class';

function Pkg(version: string, skills: any): IAnalyticRepository_ServerPackage {
  return {
    package: { name: 'pkg', version, metadata: { skills } } as any,
    server: { url: 'http://localhost' },
  };
}

describe('MCPSkillRegistry repository skills', () => {
  it('replaces repository skills with the latest version and keeps local skills', async () => {
    const registry = new MCPSkillRegistry();
    registry.addSkill({
      name: 'Local',
      description: 'local',
      location: {
        type: 'memory',
        meta: { content: '---\nname: x\n---\nlocal' },
      },
    });

    registry.replaceRepositorySkills([
      Pkg('1.0.0', { Old: '---\nname: Old\ndescription: old\n---\nold' }),
      Pkg('2.0.0', {
        Local: '---\nname: Local\ndescription: conflict\n---\nnope',
        New: '---\nname: New\ndescription: new\n---\nnew prompt',
      }),
    ]);

    expect(registry.skillDescriptions()).toEqual({
      Local: 'local',
      New: 'new',
    });

    // replaced again with nothing, repository items go away
    registry.replaceRepositorySkills([]);
    expect(Object.keys(registry.skillDescriptions())).toEqual(['Local']);
  });

  it('retrieves repository content on-demand', async () => {
    const registry = new MCPSkillRegistry();
    registry.replaceRepositorySkills([
      Pkg('1.0.0', {
        New: '---\nname: New\ndescription: new\n---\nnew prompt',
      }),
    ]);

    expect(await registry.getSkill('new')).toBe('new prompt');
  });
});
