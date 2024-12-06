import { FormatterType, IAssemblerInputOptions } from '@idl/assembling/config';
import { CancellationToken } from '@idl/cancellation-tokens';
import { GetParsedPROCode, IDLIndex } from '@idl/parsing/index';

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
  const parsed = await GetParsedPROCode(index, file, code, cancel);

  // get assembled code!
  const assembled = Assembler(parsed, cancel, formatting);

  // clean up cache since we much with the tree
  index.parsedCache.remove(file);

  // format and return
  return assembled;
}
