import * as vscode from 'vscode';

import { VSCODE_COMMANDS } from './vscode-commands.interface';

/**
 * Given a markdown file, open as preview
 */
export async function OpenMarkdownPreview(file: string) {
  /**
   * Get URI for file
   */
  const uri = vscode.Uri.file(file);

  // if markdown, show the preview for the file
  if (file.toLowerCase().endsWith('.md')) {
    vscode.commands.executeCommand(VSCODE_COMMANDS.MARKDOWN_PREVIEW, uri);
  }
}
