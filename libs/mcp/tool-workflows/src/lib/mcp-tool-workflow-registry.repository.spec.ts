import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { MCPToolWorkflowRegistry } from './mcp-tool-workflow-registry.class';

function Pkg(
  version: string,
  envitoolworkflows: { [key: string]: string },
): IAnalyticRepository_ServerPackage {
  return {
    package: {
      name: 'pkg',
      version,
      metadata: { envi_tool_workflows: envitoolworkflows },
    } as any,
    server: { url: 'http://localhost' },
  };
}

function Analytics(...results: IAnalyticRepository_ServerPackage[][]) {
  const getENVIToolWorkflowPackages = jest.fn();
  for (const result of results) {
    getENVIToolWorkflowPackages.mockResolvedValueOnce(result);
  }
  return { getENVIToolWorkflowPackages } as any;
}

describe('MCPToolWorkflowRegistry repository workflows', () => {
  let dir: string;
  let registry: MCPToolWorkflowRegistry;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'workflows-'));
  });

  afterEach(() => {
    registry.dispose();
    rmSync(dir, { recursive: true, force: true });
  });

  it('uses the latest version and replaces stale repository workflows', async () => {
    registry = new MCPToolWorkflowRegistry({
      localDir: dir,
      repository: Analytics(
        [
          Pkg('1.0.0', { Old: 'old content' }),
          Pkg('2.0.0', { New: 'new content' }),
        ],
        [],
      ),
    });

    expect(await registry.list()).toEqual(['new']);
    expect(registry.getWorkflow('NEW')).toBe('new content');

    expect(await registry.list()).toEqual([]);
  });

  it('lets local workflows win name conflicts', async () => {
    registry = new MCPToolWorkflowRegistry({
      localDir: dir,
      repository: Analytics([
        Pkg('1.0.0', { Shared: 'repository content', Other: 'other' }),
      ]),
    });
    registry.addToolWorkflow('Shared', 'local content');

    expect((await registry.list()).sort()).toEqual(['other', 'shared']);
    expect(registry.getWorkflow('shared')).toBe('local content');
  });

  it('keeps existing repository workflows when the refresh fails', async () => {
    const analytics = Analytics([Pkg('1.0.0', { New: 'new content' })]);
    registry = new MCPToolWorkflowRegistry({
      localDir: dir,
      repository: analytics,
    });
    await registry.list();

    analytics.getENVIToolWorkflowPackages.mockRejectedValueOnce(
      new Error('offline'),
    );

    expect(await registry.list()).toEqual(['new']);
  });
});
