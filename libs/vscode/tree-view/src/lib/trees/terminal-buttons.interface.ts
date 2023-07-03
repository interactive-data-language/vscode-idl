import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our terminal tab
 */
export const TERMINAL_BUTTONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.openTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.openTerminal.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TERMINAL.START,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.compileTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.compileTerminal.description,
    icon: 'settings.svg',
    commandName: IDL_COMMANDS.TERMINAL.COMPILE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.runTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.runTerminal.description,
    icon: 'file-play.svg',
    commandName: IDL_COMMANDS.TERMINAL.RUN,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.executeTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.executeTerminal.description,
    icon: 'file-batch.svg',
    commandName: IDL_COMMANDS.TERMINAL.EXECUTE_BATCH,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.resetTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.resetTerminal.description,
    icon: 'renew.svg',
    commandName: IDL_COMMANDS.TERMINAL.RESET,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.stopTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.stopTerminal.description,
    icon: 'stop.svg',
    commandName: IDL_COMMANDS.TERMINAL.STOP,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.continueTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.continueTerminal.description,
    icon: 'play.svg',
    commandName: IDL_COMMANDS.TERMINAL.CONTINUE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.stepInTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.stepInTerminal.description,
    icon: 'arrow-down.svg',
    commandName: IDL_COMMANDS.TERMINAL.STEP_IN,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.stepOverTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.stepOverTerminal.description,
    icon: 'arrow-over.svg',
    commandName: IDL_COMMANDS.TERMINAL.STEP_OVER,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.stepOutTerminal.name,
    description: IDL_TRANSLATION.idl.tree.children.stepOutTerminal.description,
    icon: 'arrow-up.svg',
    commandName: IDL_COMMANDS.TERMINAL.STEP_OUT,
  },
];
