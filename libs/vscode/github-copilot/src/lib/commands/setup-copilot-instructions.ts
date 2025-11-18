import { IDL_TRANSLATION } from '@idl/translation';
import * as vscode from 'vscode';

/**
 * Sets up GitHub Copilot instructions in the workspace
 * @param versionsAreDifferent If true, skips the overwrite confirmation dialog
 */
export async function SetupCopilotInstructions(
  ctx: vscode.ExtensionContext,
  versionsAreDifferent?: boolean
): Promise<boolean> {
  try {
    const folders = vscode.workspace.workspaceFolders;

    // We check for workspace in initialize-extension.
    if (!folders || folders.length === 0) {
      vscode.window.showErrorMessage(
        IDL_TRANSLATION.notifications.noWorkspaceFolder
      );
      return false;
    }

    const workspaceRoot = folders[0].uri;

    // Create .github/instructions directory path
    const githubUri = vscode.Uri.joinPath(workspaceRoot, '.github');
    const instructionsUri = vscode.Uri.joinPath(githubUri, 'instructions');
    const idlInstructionsUri = vscode.Uri.joinPath(
      instructionsUri,
      'IDL.instructions.md'
    );

    // Check if IDL.instructions.md already exists
    let idlInstructionsExists = false;
    try {
      await vscode.workspace.fs.stat(idlInstructionsUri);
      idlInstructionsExists = true;
    } catch {
      // File doesn't exist
    }

    // If file exists and versionsAreDifferent is false, ask user to confirm overwrite
    if (idlInstructionsExists && !versionsAreDifferent) {
      const overwrite = await vscode.window.showWarningMessage(
        IDL_TRANSLATION.notifications.copilotFileExists,
        IDL_TRANSLATION.notifications.yes,
        IDL_TRANSLATION.notifications.no
      );

      if (overwrite !== IDL_TRANSLATION.notifications.yes) {
        return false;
      }
    }

    // Get template from extension
    const idlInstructionsTemplateUri = vscode.Uri.joinPath(
      ctx.extensionUri,
      'extension/templates/IDL.instructions.md'
    );

    // Read template content
    const templateContent = await vscode.workspace.fs.readFile(
      idlInstructionsTemplateUri
    );

    // Create directories if they don't exist
    try {
      await vscode.workspace.fs.createDirectory(instructionsUri);
    } catch {
      // Directory might already exist
    }

    // Write file to workspace
    await vscode.workspace.fs.writeFile(idlInstructionsUri, templateContent);

    vscode.window.showInformationMessage(
      IDL_TRANSLATION.notifications.copilotInstructionsCreated
    );

    return true;
  } catch (err) {
    vscode.window.showErrorMessage(
      `${IDL_TRANSLATION.commands.errors.copilot.setupInstructions}: ${err}`
    );
    return false;
  }
}
