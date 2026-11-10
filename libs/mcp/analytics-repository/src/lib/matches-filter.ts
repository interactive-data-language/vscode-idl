import type {
  IAnalyticsRepository_Package,
  IAnalyticsRepository_SearchFilter,
} from '@idl/types/analytics-repository';

/**
 * Checks if a local package matches the same filters that we send to servers
 */
export function MatchesFilter(
  pkg: IAnalyticsRepository_Package,
  filter: IAnalyticsRepository_SearchFilter,
): boolean {
  const lower = (value: string | undefined) => (value ?? '').toLowerCase();

  if (filter.name && lower(pkg.name) !== lower(filter.name)) {
    return false;
  }
  if (filter.version && pkg.version !== filter.version) {
    return false;
  }
  if (filter.uid && pkg.uid !== filter.uid) {
    return false;
  }
  if (filter.author && lower(pkg.author) !== lower(filter.author)) {
    return false;
  }
  if (
    filter.description &&
    !lower(pkg.description).includes(lower(filter.description))
  ) {
    return false;
  }
  if (filter.types?.length && !filter.types.includes(pkg.type)) {
    return false;
  }
  if (filter.tags?.length) {
    const tags = (pkg.tags ?? []).map(lower);
    return filter.tags.every((tag) => tags.includes(lower(tag)));
  }
  return true;
}
