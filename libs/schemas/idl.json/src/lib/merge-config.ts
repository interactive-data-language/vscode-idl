import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerInputOptions,
  IAssemblerOptions,
} from '@idl/assembling/config';
import * as merge from 'deepmerge';

/**
 * Merges user-specified configuration values with defaults to make
 * sure all parameters are set
 */
export function MergeConfig<T extends FormatterType>(
  parsed: Partial<IAssemblerInputOptions<T>>
): IAssemblerOptions<T> {
  // merge with our defaults
  // dont worry about the specific formatting options as those
  // should be handled withing each formatter (i.e. the should specify their options)
  // as default
  return merge(DEFAULT_ASSEMBLER_OPTIONS, parsed);
}
