import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IDLIndex } from '@idl/parsing/index';

import { Assembler } from './assembler';

/**
 * Formats PRO code using our formatting options
 */
export async function AssembleWithIndex(
  index: IDLIndex,
  file: string,
  code: string | string[],
  formatting: IAssemblerOptions<FormatterType>,
  cancel: CancellationToken
): Promise<string | undefined> {
  // get the tokens for our file
  const parsed = await index.getParsedProCode(file, code, cancel);

  // format and return
  return Assembler(parsed, cancel, formatting);
}
