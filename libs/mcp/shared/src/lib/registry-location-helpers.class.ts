import { readFileSync } from 'node:fs';

import {
  RegistryLocation,
  RegistryLocation_File,
  RegistryLocation_Memory,
} from './registry-location.interface';

/**
 * Helpers for retrieving content for the various
 * MCP registries
 */
export class RegistryLocationHelpers {
  /**
   * Retrieving content
   */
  static retrieveContent(
    location: RegistryLocation<RegistryLocation_File | RegistryLocation_Memory>,
  ): string {
    switch (location.type) {
      case 'file':
        return readFileSync(location.meta.path, 'utf-8');
      case 'memory':
        return location.meta.content;
      default:
        throw new Error(`Unhandled type of "${(location as any).type}"`);
    }
  }
}
