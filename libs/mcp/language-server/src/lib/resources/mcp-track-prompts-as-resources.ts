import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { MCPTrackResourcesInFolder } from '@idl/mcp/server-resources';
import { join } from 'path';

/**
 * Tracks GitHub Copilot prompts as MCP resources
 */
export function MCPTrackPromptsAsResources(logger: LogManager) {
  /**
   * Get the path to the prompts folder
   */
  const folder = GetExtensionPath('extension/github-copilot/prompts');

  // track IDL prompts with 'prompts-idl' prefix
  MCPTrackResourcesInFolder(logger, join(folder, 'IDL'), 'prompts-idl', {
    'readme.md': true,
  });

  // track ENVI prompts with 'prompts-envi' prefix
  MCPTrackResourcesInFolder(logger, join(folder, 'ENVI'), 'prompts-envi', {
    'readme.md': true,
  });
}
