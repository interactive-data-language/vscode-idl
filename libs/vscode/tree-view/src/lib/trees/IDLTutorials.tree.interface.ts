import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our terminal tab
 */
export const IDLTUTORIAL_ACTIONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.testTutorial.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.testTutorial.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['01-IDL for beginners/02-IDL Basics/00-What Is IDL.idlnb'],
  },
];
