import { CleanPath, IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { GetActivePROCodeWindow, IDLCommandAction } from '@idl/vscode/shared';
import { IDLAction } from '@idl/vscode/tree-view';
import { platform } from 'os';
import * as vscode from 'vscode';

/**
 * What shows in the VSCode terminal when IDL is running?
 */
const TERMINAL_NAME = 'idl';

/**
 * Checks current terminals for an IDL one that has been opened.
 *
 * Grabs the first match.
 */
export function GetActiveIDLTerminal(): vscode.Terminal[] {
  return vscode.window.terminals.filter(
    (terminal) => terminal.name.toLowerCase() === TERMINAL_NAME
  );
}

/**
 * Function that attempts to start an IDL terminal
 */
export function StartIDLTerminal(): boolean {
  // make sure we have a folder
  if (!IDL_EXTENSION_CONFIG.IDL.directory) {
    vscode.window
      .showInformationMessage(IDL_TRANSLATION.notifications.noIDLDirFound, {
        title: IDL_TRANSLATION.notifications.configure,
      })
      .then((res) => {
        if (res !== undefined) {
          if (res.title === IDL_TRANSLATION.notifications.configure) {
            vscode.commands.executeCommand(IDL_COMMANDS.CONFIG.IDL_DIR_USER);
          }
        }
      });
    return false;
  }

  // get the environment - strip vscode environment variables
  // we use them in IDL to check for debug console
  const useEnv = { ...process.env };
  const keys = Object.keys(useEnv);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].startsWith('VSCODE_')) {
      delete useEnv[keys[i]];
    }
  }

  // make sure we found the directory
  const newTerminal: vscode.Terminal = vscode.window.createTerminal({
    shellPath: platform() === 'win32' ? 'cmd.exe' : null,
    env: useEnv,
    name: 'idl',
  });

  // start IDL
  if (platform() === 'win32') {
    newTerminal.sendText(`"${IDL_EXTENSION_CONFIG.IDL.directory}"\\idl`);
  } else {
    newTerminal.sendText(`${IDL_EXTENSION_CONFIG.IDL.directory}/idl`);
  }

  // make terminal appear
  newTerminal.show();

  return true;
}

/**
 * Sends a command to the current IDL Terminal Window, if it exists
 */
export async function SendCommandToIDLTerminal(
  item: IDLAction | IDLCommandAction
) {
  // get an IDL terminal, use the first
  const terminals = GetActiveIDLTerminal();

  // validate that IDL is open already, or try depending on the action
  switch (true) {
    // try to start IDL if it isnt open and return
    case item.label === 'Open' && terminals.length === 0:
      return StartIDLTerminal();

    // check if we are already open
    case item.label === 'Open' && terminals.length > 0:
      terminals[0].show();
      vscode.window.showInformationMessage(
        IDL_TRANSLATION.terminal.alreadyStarted
      );
      return true;

    // no terminals, so alert user and return
    case terminals.length === 0:
      vscode.window.showInformationMessage(
        IDL_TRANSLATION.terminal.pleaseStart
      );
      return false;

    // bring IDL to the front
    default:
      terminals[0].show();
      break;
  }

  // get our IDL terminal
  const idl = terminals[0];

  // determine what command we need to run
  let code: vscode.TextDocument;

  // check what our action is
  switch (item.label) {
    case 'Compile':
      code = GetActivePROCodeWindow(true);
      if (!code) {
        return false;
      }
      await code.save();
      idl.sendText(`.compile -v '${CleanPath(code.uri.fsPath)}'`);
      break;
    case 'Run':
      code = GetActivePROCodeWindow(true);
      if (!code) {
        return false;
      }
      await code.save();
      idl.sendText(`.compile -v '${CleanPath(code.uri.fsPath)}'`);
      idl.sendText('.go');
      break;
    case 'Execute':
      code = GetActivePROCodeWindow(true);
      if (!code) {
        return false;
      }
      await code.save();
      idl.sendText(`@${CleanPath(code.uri.fsPath)}`);
      break;
    case 'Stop':
      idl.sendText('\u0003', false);
      break;
    case 'Continue':
      idl.sendText('.continue');
      break;
    case 'Step In':
      idl.sendText('.step');
      break;
    case 'Step Over':
      idl.sendText('.stepover');
      break;
    case 'Step Out':
      idl.sendText('.out');
      break;
    case 'Reset':
      idl.sendText('.reset');
      break;
    default:
    // do nothing
  }
  return true;
}
