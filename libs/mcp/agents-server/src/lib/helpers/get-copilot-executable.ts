import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { arch, platform } from 'process';

/**
 * Webpack-provided free variable resolving to the real Node `require` at runtime
 */
declare const __non_webpack_require__: NodeRequire;

/**
 * Resolves the standard Copilot platform package name and binary file name.
 */
function GetCopilotInfo() {
  const platformKey = `${platform}-${arch}`;

  // build package name
  // you can check these in the package.json file for the
  // @github/copilot-sdk package
  const packageName = `@github/copilot-sdk-${platformKey}`;

  // get what we spawn (copilot-runtime.exe on win32, copilot-runtime on POSIX)
  const binaryName =
    platform === 'win32' ? 'copilot-runtime.exe' : 'copilot-runtime';

  return { packageName, binaryName, platformKey };
}

/**
 * Gets the runtime path to the copilot executable
 *
 * Hosts that cannot have it resolved from node_modules (i.e. packaged apps)
 * point us at it with the COPILOT_CLI_PATH environment variable.
 */
export function GetCopilotExecutable(): string {
  // If COPILOT_CLI_PATH environment variable is set, respect it
  if (
    process.env.COPILOT_CLI_PATH &&
    existsSync(process.env.COPILOT_CLI_PATH)
  ) {
    return process.env.COPILOT_CLI_PATH;
  }

  /**
   * Figure out where copilot executable lives
   */
  const { packageName, binaryName, platformKey } = GetCopilotInfo();

  const packageRoot = dirname(
    __non_webpack_require__.resolve(join(packageName, 'package.json')),
  );
  return join(packageRoot, 'prebuilds', platformKey, binaryName);
}
