import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { arch, platform } from 'process';

/**
 * Webpack-provided free variable resolving to the real Node `require` at runtime
 *
 * For compatibility with resolving the copilot executable in node and electron
 */
declare const __non_webpack_require__: NodeRequire;

/**
 * Check if in electron without top-level import
 */
const isElectron = Boolean(
  (process.versions as Record<string, string | undefined>)['electron'],
);

/** Flag if packaged in electron app */
let isPackaged = false;

/** Path to resources for the app */
let resourcesPath = '';

/**
 * If we are electron, then try to populate the info above
 */
if (isElectron) {
  try {
    // Dynamic require so pure Node ignores Electron if it isn't present
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { app } = require('electron');
    isPackaged = app.isPackaged;
    resourcesPath = (process as any).resourcesPath; // use any because this is special for electron
  } catch {
    // Fallback if require fails
  }
}

/**
 * Resolves the standard Copilot platform package name and binary file name.
 */
function GetCopilotInfo() {
  // build package name
  // you can check these in the package.json file for the
  // @github/copilot package
  const packageName = `@github/copilot-${platform}-${arch}`;

  // get what we spawn
  const binaryName = platform === 'win32' ? 'copilot.exe' : 'copilot';

  return { packageName, binaryName };
}

/**
 * Gets the runtime path to the copilot executable
 *
 * Handles runtime as node or electron and resolves
 * based on platform and architecture
 */
export function GetCopilotExecutable() {
  /**
   * Figure out where copilot executable lives
   */
  const { packageName, binaryName } = GetCopilotInfo();

  let binaryPath = '';

  if (isPackaged) {
    // 1. Check unpacked ASAR path (asar: true)
    const asarUnpackedPath = join(
      resourcesPath,
      'app.asar.unpacked',
      'node_modules',
      packageName,
      binaryName,
    );

    // 2. Check standard unpacked directory (asar: false)
    const unpackedAppPath = join(
      resourcesPath,
      'app',
      'node_modules',
      packageName,
      binaryName,
    );

    if (existsSync(asarUnpackedPath)) {
      binaryPath = asarUnpackedPath;
    } else if (existsSync(unpackedAppPath)) {
      binaryPath = unpackedAppPath;
    } else {
      // Fallback if electron-builder placed node_modules directly under resources
      binaryPath = join(resourcesPath, 'node_modules', packageName, binaryName);
    }
  } else {
    // Development mode / pure Node
    const binaryDir = dirname(require.resolve(packageName));
    binaryPath = join(binaryDir, binaryName);
  }
  return binaryPath;
}
