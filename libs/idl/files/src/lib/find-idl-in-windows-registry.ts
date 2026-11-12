import { execFileSync } from 'child_process';
import { compareVersions } from 'compare-versions';
import { join } from 'path';

import { GetIDLVersionFromDir } from './find-matching-idl-installs';
import { ValidateIDLDir } from './validate-idl-dir';

/**
 * Registry keys where ENVI installers record IDL
 */
const IDL_REGISTRY_ROOTS = [
  'HKLM\\SOFTWARE\\NV5\\ENVI',
  'HKLM\\SOFTWARE\\Harris\\ENVI',
];

/**
 * Parses the output of `reg query <key> /s` and returns the
 * values of all `IDLInstallDir` entries
 */
export function ParseRegistryIDLDirs(output: string): string[] {
  const dirs: string[] = [];

  const lines = output.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const match = /^\s*IDLInstallDir\s+REG_(?:EXPAND_)?SZ\s+(.+?)\s*$/i.exec(
      lines[i],
    );
    if (match) {
      dirs.push(match[1]);
    }
  }

  return dirs;
}

/**
 * Queries a registry key and returns the output, or an empty string
 * if the key doesn't exist
 */
function QueryRegistry(key: string): string {
  try {
    return execFileSync('reg', ['query', key, '/s'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true,
    });
  } catch {
    return '';
  }
}

/**
 * Checks the Windows registry for IDL installations, which finds installs
 * that are not in our default locations.
 *
 * Returns the folders where the IDL executable lives (i.e. bin directory),
 * newest version first. Always empty on non-Windows platforms.
 */
export function FindIDLInWindowsRegistry(): string[] {
  if (process.platform !== 'win32') {
    return [];
  }

  const found = new Set<string>();
  for (let i = 0; i < IDL_REGISTRY_ROOTS.length; i++) {
    const dirs = ParseRegistryIDLDirs(QueryRegistry(IDL_REGISTRY_ROOTS[i]));
    for (let j = 0; j < dirs.length; j++) {
      const bin = join(dirs[j], 'bin', 'bin.x86_64');
      if (ValidateIDLDir(bin)) {
        found.add(bin);
      }
    }
  }

  // newest first, unknown versions last
  return Array.from(found).sort((a, b) =>
    compareVersions(
      GetIDLVersionFromDir(b) || '0.0',
      GetIDLVersionFromDir(a) || '0.0',
    ),
  );
}
