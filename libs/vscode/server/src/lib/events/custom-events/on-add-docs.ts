import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IAddDocsMessagePayload } from '@idl/vscode/events/messages';
import { WorkspaceChange } from 'vscode-languageserver/node';
import { URI } from 'vscode-uri';

import { GetFileStringsFromFSPath } from '../../helpers/get-file-strings';
import {
  IDL_LANGUAGE_SERVER_LOGGER,
  SERVER_CONNECTION,
} from '../../initialize-server';
import { DOCUMENT_MANAGER, IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to handle adding docs to a file
 *
 * @param event The event from VSCode
 */
export const ON_ADD_DOCS = async (event: IAddDocsMessagePayload) => {
  await SERVER_INITIALIZED;
  try {
    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Add docs to file', event],
    });

    /** Path to file on disk */
    const file = event.file;

    // do nothing
    if (!IDL_INDEX.isPROCode(file)) {
      return undefined;
    }

    // get the tokens for our file
    const tokens = await IDL_INDEX.getParsedProCode(
      file,
      await GetFileStringsFromFSPath(file),
      new CancellationToken()
    );

    // format
    const formatted = Assembler(tokens, new CancellationToken(), {
      autoDoc: true,
      styleAndFormat: false,
      autoFix: false,
    });

    // check if we couldnt format
    if (formatted === undefined) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'warn',
        content: [
          IDL_TRANSLATION.lsp.events.onDocumentFormattingProblemCode,
          file,
        ],
        alert: IDL_TRANSLATION.lsp.events.onDocumentFormattingProblemCode,
        alertMeta: {
          file,
        },
      });
      return;
    }

    /** Get VSCode URI for file */
    const uri = URI.file(file).toString();

    // create workspace change for file
    const change = new WorkspaceChange();

    // get the text document so we can get the version
    const doc = DOCUMENT_MANAGER.get(uri);

    // create edits for our file
    const edits = change.getTextEditChange({
      uri: uri,
      version: doc.version,
    });

    // replace content of editor
    edits.replace(
      {
        start: { line: 0, character: 0 },
        end: { line: Number.MAX_VALUE, character: Number.MAX_VALUE },
      },
      formatted
    );

    // sync our file changes
    await SERVER_CONNECTION.workspace.applyEdit(change.edit);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to add docs to file', err],
      alert: IDL_TRANSLATION.lsp.events.onAddDocs,
    });
  }

  /**
   * Actual response should be TextEdit[] which is f-ing stupid. Extremely complicated
   * and makes no sense to work with.
   *
   * Just write to disk and avoid excessive complexity.
   */
  return null;
};
