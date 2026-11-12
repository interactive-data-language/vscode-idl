import {
  compare,
  type CompareOperator,
  compareVersions,
} from 'compare-versions';
import * as os from 'os';
import { normalize } from 'path';

import { FindIDLInWindowsRegistry } from './find-idl-in-windows-registry';
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
 * Checks if an IDL installation directory satisfies a version comparison
 *
 * @param dir IDL installation directory
 * @param version IDL version to compare against, as "idl92" or "9.2".
 *   If not provided, every directory matches.
 * @param operator How the directory is compared to the version
 */
export function MatchesIDLVersion(
  dir: string,
  version?: string,
  operator: CompareOperator = '=',
): boolean {
  if (!version) {
    return true;
  }

  const target = NormalizeIDLVersion(version);
  const dirVersion = GetIDLVersionFromDir(dir);
  if (!target || !dirVersion) {
    return false;
  }

  return compare(dirVersion, target, operator);
}

/**
 * Finds all valid IDL installations that satisfy a version comparison.
 *
 * Checks the default locations first (in the order of IDL_DIRS, newest first)
 * and then, on Windows, any other installs found in the registry (newest first).
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
  const found: string[] = [];
  const seen = new Set<string>();

  /** Adds a directory if it matches and we haven't seen it */
  const add = (dir: string) => {
    const key = normalize(dir).toLowerCase();
    if (seen.has(key) || !MatchesIDLVersion(dir, version, operator)) {
      return;
    }

    // make sure dir exists and has IDL executable
    if (ValidateIDLDir(dir)) {
      seen.add(key);
      found.push(dir);
    }
  };

  /**
   * Check all known folders
   */
  const testDirs = IDL_DIRS[os.platform()] || [];
  for (let i = 0; i < testDirs.length; i++) {
    add(testDirs[i]);
  }

  /**
   * Check windows registry
   */
  const registry = FindIDLInWindowsRegistry().sort((a, b) =>
    compareVersions(
      GetIDLVersionFromDir(b) || '0.0',
      GetIDLVersionFromDir(a) || '0.0',
    ),
  );
  for (let i = 0; i < registry.length; i++) {
    add(registry[i]);
  }

  return found;
}
