import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { VSCODE_COMMANDS } from '@idl/vscode/shared';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our code actions
 */
export const NOTEBOOK_ACTIONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.notebooks.newNotebook.name,
    description:
      IDL_TRANSLATION.idl.tree.children.notebooks.newNotebook.description,
    icon: 'add-box.svg',
    commandName: IDL_COMMANDS.NOTEBOOKS.NEW_NOTEBOOK,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.notebooks.notebookToProCode.name,
    description:
      IDL_TRANSLATION.idl.tree.children.notebooks.notebookToProCode.description,
    icon: 'transform.svg',
    commandName: IDL_COMMANDS.NOTEBOOKS.NOTEBOOK_TO_PRO_CODE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.notebooks.formatNotebooks.name,
    description:
      IDL_TRANSLATION.idl.tree.children.notebooks.formatNotebooks.description,
    icon: 'heap-snapshot-large.svg',
    commandName: VSCODE_COMMANDS.FORMAT_NOTEBOOK,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.notebooks.notebookToPDF.name,
    description:
      IDL_TRANSLATION.idl.tree.children.notebooks.notebookToPDF.description,
    icon: 'pdf.svg',
    commandName: IDL_COMMANDS.NOTEBOOKS.CONVERT_TO_PDF,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.notebooks.openIDLExample.name,
    description:
      IDL_TRANSLATION.idl.tree.children.notebooks.openIDLExample.description,
    icon: 'idlicon.svg',
    commandName: IDL_COMMANDS.NOTEBOOKS.OPEN_IDL_EXAMPLE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.notebooks.openENVIExample.name,
    description:
      IDL_TRANSLATION.idl.tree.children.notebooks.openENVIExample.description,
    icon: 'enviicon.svg',
    commandName: IDL_COMMANDS.NOTEBOOKS.OPEN_ENVI_EXAMPLE,
  },
];
