import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our terminal tab
 */
export const TERMINAL_BUTTONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.startTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.startTerminal.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TERMINAL.START,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.compileTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.compileTerminal.description,
    icon: 'settings.svg',
    commandName: IDL_COMMANDS.TERMINAL.COMPILE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.runTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.runTerminal.description,
    icon: 'file-play.svg',
    commandName: IDL_COMMANDS.TERMINAL.RUN,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.executeTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.executeTerminal.description,
    icon: 'file-batch.svg',
    commandName: IDL_COMMANDS.TERMINAL.EXECUTE_BATCH,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.resetTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.resetTerminal.description,
    icon: 'renew.svg',
    commandName: IDL_COMMANDS.TERMINAL.RESET,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.pauseTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.pauseTerminal.description,
    icon: 'pause.svg',
    commandName: IDL_COMMANDS.TERMINAL.PAUSE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.continueTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.continueTerminal.description,
    icon: 'play.svg',
    commandName: IDL_COMMANDS.TERMINAL.CONTINUE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.stepInTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.stepInTerminal.description,
    icon: 'arrow-down.svg',
    commandName: IDL_COMMANDS.TERMINAL.STEP_IN,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.stepOverTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.stepOverTerminal.description,
    icon: 'arrow-over.svg',
    commandName: IDL_COMMANDS.TERMINAL.STEP_OVER,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.terminal.stepOutTerminal.name,
    description:
      IDL_TRANSLATION.idl.tree.children.terminal.stepOutTerminal.description,
    icon: 'arrow-up.svg',
    commandName: IDL_COMMANDS.TERMINAL.STEP_OUT,
  },
];
