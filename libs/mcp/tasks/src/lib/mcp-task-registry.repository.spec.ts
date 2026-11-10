import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';
import { readFileSync } from 'fs';

import { MCPTaskRegistry } from './mcp-task-registry.class';

const TASK_FILE =
  'apps/test/idl/task-parsing/test_task_no_display_name_envi.task';

function Pkg(
  version: string,
  envitasks: any,
): IAnalyticRepository_ServerPackage {
  return {
    package: { name: 'pkg', version, metadata: { envitasks } } as any,
    server: { url: 'http://localhost' },
  };
}

function Analytics(...results: IAnalyticRepository_ServerPackage[][]) {
  const getENVITaskPackages = jest.fn();
  for (const result of results) {
    getENVITaskPackages.mockResolvedValueOnce(result);
  }
  return { getENVITaskPackages } as any;
}

describe('MCPTaskRegistry repository tasks', () => {
  const taskJson = JSON.parse(
    readFileSync(GetExtensionPath(TASK_FILE), 'utf-8'),
  );
  const logManager = new LogManager({
    alert: () => {
      //
    },
  });

  it('registers tasks from the latest package and replaces stale ones', async () => {
    const registry = new MCPTaskRegistry({
      logger: logManager,
      analytics: Analytics(
        [
          Pkg('1.0.0', {}),
          Pkg('2.0.0', { 'test_task_no_display_name_envi.task': taskJson }),
        ],
        [],
      ),
    });

    await registry.list();

    expect(registry.hasTask('my_envi_test_task')).toBe(true);
    expect(registry.getTaskDetail('my_envi_test_task')?.location?.type).toBe(
      'repository',
    );
    expect(
      registry.getTaskDetail('my_envi_test_task')?.inputParameters,
    ).toBeDefined();

    await registry.list();
    expect(registry.hasTask('my_envi_test_task')).toBe(false);
  });

  it('skips bad tasks without throwing', async () => {
    const registry = new MCPTaskRegistry({
      logger: logManager,
      analytics: Analytics([Pkg('1.0.0', { 'Bad.task': { nope: true } })]),
    });

    expect(await registry.list()).toEqual({});
  });

  it('keeps existing repository tasks when the refresh fails', async () => {
    const analytics = Analytics([
      Pkg('1.0.0', { 'test_task_no_display_name_envi.task': taskJson }),
    ]);
    const registry = new MCPTaskRegistry({ logger: logManager, analytics });
    await registry.list();

    analytics.getENVITaskPackages.mockRejectedValueOnce(new Error('offline'));
    await registry.list();

    expect(registry.hasTask('my_envi_test_task')).toBe(true);
  });
});
