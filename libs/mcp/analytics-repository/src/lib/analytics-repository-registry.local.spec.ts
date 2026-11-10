import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { AnalyticsRepositoryRegistry } from './analytics-repository-registry.class';

function Manifest(name: string, version: string, tags: string[] = []) {
  return {
    author: 'a',
    date: '',
    description: '',
    display_name: name,
    filename: '',
    metadata: { agent_skills: { [name]: 'skill' } },
    name,
    package_size: 0,
    tags,
    type: 'idl',
    uid: name,
    version,
  };
}

describe('AnalyticsRepositoryRegistry local packages', () => {
  let dir: string;
  let registry: AnalyticsRepositoryRegistry;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'idl-packages-'));
    registry = new AnalyticsRepositoryRegistry();
    registry.setLocalDir(dir);
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  function Install(folder: string, manifest: any) {
    mkdirSync(join(dir, folder));
    writeFileSync(join(dir, folder, 'manifest.json'), JSON.stringify(manifest));
  }

  it('reads local packages and skips invalid folders', async () => {
    Install('good', Manifest('good', '1.0.0'));
    mkdirSync(join(dir, 'empty'));
    mkdirSync(join(dir, 'bad'));
    writeFileSync(join(dir, 'bad', 'manifest.json'), '{ nope');

    const found = await registry.getLocalPackages();

    expect(found.map((item) => item.package.name)).toEqual(['good']);
    expect(found[0].localPath).toBe(join(dir, 'good'));
    expect(found[0].server).toBeUndefined();
  });

  it('filters local packages and returns nothing for a missing folder', async () => {
    Install('a', Manifest('a', '1.0.0', ['Agent Skill']));
    Install('b', Manifest('b', '1.0.0', ['ENVI Task']));

    expect(
      (await registry.searchRepositories({ tags: ['Agent Skill'] })).map(
        (item) => item.package.name,
      ),
    ).toEqual(['a']);

    registry.setLocalDir(join(dir, 'does-not-exist'));
    expect(await registry.searchRepositories()).toEqual([]);
  });

  it('drops remote packages that share a name with an installed package', async () => {
    Install('shared', Manifest('shared', '1.0.0'));
    const server = { url: 'http://localhost' };
    registry.addServer(server);

    const search = jest
      .spyOn(registry as any, 'searchServerRepositories')
      .mockResolvedValue([
        { package: Manifest('Shared', '9.0.0'), server },
        { package: Manifest('other', '1.0.0'), server },
      ]);

    // installed package does not match the tag filter, but still blocks remote
    const found = await registry.searchRepositories({ tags: ['x'] });

    expect(search).toHaveBeenCalled();
    expect(found.map((item) => item.package.name)).toEqual(['other']);

    const all = await registry.searchRepositories();
    expect(all.map((item) => item.package.name)).toEqual(['shared', 'other']);
    expect(all[0].package.version).toBe('1.0.0');
  });
});
