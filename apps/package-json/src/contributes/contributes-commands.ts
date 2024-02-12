import { IDL_COMMANDS, IDL_LANGUAGE_NAME } from '@idl/shared';
import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

interface ICommandIcon {
  light: string;
  dark: string;
}

interface ICommand {
  command: string;
  title: string;
  icon?: ICommandIcon;
}

/**
 * Icons for our commands. Anything used for debugging should have
 * an icon. We make sure both icons exist
 */
const COMMAND_ICONS: { [key: string]: ICommandIcon } = {};

// icon for compiling files in debug menu
COMMAND_ICONS[IDL_COMMANDS.DEBUG.COMPILE] = {
  light: 'extension/images/light/settings.svg',
  dark: 'extension/images/dark/settings.svg',
};

// icon for running files from debug menu
COMMAND_ICONS[IDL_COMMANDS.DEBUG.RUN] = {
  light: 'extension/images/light/file-play.svg',
  dark: 'extension/images/dark/file-play.svg',
};

// // icon for running a batch file from a batch file
// COMMAND_ICONS[IDL_COMMANDS.DEBUG.EXECUTE_BATCH] = {
//   light: 'extension/images/light/file-batch.svg',
//   dark: 'extension/images/dark/file-batch.svg',
// };

// icon for resetting IDL
COMMAND_ICONS[IDL_COMMANDS.DEBUG.RESET] = {
  light: 'extension/images/light/renew.svg',
  dark: 'extension/images/dark/renew.svg',
};

// icon for notebook reset
COMMAND_ICONS[IDL_COMMANDS.NOTEBOOKS.RESET] = {
  light: 'extension/images/light/renew.svg',
  dark: 'extension/images/dark/renew.svg',
};

// icon for notebook stop
COMMAND_ICONS[IDL_COMMANDS.NOTEBOOKS.STOP] = {
  light: 'extension/images/light/stop.svg',
  dark: 'extension/images/dark/stop.svg',
};

// icon for notebook to PDF
COMMAND_ICONS[IDL_COMMANDS.NOTEBOOKS.CONVERT_TO_PDF] = {
  light: 'extension/images/light/pdf.svg',
  dark: 'extension/images/dark/pdf.svg',
};

// icon for notebook to Pro code
COMMAND_ICONS[IDL_COMMANDS.NOTEBOOKS.NOTEBOOK_TO_PRO_CODE] = {
  light: 'extension/images/light/transform.svg',
  dark: 'extension/images/dark/transform.svg',
};

/**
 * Tracks commands that should be hidden from the VSCode UI and not displayed in
 * the command palette
 */
const HIDDEN_COMMAND: { [key: string]: any } = {};
HIDDEN_COMMAND[IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING] = true;
HIDDEN_COMMAND[IDL_COMMANDS.CODE.FIX_PROBLEM] = true;
HIDDEN_COMMAND[IDL_COMMANDS.DOCS.OPEN_LINK] = true;
HIDDEN_COMMAND[IDL_COMMANDS.NOTEBOOKS.HELP_AS_NOTEBOOK] = true;
HIDDEN_COMMAND[IDL_COMMANDS.WEBVIEW.START] = true;

/**
 * Map our command name to the translation which should match
 * exactly our command name
 */
function TranslationFromCommand(name: string) {
  return `%commands.${name}%`;
}

/**
 * Map our command name to the translation which should match
 * exactly our command name
 */
function TranslationErrorFromCommand(name: string) {
  return `%commands.errors.${name.substring(IDL_LANGUAGE_NAME.length + 1)}%`;
}

/**
 * Processes the commands for our package.json file to make sure we are all kosher and
 * address any problems that we can.
 *
 * Builds and includes the command section in the package.json and adds some activation events
 */
export function ProcessCommands(packageJSON: IPackageJSON, nls: IPackageNLS) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // get menu
  if (!('menus' in contrib)) {
    contrib['menus'] = {};
  }
  const menus = contrib['menus'];

  // get command menu
  if (!('commandPalette' in menus)) {
    menus['commandPalette'] = [];
  }
  const commandMenus = menus['commandPalette'];

  // get all of our commands
  let allCommands: string[] = [];

  // combine all commands
  const keys = Object.keys(IDL_COMMANDS);
  for (let i = 0; i < keys.length; i++) {
    allCommands = allCommands.concat(
      Object.values(Object.values(IDL_COMMANDS[keys[i]]))
    );
  }

  // sort
  allCommands = allCommands.sort();

  // track command information
  const commandInfo: ICommand[] = [];

  // process each command
  for (let i = 0; i < allCommands.length; i++) {
    const command = allCommands[i];

    // get translation key
    const tKey = TranslationFromCommand(command);

    // get the error key
    const eKey = TranslationErrorFromCommand(command);

    // verify our translation
    if (!VerifyNLS(tKey, nls)) {
      throw new Error(
        `Command "${command}" is missing a translation key of "${tKey}"`
      );
    }
    if (!VerifyNLS(eKey, nls)) {
      throw new Error(
        `Command "${command}" is missing a translation key of "${eKey}"`
      );
    }

    /** Build command JSON */
    const add = { command, title: tKey };

    // check if we hve an icon to save or not
    if (command in COMMAND_ICONS) {
      // get icon
      const icon = COMMAND_ICONS[command];

      // make sure icons exist
      if (!existsSync(join(process.cwd(), icon.light))) {
        throw new Error(
          `Command "${command}" is missing the "light" icon from COMMAND_ICONS`
        );
      }
      if (!existsSync(join(process.cwd(), icon.dark))) {
        throw new Error(
          `Command "${command}" is missing the "light" icon from COMMAND_ICONS`
        );
      }

      // add icon
      add['icon'] = icon;
    }

    // check if we need to hide it from the palette
    if (command in HIDDEN_COMMAND) {
      commandMenus.push({ command, when: 'false' });
    }

    // save command
    commandInfo.push(add);

    // not needed per https://code.visualstudio.com/updates/v1_74#_extension-authoring
    // packageJSON['activationEvents'].push(`onCommand:${command}`);
  }

  // save our commands
  contrib['commands'] = commandInfo;
}
