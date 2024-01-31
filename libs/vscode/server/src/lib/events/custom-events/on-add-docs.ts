import { DocumentFormattingParams } from 'vscode-languageserver/node';

import { ON_DOCUMENT_FORMATTING } from '../documents/on-document-formatting';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle adding docs to a file
 *
 * @param event The event from VSCode
 */
export const ON_ADD_DOCS = async (event: DocumentFormattingParams) => {
  await SERVER_INITIALIZED;

  // call document formatting with custom parameters for formatting
  return await ON_DOCUMENT_FORMATTING(event, {
    autoDoc: true,
    styleAndFormat: false,
    autoFix: false,
  });
};
