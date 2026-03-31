import { GetExtensionPath } from '@idl/idl/files';
import { IDL_LSP_LOG } from '@idl/logger';
import { MCPPromptRegistry } from '@idl/mcp/prompts';
import { MCPServer } from '@idl/mcp/server';
import {
  RegisterMCPTool_GetPrompt,
  RegisterMCPTool_ListPrompts,
} from '@idl/mcp/server-tools';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Registers MCP Prompt tools
 */
export function RegisterMCPPromptTools(server: MCPServer) {
  server.logManager.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: 'Registering MCP prompt tools',
  });

  /** Create prompt registry */
  const registry = new MCPPromptRegistry(server.logManager);

  // register tools
  RegisterMCPTool_GetPrompt(server, registry);
  RegisterMCPTool_ListPrompts(server, registry);

  /** ENVI prompt dir */
  const enviDir = GetExtensionPath('extension/github-copilot/prompts/ENVI');

  /**
   * Add ENVI prompts
   */
  registry.addPrompt({
    name: 'envi',
    description:
      'Describes how to use ENVI to solve remote sensing and image processing problems. Use when individuals are working with imagery, remote sensing, or image analysis problems.',
    prompt: readFileSync(join(enviDir, 'envi.prompt.md'), 'utf-8'),
    type: 'envi',
  });
  registry.addPrompt({
    name: 'enviBatchProcessing',
    description:
      'Describes how to use ENVI to perform batch processing. Use when individuals are working with imagery, remote sensing, or image analysis problems and have more than one image or set of images to process.',
    prompt: readFileSync(
      join(enviDir, 'enviBatchProcessing.prompt.md'),
      'utf-8',
    ),
    type: 'envi',
  });

  /** IDL prompt dir */
  const idlDir = GetExtensionPath('extension/github-copilot/prompts/IDL');

  /**
   * Add IDL prompts
   */
  registry.addPrompt({
    name: 'idl-plotting',
    description:
      'Describes how to use routines in IDL to create plots. A focus on newer routines to use for modern IDL programming.',
    prompt: readFileSync(join(idlDir, 'idlCreate2DPlot.prompt.md'), 'utf-8'),
    type: 'idl',
  });

  // emit MCP event that tools have changed
  server.sendToolListChanged();
}
