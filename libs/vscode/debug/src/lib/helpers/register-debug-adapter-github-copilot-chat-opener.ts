import { VSCODE_COMMANDS } from '@idl/types/vscode';
import * as vscode from 'vscode';

import { IDLDebugAdapter } from '../idl-debug-adapter.class';

/**
 * Handles notifications to open copilot chat
 */
export function RegisterDebugAdapterGithubCopilotChatOpener(
  adapter: IDLDebugAdapter
) {
  // plug in progress messages
  if (adapter._runtime.isIDLMachine()) {
    adapter._runtime.registerIDLNotifyHandler(
      'githubCopilot_openChat',
      async (msg) => {
        await vscode.commands.executeCommand(VSCODE_COMMANDS.COPILOT_OPEN_CHAT);

        // emit that we have finished
        return 1;
      }
    );
  }
}
