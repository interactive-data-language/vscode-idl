import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import {
  IDLRawNotebook,
  IDLRawNotebookVersion,
  IDLRawNotebookVersion_2_0_0,
} from '@idl/types/notebooks';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { nanoid } from 'nanoid';
import { basename, join } from 'path';

import { MCPResourceIndex } from './mcp-resource-index.class';

/**
 * Recursively registers tutorial files as MCP resources
 */
export function MCPTrackResourcesInFolder(
  logger: LogManager,
  folder: string,
  keyPrefix = nanoid(),
  filter: { [key: string]: any } = {}
) {
  // return if no folder
  if (!existsSync(folder)) {
    return;
  }

  /**
   * Recursively search for files
   */
  const items = readdirSync(folder, { recursive: true }).map((item) =>
    join(folder, item)
  );

  /**
   * Process each file/folder we found
   */
  for (const item of items) {
    /** Get lower case name */
    const lc = item.toLowerCase();

    // skip if file should be ignored
    if (basename(lc) in filter) {
      continue;
    }

    // skip folders
    if (statSync(item).isDirectory()) {
      continue;
    }

    /**
     * Determine how to proceed
     */
    switch (true) {
      /**
       * Add markdown
       */
      case lc.endsWith('.md'):
        MCPResourceIndex.add(
          `${keyPrefix}-${basename(item).toLowerCase().replace('.md', '')}`,
          readFileSync(item, { encoding: 'utf-8' })
        );
        break;

      /**
       * Add notebooks - extract the content from the cells
       * for a more targeted search result
       */
      case lc.endsWith('.idlnb'): {
        try {
          /**
           * Parse notebook
           */
          const parsed: IDLRawNotebook<IDLRawNotebookVersion> = JSON.parse(
            readFileSync(item, 'utf-8')
          );

          // handle version of NB file
          switch (parsed.version) {
            case '2.0.0': {
              /** Type notebook */
              const typed =
                parsed as IDLRawNotebook<IDLRawNotebookVersion_2_0_0>;

              /** Store string representation of notebook */
              let strings: string[] = [];

              // process each cell
              for (let i = 0; i < typed.cells.length; i++) {
                // add space for better layout
                if (strings.length > 0) {
                  strings.push('');
                }

                // extract cell
                const cell = typed.cells[i];

                // see how we need to include
                if (cell.type === 'markdown') {
                  strings = strings.concat(cell.content);
                } else {
                  strings.push('```idl');
                  strings = strings.concat(cell.content);
                  strings.push('```');
                }
              }

              // track
              MCPResourceIndex.add(
                `${keyPrefix}-${basename(item)
                  .toLowerCase()
                  .replace('.idlnb', '')}`,
                strings.join('\n')
              );
              break;
            }
            default:
              break;
          }
        } catch (err) {
          logger.log({
            log: IDL_MCP_LOG,
            type: 'error',
            content: [`Problem loading notebook file to track`, err],
          });
        }
        break;
      }
      default:
        break;
    }
  }
}
