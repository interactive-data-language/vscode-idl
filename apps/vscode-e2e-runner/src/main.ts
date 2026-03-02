import { downloadAndUnzipVSCode, runTests } from '@vscode/test-electron';
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

    // Download VSCode version we want to use
    console.log('Downloading VSCode...');
    const vscodeExecutablePath = await downloadAndUnzipVSCode('stable');

    /**
     * Run tests with the downloaded VSCode
     * GitHub Copilot Chat extension will be installed via launchArgs
     */
    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ['--install-extension', 'GitHub.copilot-chat', '--force'],
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

go();
