import { IDL_COMMANDS, IDL_LANGUAGE_NAME } from '@idl/shared';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

export const DEBUGGERS = [
  {
    type: IDL_LANGUAGE_NAME,
    label: '%debugger.idl.label%',
    runtime: 'node',
    configurationAttributes: {
      launch: {
        required: ['name', 'type', 'request'],
        properties: {},
      },
    },
    initialConfigurations: [
      {
        type: IDL_LANGUAGE_NAME,
        name: '%debugger.idl.name%',
        request: 'launch',
      },
    ],
    configurationSnippets: [
      {
        label: '%debugger.idl.label%',
        description: '%debugger.idl.description%',
        body: {
          type: IDL_LANGUAGE_NAME,
          name: '%debugger.idl.name%',
          request: 'launch',
        },
      },
    ],
  },
];

export const BREAKPOINTS = [
  {
    language: IDL_LANGUAGE_NAME,
  },
];

export const DEBUG_TOOLBAR = [
  {
    command: IDL_COMMANDS.DEBUG.COMPILE,
    group: 'navigation',
    when: `debugType == ${IDL_LANGUAGE_NAME}`,
  },
  {
    command: IDL_COMMANDS.DEBUG.RUN,
    group: 'navigation',
    when: `debugType == ${IDL_LANGUAGE_NAME}`,
  },
  {
    command: IDL_COMMANDS.DEBUG.RESET,
    group: 'navigation',
    when: `debugType == ${IDL_LANGUAGE_NAME}`,
  },
];

/**
 * Updates the package.json file for our grammars which controls syntax highlighting
 */
export function ProcessDebugging(packageJSON: IPackageJSON, nls: IPackageNLS) {
  packageJSON['activationEvents'].push('onDebug');

  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each debugger
  for (let i = 0; i < DEBUGGERS.length; i++) {
    const debug = DEBUGGERS[i];

    // verify label
    if (!VerifyNLS(debug.label, nls)) {
      throw new Error('Debug "label" missing from translation');
    }

    // process our configs
    const initialConfigs = debug.initialConfigurations;
    for (let j = 0; j < initialConfigs.length; j++) {
      const config = initialConfigs[j];
      // verify label
      if (!VerifyNLS(config.name, nls)) {
        throw new Error(
          'Initial debug configuration at index ${j} has "name" missing from translation'
        );
      }
    }

    // process our configs
    const configSnippets = debug.configurationSnippets;
    for (let j = 0; j < configSnippets.length; j++) {
      const snippet = configSnippets[j];
      // verify label
      if (!VerifyNLS(snippet.label, nls)) {
        throw new Error(
          'Config snippet at index ${j} has "label" missing from translation'
        );
      }

      // verify label
      if (!VerifyNLS(snippet.description, nls)) {
        throw new Error(
          'Config snippet at index ${j} has "description" missing from translation'
        );
      }

      // verify label
      if (!VerifyNLS(snippet.body.name, nls)) {
        throw new Error(
          'Config snippet at index ${j} has "body.name" missing from translation'
        );
      }
    }
  }

  // verify that each debug icon also has an icon from the command
  const commands = contrib['commands'];
  for (let i = 0; i < DEBUG_TOOLBAR.length; i++) {
    const icon = DEBUG_TOOLBAR[i];

    // find matching command
    let match = undefined;
    for (let j = 0; j < commands.length; j++) {
      if (commands[j].command === icon.command) {
        match = commands[j];
      }
    }

    // stop if no matching command found
    if (match === undefined) {
      throw new Error(
        'debug icon at index ${i} has no matching command in package.json'
      );
    }

    // make sure we have icon information
    if (match.icon === undefined) {
      throw new Error(
        'command for debug icon at index ${i} has no icon information in package.json'
      );
    }
  }

  // get menu to add debug icons
  if (!('menus' in contrib)) {
    contrib['menus'] = {};
  }
  const menus = contrib['menus'];
  menus['debug/toolBar'] = DEBUG_TOOLBAR;

  // save changes
  contrib['debuggers'] = DEBUGGERS;
  contrib['breakpoints'] = BREAKPOINTS;
}
