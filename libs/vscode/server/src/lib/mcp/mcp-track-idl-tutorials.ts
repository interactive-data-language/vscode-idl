import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Recursively registers tutorial files as MCP resources
 */
export function RegisterTutorialFiles(baseDir: string, relativePath = '') {
  const fullPath = join(baseDir, relativePath);

  if (!existsSync(fullPath)) {
    return;
  }

  const items = readdirSync(fullPath);

  for (const item of items) {
    const itemPath = join(fullPath, item);
    const relativeItemPath = relativePath ? join(relativePath, item) : item;
    const stat = statSync(itemPath);

    if (stat.isDirectory()) {
      // Skip the "Setting up" directory
      if (item.includes('Setting up')) {
        continue;
      }
      // Recursively process subdirectories
      RegisterTutorialFiles(baseDir, relativeItemPath);
    } else if (item.endsWith('.idlnb') || item.endsWith('.md')) {
      // Register individual tutorial files
      const content = readFileSync(itemPath, 'utf-8');
      const resourceName = `tutorial-${relativeItemPath
        .replace(/\\/g, '-')
        .replace(/\//g, '-')
        .replace(/\.idlnb$/, '')
        .replace(/\.md$/, '')
        .replace(/\s+/g, '-')
        .toLowerCase()}`;

      const description = `IDL Tutorial: ${relativeItemPath}`;

      MCPResourceIndex.add(resourceName, content);
    }
  }
}
