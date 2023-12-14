import { CancellationToken } from '@idl/cancellation-tokens';
import { SemanticTokens } from 'vscode-languageserver';

import {
  GetParsedPROCode,
  PENDING_PRO_CODE,
} from '../get-parsed/get-parsed-pro-code';
import { IDLIndex } from '../idl-index.class';

/**
 * Get the semantic tokens for a file
 */
export async function GetCodeSemanticTokens(
  index: IDLIndex,
  file: string,
  code: string | string[],
  token = new CancellationToken()
): Promise<SemanticTokens> {
  switch (true) {
    /**
     * Check if it is pending
     */
    case file in PENDING_PRO_CODE:
      return (await PENDING_PRO_CODE[file].promise).semantic;

    /**
     * Check if it is in our lookup
     */
    case index.tokensByFile.has(file):
      return index.tokensByFile.semantic(file);

    /**
     * Parse to get the outline
     */
    default:
      return (await GetParsedPROCode(index, file, code, token)).semantic;
  }
}
