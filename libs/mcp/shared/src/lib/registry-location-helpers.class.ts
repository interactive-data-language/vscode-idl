import { readFileSync } from 'node:fs';

import type { IAnalyticsRepository_PackageMetadata } from '@idl/types/analytics-repository';

import type {
  RegistryLocation,
  RegistryLocationKind,
} from './registry-location.interface';

/**
 * Top-level package metadata keys, excluding the catch-all index signature
 */
export type PackageMetadataKey = keyof {
  [K in keyof IAnalyticsRepository_PackageMetadata as string extends K
    ? never
    : K]: unknown;
};

/**
 * Helpers for retrieving content for the various
 * MCP registries
 */
export class RegistryLocationHelpers {
  /**
   * Retrieving content
   *
   * For repository items, `packageMetadataKey` is the strictly-typed top-level
   * key in the package metadata and `key` is the name of the item within it.
   */
  static retrieveContent(
    location: RegistryLocation<RegistryLocationKind>,
    packageMetadataKey?: PackageMetadataKey,
    key?: string,
  ): string {
    switch (location.type) {
      case 'file':
        return readFileSync(location.meta.path, 'utf-8');
      case 'memory':
        return location.meta.content;
      case 'repository': {
        if (!packageMetadataKey) {
          throw new Error(
            'packageMetadataKey is required when accessing a repository item',
          );
        }
        if (!key) {
          throw new Error('key is required when accessing a repository item');
        }
        const item = (
          location.meta.package.metadata[packageMetadataKey] as any
        )?.[key];

        if (typeof item === 'string') {
          return item;
        }
        throw new Error(
          `No string content found for "${key}" in package metadata "${packageMetadataKey}"`,
        );
      }
      default:
        throw new Error(`Unhandled type of "${(location as any).type}"`);
    }
  }
}
