import { IDL_LSP_LOG } from '@idl/logger';
import { GetFSPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  Definition,
  TextDocumentPositionParams,
} from 'vscode-languageserver/node';

import { IDL_INDEX } from '../../file-management/initialize-file-manager';
import { GetFileStrings } from '../../helpers/get-file-strings';
import { URIFromFSPath } from '../../helpers/uri-from-fspath';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';

/**
 * Get the location of a tokens's definition
 */
export async function GetTokenDefinitionLocation(
  params: TextDocumentPositionParams
): Promise<Definition> {
  // get the path to the file to properly save
  const fsPath = GetFSPath(params.textDocument.uri);

  // do nothing
  if (!IDL_INDEX.isPROCode(fsPath)) {
    return undefined;
  }

  // attempt to get the definition of our token
  const def = await IDL_INDEX.getTokenDef(
    fsPath,
    await GetFileStrings(params.textDocument.uri),
    params.position
  );

  // verify defined
  if (def !== undefined) {
    // verify we have a file location
    if (def.file !== undefined) {
      def.pos;
      return {
        uri: URIFromFSPath(def.file).toString(),
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
