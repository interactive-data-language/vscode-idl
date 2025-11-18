import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { TrackServerResource } from '@idl/mcp/server-tools';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

import { RegisterResourceIDLRoutines } from './resources/register-resource-idl-routines';

/**
 * Recursively registers tutorial files as MCP resources
 */
function registerTutorialFiles(baseDir: string, relativePath = '') {
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
      registerTutorialFiles(baseDir, relativeItemPath);
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

      TrackServerResource(resourceName, description, content);
    }
  }
}

/**
 * Helper that adds all tools to the MCP server
 */
export function RegisterAllMCPResources(
  messenger: VSCodeLanguageServerMessenger,
  extensionPath?: string
) {
  if (!IS_MCP_SERVER_STARTED) {
    return;
  }

  /**
   * Test resource to register
   */
  TrackServerResource(
    'about-extension',
    'Basic information about the extension and high level features',
    'Find all information on the official docs page: https://interactive-data-language.github.io/vscode-idl/'
  );

  TrackServerResource(
    'about-types',
    'Basic information about IDL types and adding them to documentation',
    'See here for more information: https://interactive-data-language.github.io/vscode-idl/types/types_tldr.html'
  );

  TrackServerResource(
    'documenting-code',
    'Best practices and examples for documenting your code',
    'See resource here: https://interactive-data-language.github.io/vscode-idl/code-comments/'
  );

  TrackServerResource(
    'opening-rasters',
    'Information about which files to open in ENVI so metadata is populated as users expect.',
    'See resource here: https://www.nv5geospatialsoftware.com/docs/SupportedFormats.html'
  );

  // Register all tutorial files as individual MCP resources
  if (extensionPath) {
    const tutorialsDir = join(
      extensionPath,
      'extension',
      'example-notebooks',
      'IDL Tutorials'
    );
    registerTutorialFiles(tutorialsDir);

    // Register all IDL routines from global.json
    RegisterResourceIDLRoutines(extensionPath);
  }
}
