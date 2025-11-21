import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { MCPTrackResourcesInFolder } from '@idl/mcp/server-resources';

import { MCPTrackHoverHelpResources } from './mcp-track-hover-help-resources';

/**
 * Tracks our tutorials as MCP resources
 */
export function MCPTrackTutorialsAsResources(logger: LogManager) {
  /**
   * Get the path to the folder
   */
  const folder = GetExtensionPath('extension/example-notebooks/IDL Tutorials');

  // track resources
  MCPTrackResourcesInFolder(logger, folder, 'tutorials', {
    'setting up (must be completed first!).md': true,
  });

  MCPTrackHoverHelpResources();
}
