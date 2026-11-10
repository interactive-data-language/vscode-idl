import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';

/**
 * Gets where a package came from: the server URL for remote packages or the
 * install folder for local packages
 */
export function PackageSource(item: IAnalyticRepository_ServerPackage): string {
  return item.server?.url || item.localPath || '';
}
