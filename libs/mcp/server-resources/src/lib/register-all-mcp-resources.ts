import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { MCPResourceIndex } from './mcp-resource-index.class';

/**
 * Track if we registered our tools or not
 */
let REGISTERED = false;

/**
 * Helper that adds all tools to the MCP server
 */
export function RegisterAllMCPResources(
  messenger: VSCodeLanguageServerMessenger
) {
  if (!IS_MCP_SERVER_STARTED) {
    return;
  }
  if (REGISTERED) {
    return;
  }

  /**
   * Test resource to register
   */
  MCPResourceIndex.add(
    'about-extension',
    'Basic information about the extension and high level features. See here for more information: https://interactive-data-language.github.io/vscode-idl/'
  );

  MCPResourceIndex.add(
    'about-types',
    'Basic information about IDL types and adding them to documentation. See here for more information: https://interactive-data-language.github.io/vscode-idl/types/types_tldr.html'
  );

  MCPResourceIndex.add(
    'documenting-code',
    'Best practices and examples for documenting your code. See resource here for information about how to document IDL Code including best practices: https://interactive-data-language.github.io/vscode-idl/code-comments/'
  );

  MCPResourceIndex.add(
    'opening-rasters',
    'Information about which files to open in ENVI so metadata is populated as users expect. See resource here: https://www.nv5geospatialsoftware.com/docs/SupportedFormats.html'
  );

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;
}
