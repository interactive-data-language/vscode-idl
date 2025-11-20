import { IDL_MCP_LOG } from '@idl/logger';
import { MCPResourceIndex } from '@idl/mcp/server-resources';
import {
  IDLRawNotebook,
  IDLRawNotebookVersion,
  IDLRawNotebookVersion_2_0_0,
} from '@idl/types/notebooks';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { nanoid } from 'nanoid';
import { basename, join } from 'path';

import { IDL_LANGUAGE_SERVER_LOGGER } from '../initialize-language-server';

/**
 * Recursively registers tutorial files as MCP resources
 */
export function MCPTrackTutorialFiles(baseDir: string, relativePath = '') {
  const fullPath = join(baseDir, relativePath);

  if (!existsSync(fullPath)) {
    return;
  }

  const items = readdirSync(fullPath);

  for (const item of items) {
    const itemPath = join(fullPath, item);
    const relativeItemPath = relativePath ? join(relativePath, item) : item;
    const stat = statSync(itemPath);

    switch (true) {
      /**
       * Recurse
       */
      case stat.isDirectory():
        // Skip the "Setting up" directory
        if (item.includes('Setting up')) {
          continue;
        }

        // Recursively process subdirectories
        MCPTrackTutorialFiles(baseDir, relativeItemPath);
        break;

      /**
       * Add markdown
       */
      case item.endsWith('.md'):
        MCPResourceIndex.add(
          `${basename(item)}${nanoid()}`,
          readFileSync(itemPath, { encoding: 'utf-8' })
        );
        break;

      /**
       * Add notebooks - extract the content from the cells
       * for a more targeted search result
       */
      case item.endsWith('.idlnb'): {
        try {
          /**
           * Parse notebook
           */
          const parsed: IDLRawNotebook<IDLRawNotebookVersion> = JSON.parse(
            readFileSync(itemPath, 'utf-8')
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
                  strings.push('```idl');
                }
              }

              // track
              MCPResourceIndex.add(
                `${basename(item)}${nanoid()}`,
                strings.join('\n')
              );
              break;
            }
            default:
              break;
          }
        } catch (err) {
          IDL_LANGUAGE_SERVER_LOGGER.log({
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
