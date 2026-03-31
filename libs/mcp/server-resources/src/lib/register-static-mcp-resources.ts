import { MCPServer } from '@idl/mcp/server';

import { MCPResourceIndex } from './mcp-resource-index.class';

/**
 * Registers static/hardcoded MCP resources (documentation links)
 */
export function RegisterStaticMCPResources() {
  if (!MCPServer.isStarted) {
    return;
  }

  /**
   * Test resource to register
   */
  MCPResourceIndex.add(
    'about-extension',
    'Basic information about the extension and high level features. See here for more information: https://interactive-data-language.github.io/vscode-idl/',
  );

  MCPResourceIndex.add(
    'about-types',
    'Basic information about adding types to IDL through routine documentation. See here for more information: https://interactive-data-language.github.io/vscode-idl/types/types_tldr.html',
  );

  MCPResourceIndex.add(
    'documenting-code',
    'Best practices and examples for documenting your code. See resource here for information about how to document IDL Code including best practices: https://interactive-data-language.github.io/vscode-idl/code-comments/',
  );

  MCPResourceIndex.add(
    'opening-rasters',
    'Information about which files to open in ENVI so metadata is populated as users expect. See resource here: https://www.nv5geospatialsoftware.com/docs/SupportedFormats.html',
  );
}
