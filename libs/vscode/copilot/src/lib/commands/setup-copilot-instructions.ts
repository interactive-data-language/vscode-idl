import { GetExtensionPath } from '@idl/idl/files';
import { IDL_TRANSLATION } from '@idl/translation';
import { existsSync, mkdirSync } from 'fs';
import { cp, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import * as vscode from 'vscode';

/**
 * Extracts user custom content from AGENTS.md that exists outside the agent instruction markers
 * @param agentsPath Path to the AGENTS.md file
 * @returns Object containing content before and after agent instructions, or null if extraction fails
 */
async function extractUserContent(
  agentsPath: string
): Promise<{ beforeAgent: string; afterAgent: string } | null> {
  try {
    const existingDoc = await vscode.workspace.openTextDocument(agentsPath);
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
    console.error('Error extracting user content from AGENTS.md:', err);
    return null;
  }
}

/**
 * Restores user custom content around the new agent instructions
 * @param agentsPath Path to the AGENTS.md file
 * @param userContent User's custom content to restore
 */
async function restoreUserContent(
  agentsPath: string,
  userContent: { beforeAgent: string; afterAgent: string }
): Promise<void> {
  try {
    const newAgentsText = await readFile(agentsPath, 'utf-8');

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

      await writeFile(agentsPath, updatedAgentsText, 'utf-8');
    }
  } catch (err) {
    console.error('Error restoring user content in AGENTS.md:', err);
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

    // cheap paranoia. We check for workspace in initialize-extension.
    if (!folders || folders.length === 0) {
      vscode.window.showErrorMessage(
        IDL_TRANSLATION.notifications.noWorkspaceFolder
      );
      return false;
    }

    const workspaceRoot = folders[0].uri.fsPath;

    // Create IDL-Agent-Support directory if it doesn't exist
    const agentSupportDir = join(workspaceRoot, 'IDL-Agent-Support');
    if (!existsSync(agentSupportDir)) {
      mkdirSync(agentSupportDir, { recursive: true });
    }

    // Destination path for copilot instructions
    const agentsPath = join(workspaceRoot, 'AGENTS.md');

    // Check if AGENTS.md exists
    const agentsExists = existsSync(agentsPath);

    // This is checked if the file already exists. (if we are updating a version)
    if (agentsExists) {
      const overwrite = await vscode.window.showWarningMessage(
        IDL_TRANSLATION.notifications.agentsFileExists,
        IDL_TRANSLATION.notifications.yes,
        IDL_TRANSLATION.notifications.no
      );

      // handles closing the dialog as well.
      if (overwrite !== IDL_TRANSLATION.notifications.yes) {
        return false;
      }
    }

    // Copy templates from extension
    const agentsTemplatePath = GetExtensionPath(
      'extension/templates/AGENTS.md'
    );
    const instructionsTemplatePath = GetExtensionPath(
      'extension/templates/IDL.instructions.md'
    );
    const instructionsPath = join(agentSupportDir, 'IDL.instructions.md');

    // Extract user custom content from AGENTS.md (everything outside the agent instruction markers)
    let agentsUserContent: { beforeAgent: string; afterAgent: string } | null =
      null;
    if (versionsAreDifferent && existsSync(agentsPath)) {
      agentsUserContent = await extractUserContent(agentsPath);
    }

    // Copy template files
    await cp(agentsTemplatePath, agentsPath);
    await cp(instructionsTemplatePath, instructionsPath);

    // If we have user custom content from AGENTS.md, restore it around the new agent instructions
    if (agentsUserContent) {
      await restoreUserContent(agentsPath, agentsUserContent);
    }

    // CONTEXT FILE LOGIC
    // Copy tutorial files to IDL-Agent-Support/context/
    const tutorialSourceDir = GetExtensionPath(
      'extension/example-notebooks/IDL Tutorials'
    );
    const contextDir = join(agentSupportDir, 'context');

    // Files to exclude from copying
    const excludedFiles = [
      'Setting up (Must be completed first!)',
      'version.txt',
      // Add more files to exclude here
    ];

    // set up a short filter function to check each file against our excluded list
    const filterFiles = (source: string) => {
      const filename = source.split(/[\\/]/).pop() || '';
      return !excludedFiles.some((excluded) => filename.includes(excluded));
    };

    // Create context directory if it doesn't exist
    if (!existsSync(contextDir)) {
      mkdirSync(contextDir, { recursive: true });
      await cp(tutorialSourceDir, contextDir, {
        recursive: true,
        filter: filterFiles,
      });
    } else {
      // Directory exists - copy but exclude specific files
      await cp(tutorialSourceDir, contextDir, {
        recursive: true,
        filter: filterFiles,
      });
    }

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
