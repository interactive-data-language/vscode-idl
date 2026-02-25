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

  // track tutorials as resources.
  MCPTrackResourcesInFolder(logger, folder, true, 'tutorials', {
    'setting up (must be completed first!).md': true,
  });

  // track example notebooks
  MCPTrackResourcesInFolder(
    logger,
    GetExtensionPath('extension/example-notebooks'),
    false,
    'ex-notebooks',
    {}
  );

  MCPTrackHoverHelpResources();
}
