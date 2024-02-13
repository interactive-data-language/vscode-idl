import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IDLIndex } from '@idl/parsing/index';

import { CURRENT_CONFIG } from '../docs-exporter';

/**
 * Formats code from our docs
 */
export async function FormatDocsCode(index: IDLIndex, code: string) {
  await index.removeFile('docs_file.pro', false);

  const parsed = await index.getParsedProCode(
    'docs_file.pro',
    code,
    new CancellationToken(),
    {
      isNotebook: true,
      postProcess: true,
      changeDetection: false,
      full: true,
    }
  );

  // attempt to format
  let formatted = Assembler(parsed, new CancellationToken(), {
    ...CURRENT_CONFIG,
    autoFix: false,
    autoDoc: false,
    // vanilla: true,
  });

  // remove extra end if we have it
  if (formatted === undefined) {
    formatted = code;
  }

  // return if we could format or not
  return formatted;
}
