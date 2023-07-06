import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our debugging tab
 */
export const DEBUGGING_BUTTONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.debugging.start.name,
    description: IDL_TRANSLATION.idl.tree.children.debugging.start.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.DEBUG.START,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.debugging.compile.name,
    description:
      IDL_TRANSLATION.idl.tree.children.debugging.compile.description,
    icon: 'settings.svg',
    commandName: IDL_COMMANDS.DEBUG.COMPILE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.debugging.run.name,
    description: IDL_TRANSLATION.idl.tree.children.debugging.run.description,
    icon: 'file-play.svg',
    commandName: IDL_COMMANDS.DEBUG.RUN,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.debugging.execute.name,
    description:
      IDL_TRANSLATION.idl.tree.children.debugging.execute.description,
    icon: 'file-batch.svg',
    commandName: IDL_COMMANDS.DEBUG.EXECUTE_BATCH,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.debugging.reset.name,
    description: IDL_TRANSLATION.idl.tree.children.debugging.reset.description,
    icon: 'renew.svg',
    commandName: IDL_COMMANDS.DEBUG.RESET,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.debugging.startProfiling.name,
    description:
      IDL_TRANSLATION.idl.tree.children.debugging.startProfiling.description,
    icon: 'timeline.svg',
    commandName: IDL_COMMANDS.DEBUG.PROFILER_START,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.debugging.stopProfiling.name,
    description:
      IDL_TRANSLATION.idl.tree.children.debugging.stopProfiling.description,
    icon: 'stop.svg',
    commandName: IDL_COMMANDS.DEBUG.PROFILER_STOP,
  },
];
