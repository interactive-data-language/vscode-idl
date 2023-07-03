import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our code actions
 */
export const CODE_ACTIONS: IChild[] = [
  // {
  //   name: IDL_TRANSLATION.idl.tree.children.codeActions.initializeConfig.name,
  //   description:
  //     IDL_TRANSLATION.idl.tree.children.codeActions.initializeConfig
  //       .description,
  //   icon: 'folder-managed.svg',
  //   commandName: IDL_COMMANDS.CODE.INITIALIZE_CONFIG,
  // },
  {
    name: IDL_TRANSLATION.idl.tree.children.codeActions.addDocs.name,
    description:
      IDL_TRANSLATION.idl.tree.children.codeActions.addDocs.description,
    icon: 'quick-reference.svg',
    commandName: IDL_COMMANDS.CODE.ADD_DOCS_TO_FILE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.codeActions.formatFile.name,
    description:
      IDL_TRANSLATION.idl.tree.children.codeActions.formatFile.description,
    icon: 'heap-snapshot-large.svg',
    commandName: IDL_COMMANDS.CODE.FORMAT_FILE,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.codeActions.generateTask.name,
    description:
      IDL_TRANSLATION.idl.tree.children.codeActions.generateTask.description,
    icon: 'build.svg',
    commandName: IDL_COMMANDS.CODE.GENERATE_TASK,
  },
];
