import * as vscode from 'vscode';

/**
 * Check if the current workspace contains IDL files (.pro or .idlnb)
 */
export async function isIDLWorkspace(): Promise<boolean> {
  if (vscode.workspace.workspaceFolders === undefined) {
    return false;
  }
  if (vscode.workspace.workspaceFolders.length === 0) {
    return false;
  }

  // Only need one file to confirm this is an IDL workspace
  const idlFiles = await vscode.workspace.findFiles('**/*.{pro,idlnb}', '', 1);

  if (idlFiles.length === 0) {
    return false;
  }

  return true;
}

/**
 * Check if the workspace needs copilot instructions
 * (i.e., doesn't already have copilot-instructions.md)
 */
export async function CopilotInstructionFileExists(): Promise<boolean> {
  // Check if copilot-instructions.md already exists
  const copilotFiles = await vscode.workspace.findFiles(
    '.github/copilot-instructions.md',
    null,
    1
  );

  // file doesnt exist. Just return.
  if (copilotFiles.length === 0) {
    return false;
  }
  return true;
}

export async function isWorkspaceFileVersionDifferent(
  extensionUri: vscode.Uri,
  workspaceFilePath: string,
  templateFilePath: string
): Promise<boolean> {
  // Check if the version comment in the file matches the template version
  try {
    const copilotInstructionFiles = await vscode.workspace.findFiles(
      workspaceFilePath,
      null,
      1
    );

    const templatePath = vscode.Uri.joinPath(extensionUri, templateFilePath);

    const existingFileUri = copilotInstructionFiles[0];
    const templateDoc = await vscode.workspace.openTextDocument(templatePath);
    const doc = await vscode.workspace.openTextDocument(existingFileUri);

    const templateText = templateDoc.getText();
    const existingText = doc.getText();

    // Look for version marker in the format: <!-- VERSION X.X --> or ### VERSION X.X
    const versionRegex =
      /<!--\s*VERSION\s+([\d.]+)\s*-->|###\s*VERSION\s+([\d.]+)/i;

    const templateMatch = templateText.match(versionRegex);
    const existingMatch = existingText.match(versionRegex);

    // If we can't find version markers, fall back to comparing the entire file
    if (!templateMatch || !existingMatch) {
      return templateText !== existingText;
    }

    // Extract version numbers (could be in capture group 1 or 2)
    const templateVersion = templateMatch[1] || templateMatch[2];
    const existingVersion = existingMatch[1] || existingMatch[2];

    // if the file exists but is not current. Then we want the new file.
    if (templateVersion !== existingVersion) {
      return true;
    }

    return false;
  } catch {
    console.error(
      `Error when checking for ${workspaceFilePath} and ${templateFilePath} file version.`
    );
    return false;
  }
}

/**
 * Check if copilot-instructions.md has agent instructions markers
 */
export async function CopilotInstructionHasAgentInstructions(): Promise<boolean> {
  try {
    const copilotFiles = await vscode.workspace.findFiles(
      '.github/copilot-instructions.md',
      null,
      1
    );

    if (copilotFiles.length === 0) {
      return false;
    }

    const doc = await vscode.workspace.openTextDocument(copilotFiles[0]);
    const text = doc.getText();

    return text.includes('<!-- AGENT_INSTRUCTIONS_START -->');
  } catch {
    return false;
  }
}
