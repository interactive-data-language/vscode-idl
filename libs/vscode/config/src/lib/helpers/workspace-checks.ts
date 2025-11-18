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
 * Check if IDL.instructions.md exists in the workspace
 */
export async function CopilotInstructionFileExists(): Promise<boolean> {
  const idlInstructionFiles = await vscode.workspace.findFiles(
    '.github/instructions/IDL.instructions.md',
    null,
    1
  );

  return idlInstructionFiles.length > 0;
}

export async function isWorkspaceFileVersionDifferent(
  extensionUri: vscode.Uri,
  workspaceFilePath: string,
  templateFilePath: string
): Promise<boolean> {
  // Check if the version in the YAML frontmatter description matches the template version
  try {
    const workspaceFiles = await vscode.workspace.findFiles(
      workspaceFilePath,
      null,
      1
    );

    if (workspaceFiles.length === 0) {
      return false;
    }

    const templatePath = vscode.Uri.joinPath(extensionUri, templateFilePath);

    const existingFileUri = workspaceFiles[0];
    const templateDoc = await vscode.workspace.openTextDocument(templatePath);
    const doc = await vscode.workspace.openTextDocument(existingFileUri);

    const templateText = templateDoc.getText();
    const existingText = doc.getText();

    // Look for version in YAML frontmatter description: description: '...(vX.X)'
    const yamlVersionRegex =
      /^---\s*\n(?:.*\n)*?description:\s*['"].*?\(v([\d.]+)\)['"]/im;

    const templateMatch = templateText.match(yamlVersionRegex);
    const existingMatch = existingText.match(yamlVersionRegex);

    // If we can't find version markers, fall back to comparing the entire file
    if (!templateMatch || !existingMatch) {
      return templateText !== existingText;
    }

    // Extract version numbers from capture group 1
    const templateVersion = templateMatch[1];
    const existingVersion = existingMatch[1];

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
