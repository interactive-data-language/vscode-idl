import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';

import { IChild } from '../idl-tree-view.interface';

/**
 * Buttons for our top-level tutorials (since we will have nested options)
 */
export const IDLTUTORIAL_ACTIONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.gettingStarted.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.gettingStarted.description,
    icon: 'post.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
  },

  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.description,
    icon: 'post.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.fileOperations.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.fileOperations.description,
    icon: 'post.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.notebooks.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.notebooks.description,
    icon: 'post.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
  },
];

/**
 * Getting started notebooks
 */
export const IDLTUTORIAL_GETTINGSTARTED: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.gettingStarted.children
      .runningInIDLNotebooks.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.gettingStarted.children
        .runningInIDLNotebooks.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: [
      'IDL Tutorials/Getting Started/01-Running IDL in Notebooks.idlnb',
    ],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.gettingStarted.children
      .navigatingTheGuide.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.gettingStarted.children
        .navigatingTheGuide.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: [
      'IDL Tutorials/Getting Started/02-Navigating the Guide.idlnb',
    ],
  },
];

/**
 * IDL basics notebooks
 */
export const IDLTUTORIAL_IDLBASICS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .whatIsIDL.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
        .whatIsIDL.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/00-What Is IDL.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .valuesTypesAndVariables.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
        .valuesTypesAndVariables.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: [
      'IDL Tutorials/IDL Basics/01-Values, Types, and Variables.idlnb',
    ],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .operators.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
        .operators.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/02-Operators.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .expressions.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
        .expressions.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/03-Expressions.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .idlSyntax.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
        .idlSyntax.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/04-IDL Syntax.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .casting.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children.casting
        .description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/05-Casting.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .conditionalExpressions.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
        .conditionalExpressions.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/06-Conditional Expressions.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .loops.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children.loops
        .description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/07-Loops.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .arrays.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children.arrays
        .description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/08-Arrays.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .strings.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children.strings
        .description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/09-Strings.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .functionsAndProcedures.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
        .functionsAndProcedures.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/10-Functions and Procedures.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
      .introToObjects.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.idlBasics.children
        .introToObjects.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/IDL Basics/11-Intro to Objects.idlnb'],
  },
];

/**
 * File operations notebooks
 */
export const IDLTUTORIAL_FILEOPERATIONS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.fileOperations.children
      .introToFileOperations.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.fileOperations.children
        .introToFileOperations.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: [
      'IDL Tutorials/File Operations/01-Intro to file operations.idlnb',
    ],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.fileOperations.children
      .readFiles.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.fileOperations.children
        .readFiles.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/File Operations/02-Read Files.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.fileOperations.children
      .writeFiles.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.fileOperations.children
        .writeFiles.description,
    icon: 'open-new.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['IDL Tutorials/File Operations/03-Write Files.idlnb'],
  },
];

/**
 * Tutorial notebooks
 */
export const IDLTUTORIAL_NOTEBOOKS: IChild[] = [
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.notebooks.children
      .quickIDL.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.notebooks.children.quickIDL
        .description,
    icon: 'idlicon.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['hello-world-idl.idlnb'],
  },
  {
    name: IDL_TRANSLATION.idl.tree.children.idlTutorials.notebooks.children
      .quickENVI.name,
    description:
      IDL_TRANSLATION.idl.tree.children.idlTutorials.notebooks.children
        .quickENVI.description,
    icon: 'enviicon.svg',
    commandName: IDL_COMMANDS.TUTORIALS.OPEN_IDL_TUTORIAL,
    commandArgs: ['hello-world-envi.idlnb'],
  },
];
