import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';
import { compareVersions, validate } from 'compare-versions';

/**
 * Compares two versions, returns a positive number if `a` is newer than `b`
 *
 * Versions that are not valid are always considered older than valid ones
 */
export function CompareVersions(a: string, b: string): number {
  const validA = validate(a);
  const validB = validate(b);

  if (!validA || !validB) {
    return Number(validA) - Number(validB);
  }

  return compareVersions(a, b);
}

/**
 * Finds all packages by name and keeps only the latest version of each
 * package.
 *
 * When two versions compare as equal, the first one we found is kept
 */
export function LatestPackages(
  packages: IAnalyticRepository_ServerPackage[],
): IAnalyticRepository_ServerPackage[] {
  const latest = new Map<string, IAnalyticRepository_ServerPackage>();

  for (const item of packages) {
    const key = item.package.name.toLowerCase();
    const current = latest.get(key);

    if (
      current === undefined ||
      CompareVersions(item.package.version, current.package.version) > 0
    ) {
      latest.set(key, item);
    }
  }

  return Array.from(latest.values());
}
