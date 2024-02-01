import {
  IDL_COMMANDS,
  IDL_NOTEBOOK_CONTROLLER_TRANSLATION_NAME,
  IDL_NOTEBOOK_EXTENSION,
  IDL_NOTEBOOK_LANGUAGE_NAME,
  IDL_NOTEBOOK_RENDERER_NAME,
} from '@idl/shared';
import { IDL_NOTEBOOK_MIME_TYPE } from '@idl/types/notebooks';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

/**
 * When we have a notebook open, the toolbar we add
 */
export const NOTEBOOK_TOOLBAR = [
  {
    command: IDL_COMMANDS.NOTEBOOKS.RESET,
    group: 'status',
    when: `resourceExtname == ${IDL_NOTEBOOK_EXTENSION}`,
  },
  {
    command: IDL_COMMANDS.NOTEBOOKS.STOP,
    group: 'status',
    when: `resourceExtname == ${IDL_NOTEBOOK_EXTENSION}`,
  },
  {
    command: IDL_COMMANDS.NOTEBOOKS.NOTEBOOK_TO_PRO_CODE,
    group: 'status',
    when: `resourceExtname == ${IDL_NOTEBOOK_EXTENSION}`,
  },
  {
    command: IDL_COMMANDS.NOTEBOOKS.CONVERT_TO_PDF,
    group: 'status',
    when: `resourceExtname == ${IDL_NOTEBOOK_EXTENSION}`,
  },
];

/**
 * Adds config for notebooks to our file
 */
export function ProcessNotebooks(packageJSON: IPackageJSON, nls: IPackageNLS) {
  const ourNotebook = {
    type: IDL_NOTEBOOK_LANGUAGE_NAME,
    displayName: '%notebooks.title%',
    selector: [
      {
        filenamePattern: `*${IDL_NOTEBOOK_EXTENSION}`,
      },
    ],
  };

  if (!VerifyNLS(ourNotebook.displayName, nls)) {
    throw new Error('Notebook displayName not in translation');
  }

  if (!VerifyNLS(IDL_NOTEBOOK_CONTROLLER_TRANSLATION_NAME, nls)) {
    throw new Error(
      'IDL_NOTEBOOK_CONTROLLER_TRANSLATION_NAME not in translation'
    );
  }

  // add to contribution point
  const contrib = packageJSON['contributes'];
  contrib['notebooks'] = [ourNotebook];

  // get menu to add debug icons
  if (!('menus' in contrib)) {
    contrib['menus'] = {};
  }
  const menus = contrib['menus'];
  menus['notebook/toolbar'] = NOTEBOOK_TOOLBAR;

  // add in notebook renderer
  contrib['notebookRenderer'] = [
    {
      id: IDL_NOTEBOOK_RENDERER_NAME,
      displayName: '%notebooks.renderer%',
      entrypoint: './dist/apps/notebook/renderer/src/main.js',
      mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
      requiresMessaging: 'optional',
    },
  ];

  if (!VerifyNLS(contrib.notebookRenderer[0].displayName, nls)) {
    throw new Error('Notebook renderer displayName not in translation');
  }
}
