import { FormatterType, IAssemblerInputOptions } from '@idl/assembling/config';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IDLIndex } from '@idl/parsing/index';

import { Assembler } from './assembler';

/**
 * Formats PRO code using our formatting options
 */
export async function AssembleWithIndex<T extends FormatterType>(
  index: IDLIndex,
  file: string,
  code: string | string[],
  cancel: CancellationToken,
  formatting?: Partial<IAssemblerInputOptions<T>>
): Promise<string | undefined> {
  // get the tokens for our file
  const parsed = await index.getParsedProCode(file, code, cancel);

  // format and return
  return Assembler(parsed, cancel, formatting);
}
