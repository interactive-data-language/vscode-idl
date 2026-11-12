import { compare, type CompareOperator } from 'compare-versions';
import * as os from 'os';

import { IDL_DIRS } from './idl-dirs.interface';
import { ValidateIDLDir } from './validate-idl-dir';

/**
 * Matches the IDL folder in a path (i.e. idl92)
 *
 * Needs to be the last one because ENVI folders don't match (i.e. envi62)
 */
const IDL_FOLDER_REGEX = /idl(\d)(\d)(?![\d])/gi;

/**
 * Converts an IDL version folder (idl92) or a version string (9.2) to
 * a normalized "major.minor" version.
 *
 * Returns undefined if we can't parse it.
 */
export function NormalizeIDLVersion(version: string): string | undefined {
  const folder = /^idl(\d)(\d)$/i.exec(version.trim());
  if (folder) {
    return `${folder[1]}.${folder[2]}`;
  }

  const dotted = /^(\d+)\.(\d+)(?:\.\d+)*$/.exec(version.trim());
  if (dotted) {
    return `${dotted[1]}.${dotted[2]}`;
  }

  return undefined;
}

/**
 * Extracts the "major.minor" IDL version from an IDL installation path
 *
 * i.e. `C:\Program Files\NV5\ENVI62\IDL92\bin\bin.x86_64` -> `9.2`
 */
export function GetIDLVersionFromDir(dir: string): string | undefined {
  const matches = Array.from(dir.matchAll(IDL_FOLDER_REGEX));
  if (matches.length === 0) {
    return undefined;
  }
  const last = matches[matches.length - 1];
  return `${last[1]}.${last[2]}`;
}

/**
 * Finds all valid IDL installations in the default locations that
 * satisfy a version comparison.
 *
 * Results are in the order of IDL_DIRS (newest first).
 *
 * @param version IDL version to compare against, as "idl92" or "9.2".
 *   If not provided, all installations are returned.
 * @param operator How each install is compared to the version. For example,
 *   `>=` returns installs that are the same as or newer than `version`.
 */
export function FindMatchingIDLInstalls(
  version?: string,
  operator: CompareOperator = '=',
): string[] {
  const target = version ? NormalizeIDLVersion(version) : undefined;
  if (version && !target) {
    return [];
  }

  const found: string[] = [];
  const testDirs = IDL_DIRS[os.platform()] || [];
  for (let i = 0; i < testDirs.length; i++) {
    const dir = testDirs[i];

    if (target) {
      const dirVersion = GetIDLVersionFromDir(dir);
      if (!dirVersion || !compare(dirVersion, target, operator)) {
        continue;
      }
    }

    if (ValidateIDLDir(dir)) {
      found.push(dir);
    }
  }

  return found;
}
