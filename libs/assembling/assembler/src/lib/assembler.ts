import {
  CanAssemble,
  FormatterType,
  IAssemblerInputOptions,
} from '@idl/assembling/config';
import { ApplyFixers } from '@idl/assembling/fixers';
import { ApplyFormatter } from '@idl/assembling/formatters';
import { ApplyStyle, ReplaceRoutineDocs } from '@idl/assembling/styles';
import { SaveGlobalDisplayNames } from '@idl/parsing/index';
import { IParsed } from '@idl/parsing/syntax-tree';
import { MergeConfig } from '@idl/schemas/idl.json';

import { Combiner } from './combiner/combiner';
import { CombinerBasic } from './combiner/combiner-basic';

/**
 * Assembles code back together and applies formatting.
 *
 * DO NOT USE THE TOKENIZED CODE AFTER THIS POINT as, depending on
 * your settings, it will be irreversibly changed. Automatically fixing
 * problems and adding documentation will directly change the syntax tree
 * and, because it is an object reference, you can access those changes
 * wherever this is called from.
 *
 * We won't be copying the syntax tree because that would add overhead and
 * we want it to be fast. Additionally, you need to parse the code again
 * to get the foll extent of the updates with changes and accurate information
 * on any problems that may still exist.
 */
export function Assembler<T extends FormatterType>(
  parsed: IParsed,
  options?: Partial<IAssemblerInputOptions<T>>
): string | undefined {
  // verify that we can format
  if (!CanAssemble(parsed.parseProblems)) {
    return undefined;
  }

  // save/update global display names
  SaveGlobalDisplayNames(parsed.global);

  /** Default-merged configuration to use */
  const useOptions = MergeConfig<T>(options);

  // if we can fix problems, lets fix them
  if (useOptions.autoFix) {
    ApplyFixers(parsed);
  }

  // style and format code
  if (useOptions.styleAndFormat) {
    // apply styling
    ApplyStyle(parsed, useOptions.style);

    // apply formatting
    ApplyFormatter(parsed, useOptions.formatter);
  }

  // check if we want to format and create our docs
  if (useOptions.autoDoc) {
    ReplaceRoutineDocs(parsed, useOptions.style);
  }

  // init strings
  let strings: string[] = [];

  // check how we combine our strings back together
  switch (useOptions.styleAndFormat) {
    case false:
      strings = CombinerBasic(parsed);
      break;
    default:
      strings = Combiner(parsed, useOptions);
      break;
  }

  // combine strings and return
  return strings.join(useOptions?.eol === 'crlf' ? '\r\n' : '\n');
}
