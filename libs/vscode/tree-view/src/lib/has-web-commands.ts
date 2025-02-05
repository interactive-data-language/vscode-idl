import { IDL_WEB_COMMANDS } from '@idl/shared/extension';

import { IChild } from './idl-tree-view.interface';

/**
 * Filter web commands
 */
export function FilterWebCommands(buttons: IChild[]) {
  return buttons.filter((button) => button.commandName in IDL_WEB_COMMANDS);
}

/**
 * Check if we have web commands
 */
export function HasWebCommands(buttons: IChild[]) {
  return FilterWebCommands(buttons).length > 0;
}
