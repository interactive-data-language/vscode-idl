import { runTests } from '@vscode/test-electron';
import { join } from 'path';
import { performance } from 'perf_hooks';

async function go() {
  /** Get start time */
  const t0 = performance.now();

  try {
    /** Development folder, hover help below in runTests */
    const extensionDevelopmentPath = process.cwd();

    /** Path to test file, hover help below in runTests */
    const extensionTestsPath = join(
      process.cwd(),
      'dist',
      'apps',
      'client-e2e',
      'main.js'
    );

    /**
     * Basic usage
     */
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
    });
    console.log(`Finished running tests in ${performance.now() - t0} ms`);
  } catch (err) {
    console.log(`Finished running tests in ${performance.now() - t0} ms`);
    console.error('Failed to run tests');
    process.exit(1);
  }
}

go();
