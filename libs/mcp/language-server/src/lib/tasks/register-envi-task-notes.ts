import { VSCODE_DOT_IDL_FOLDER } from '@idl/idl/files';
import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Registers notes for ENVI Tasks for the LLM
 */
export function RegisterENVITaskNotes(
  registry: MCPTaskRegistry,
  logger: LogManager
) {
  /**
   * Check for user notes
   */
  const userUri = join(VSCODE_DOT_IDL_FOLDER, 'envi-task-notes.json');
  if (existsSync(userUri)) {
    try {
      // parse
      const parsed = JSON.parse(readFileSync(userUri, 'utf-8'));

      // attempt to load
      registry.addNotesForManyTasks(parsed);
    } catch (err) {
      logger.log({
        type: 'error',
        log: IDL_MCP_LOG,
        content: ['Error trying to load user ENVI Task notes', err],
      });
    }
  }
}
