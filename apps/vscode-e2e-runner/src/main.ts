import { runTests } from '@vscode/test-electron';
import { join } from 'path';

async function go() {
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
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

go();
