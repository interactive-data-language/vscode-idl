import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { MCPTrackResourcesInFolder } from '@idl/mcp/server-resources';

import { MCPTrackHoverHelpResources } from './mcp-track-hover-help-resources';

/**
 * Tracks all resources for the MCP server
 */
export function MCPTrackResources(logger: LogManager) {
  /**
   * Get the path to the folder
   */
  const folder = GetExtensionPath('resources/example-notebooks/IDL Tutorials');

  // track tutorials as resources.
  MCPTrackResourcesInFolder(logger, folder, true, 'tutorials', {
    'setting up (must be completed first!).md': true,
  });

  // track example notebooks
  MCPTrackResourcesInFolder(
    logger,
    GetExtensionPath('resources/example-notebooks'),
    false,
    'ex-notebooks',
    {},
  );

  // track additional AI resources folder
  MCPTrackResourcesInFolder(
    logger,
    GetExtensionPath('resources/agents/resources'),
    true,
    'resource',
    {
      'readme.md': true,
    },
  );

  MCPTrackHoverHelpResources();
}
