import { IDL_LSP_LOG } from '@idl/logger';
import { IDLFileHelper } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  Definition,
  TextDocumentPositionParams,
} from 'vscode-languageserver/node';

import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { URIFromIDLIndexFile } from '../../helpers/uri-from-idl-index-file';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Get the location of a tokens's definition
 */
export async function GetTokenDefinitionLocation(
  params: TextDocumentPositionParams
): Promise<Definition> {
  /**
   * Resolve the fspath to our cell and retrieve code
   */
  const info = await ResolveFSPathAndCodeForURI(params.textDocument.uri);

  // return if nothing found
  if (info === undefined) {
    return undefined;
  }

  // return if not a file we can process
  if (
    !(
      IDLFileHelper.isPROCode(info.fsPath) ||
      IDLFileHelper.isIDLNotebookFile(info.fsPath)
    )
  ) {
    return undefined;
  }

  // attempt to get the definition of our token
  const def = await IDL_INDEX.getTokenDef(
    info.fsPath,
    info.code,
    params.position
  );

  // remove from our main thread lookup
  IDL_INDEX.tokensByFile.remove(info.fsPath);

  // verify defined
  if (def !== undefined) {
    // verify we have a file location
    if (def.file !== undefined) {
      return {
        uri: URIFromIDLIndexFile(def.file),
        range: {
          start: { line: def.pos[0], character: def.pos[1] },
          end: { line: def.pos[0], character: def.pos[1] + def.pos[2] },
        },
      };
    }
  }

  return undefined;
}

/**
 * Event handler for going to a symbol's definition
 */
export const ON_DEFINITION = async (
  params: TextDocumentPositionParams
): Promise<Definition> => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Definition request', params],
    });

    return await GetTokenDefinitionLocation(params);
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to onDefinitions request', err],
      alert: IDL_TRANSLATION.lsp.events.onDefinition,
    });
    return undefined;
  }
};
