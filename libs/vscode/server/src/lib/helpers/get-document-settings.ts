import { _Connection } from 'vscode-languageserver/node';

import { CAPABILITIES } from '../capabilities.interface';
import {
  DOCUMENT_SETTINGS,
  GLOBAL_SERVER_SETTINGS,
} from '../initialize-server';
import { IServerSettings } from '../settings.interface';

/**
 * Gets document settings for a specific file
 */
export function GetDocumentSettings(
  connection: _Connection,
  uri: string
): Thenable<IServerSettings> {
  if (!CAPABILITIES.configuration) {
    return Promise.resolve(GLOBAL_SERVER_SETTINGS);
  }

  // attempt to get our settings
  let result = DOCUMENT_SETTINGS.get(uri);

  // fetch config if we dont have it
  if (!result) {
    result = connection.workspace.getConfiguration({
      scopeUri: uri,
      section: 'IDLLanguageServer',
    });

    // save value
    DOCUMENT_SETTINGS.set(uri, result);
  }

  return result;
}
