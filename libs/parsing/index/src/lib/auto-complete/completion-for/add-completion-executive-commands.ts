import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * All executive commands
 */
const EXECUTIVE_COMMANDS = [
  '.compile',
  '.continue',
  '.edit',
  '.full_reset_session',
  '.go',
  '.out',
  '.reset_session',
  'return',
  // '.rnew',
  // '.run',
  '.skip',
  '.step',
  '.stepover',
  '.trace',
];

/**
 * Adds completion for executive commands
 */
export function AddCompletionExecutiveCommands(
  complete: CompletionItem[],
  formatting: IAssemblerOptions<FormatterType>
) {
  for (let i = 0; i < EXECUTIVE_COMMANDS.length; i++) {
    complete.push({
      label: AdjustCase(EXECUTIVE_COMMANDS[i], formatting.style.control),
      kind: CompletionItemKind.Constructor,
      sortText: SORT_PRIORITY.EXECUTIVE_COMMANDS,
    });
  }
}
