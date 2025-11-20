import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';

import { MCPTrackResourcesInFolder } from './mcp-track-resources-in-folder';

/**
 * Tracks our tutorials as MCP resources
 */
export function MCPTrackTutorialsAsResources(logger: LogManager) {
  /**
   * Get the path to the folder
   */
  const folder = GetExtensionPath('extension/example-notebooks/IDL Tutorials');

  // track resources
  MCPTrackResourcesInFolder(logger, folder, {
    'setting up (must be completed first!).md': true,
  });
}
