import { IDL_TRANSLATION } from '@idl/translation';
import { VSCODE_COMMANDS } from '@idl/vscode/shared';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our code actions
 */
export const NOTEBOOK_ACTIONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.notebooks.formatNotebooks.name,
    description:
      IDL_TRANSLATION.idl.tree.children.notebooks.formatNotebooks.description,
    icon: 'heap-snapshot-large.svg',
    commandName: VSCODE_COMMANDS.FORMAT_NOTEBOOK,
  },
  // {
  //   name: IDL_TRANSLATION.idl.tree.children.notebooks.openIDLExample.name,
  //   description:
  //     IDL_TRANSLATION.idl.tree.children.notebooks.openIDLExample.description,
  //   icon: 'idlicon.png',
  //   commandName: VSCODE_COMMANDS.FORMAT_NOTEBOOK,
  // },
  // {
  //   name: IDL_TRANSLATION.idl.tree.children.notebooks.openENVIExample.name,
  //   description:
  //     IDL_TRANSLATION.idl.tree.children.notebooks.openENVIExample.description,
  //   icon: 'idlicon.png',
  //   commandName: VSCODE_COMMANDS.FORMAT_NOTEBOOK,
  // },
];
