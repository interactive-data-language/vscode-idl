import { GetExtensionPath } from '@idl/idl/files';
import { IDL_TRANSLATION } from '@idl/translation';
import { existsSync, mkdirSync } from 'fs';
import { cp, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import * as vscode from 'vscode';

/**
 * Extracts user custom content from copilot-instructions.md that exists outside the agent instruction markers
 * @param instructionsPath Path to the copilot-instructions.md file
 * @returns Object containing content before and after agent instructions, or null if extraction fails
 */
async function extractUserContent(
  instructionsPath: string
): Promise<{ beforeAgent: string; afterAgent: string } | null> {
  try {
    const existingDoc = await vscode.workspace.openTextDocument(
      instructionsPath
    );
    const existingText = existingDoc.getText();

    // Use markers to identify the agent-controlled section
    const agentStartMarker = '<!-- AGENT_INSTRUCTIONS_START -->';
    const agentEndMarker = '<!-- AGENT_INSTRUCTIONS_END -->';

    const agentStartIndex = existingText.indexOf(agentStartMarker);
    const agentEndIndex = existingText.indexOf(agentEndMarker);

    if (agentStartIndex !== -1 && agentEndIndex !== -1) {
      // Extract everything OUTSIDE the agent instruction markers
      // This preserves user's custom content
      const beforeAgent = existingText.substring(0, agentStartIndex).trim();
      const afterAgent = existingText
        .substring(agentEndIndex + agentEndMarker.length)
        .trim();

      return { beforeAgent, afterAgent };
    }

    return null;
  } catch (err) {
    console.error(
      'Error extracting user content from copilot-instructions.md:',
      err
    );
    return null;
  }
}

/**
 * Restores user custom content around the new agent instructions
 * @param instructionsPath Path to the copilot-instructions.md file
 * @param userContent User's custom content to restore
 */
async function restoreUserContent(
  instructionsPath: string,
  userContent: { beforeAgent: string; afterAgent: string }
): Promise<void> {
  try {
    const newAgentsText = await readFile(instructionsPath, 'utf-8');

    const agentStartMarker = '<!-- AGENT_INSTRUCTIONS_START -->';
    const agentEndMarker = '<!-- AGENT_INSTRUCTIONS_END -->';

    const agentStartIndex = newAgentsText.indexOf(agentStartMarker);
    const agentEndIndex = newAgentsText.indexOf(agentEndMarker);

    if (agentStartIndex !== -1 && agentEndIndex !== -1) {
      // Extract the new agent instructions
      const newAgentInstructions = newAgentsText.substring(
        agentStartIndex,
        agentEndIndex + agentEndMarker.length
      );

      // Rebuild the file with user content before and after agent instructions
      const updatedAgentsText =
        userContent.beforeAgent +
        '\n\n' +
        newAgentInstructions +
        '\n\n' +
        userContent.afterAgent;

      await writeFile(instructionsPath, updatedAgentsText, 'utf-8');
    }
  } catch (err) {
    console.error(
      'Error restoring user content in copilot-instructions.md:',
      err
    );
  }
}

/**
 * Sets up GitHub Copilot instructions in the workspace
 * @param versionsAreDifferent If true, skips the overwrite confirmation dialog
 */
export async function SetupCopilotInstructions(
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

    const workspaceRoot = folders[0].uri.fsPath;

    // Create .github directory if it doesn't exist
    const githubDir = join(workspaceRoot, '.github');
    if (!existsSync(githubDir)) {
      mkdirSync(githubDir, { recursive: true });
    }

    // Create .github/instructions directory if it doesn't exist
    const instructionsDir = join(githubDir, 'instructions');
    if (!existsSync(instructionsDir)) {
      mkdirSync(instructionsDir, { recursive: true });
    }

    // Destination paths
    const copilotInstructionsPath = join(githubDir, 'copilot-instructions.md');
    const idlInstructionsPath = join(instructionsDir, 'IDL.instructions.md');

    // Check if copilot-instructions.md exists and if it has agent instructions
    const copilotInstructionsExists = existsSync(copilotInstructionsPath);
    let hasAgentInstructions = false;

    if (copilotInstructionsExists) {
      const existingContent = await readFile(copilotInstructionsPath, 'utf-8');
      hasAgentInstructions = existingContent.includes(
        '<!-- AGENT_INSTRUCTIONS_START -->'
      );
    }

    // Copy templates from extension
    const copilotTemplatePath = GetExtensionPath(
      'extension/templates/copilot-instructions.md'
    );
    const idlInstructionsTemplatePath = GetExtensionPath(
      'extension/templates/IDL.instructions.md'
    );

    // Handle different scenarios
    if (copilotInstructionsExists && !hasAgentInstructions) {
      // File exists but no agent instructions - append them

      const templateContent = await readFile(copilotTemplatePath, 'utf-8');
      const existingContent = await readFile(copilotInstructionsPath, 'utf-8');

      // Append agent instructions to the end
      const updatedContent = existingContent + '\n\n' + templateContent;
      await writeFile(copilotInstructionsPath, updatedContent, 'utf-8');
    } else if (copilotInstructionsExists && hasAgentInstructions) {
      // File exists with agent instructions

      // If versionsAreDifferent is true, skip confirmation (auto-update to newer version)
      // Otherwise, ask user to confirm overwrite
      if (!versionsAreDifferent) {
        const overwrite = await vscode.window.showWarningMessage(
          IDL_TRANSLATION.notifications.copilotFileExists,
          IDL_TRANSLATION.notifications.yes,
          IDL_TRANSLATION.notifications.no
        );

        if (overwrite !== IDL_TRANSLATION.notifications.yes) {
          return false;
        }
      }

      // Extract user custom content from copilot-instructions.md
      const instructionsUserContent = await extractUserContent(
        copilotInstructionsPath
      );

      // Copy template file
      await cp(copilotTemplatePath, copilotInstructionsPath);

      // If we have user custom content, restore it around the new agent instructions
      if (instructionsUserContent) {
        await restoreUserContent(
          copilotInstructionsPath,
          instructionsUserContent
        );
      }
    } else {
      // File doesn't exist - create it
      await cp(copilotTemplatePath, copilotInstructionsPath);
    }

    // If we got this far it means that we have updated or created the copilot instructions.
    // since copilot instructions controls our versioning, we can deduce that our versioning has changed,
    // thus, we always copy IDL.instructions.md
    await cp(idlInstructionsTemplatePath, idlInstructionsPath);

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
