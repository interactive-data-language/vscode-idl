import { CancellationToken } from '@idl/cancellation-tokens';

import { Parser } from '../parser';
import { IAddCodeToSyntaxTreeOptions } from './add-code-to-syntax-tree.interface';
import { ConditionalLineNumberIncrement } from './conditional-line-number-increment';
import { IncrementLineNumbers } from './increment-line-numbers';

/**
 * Generates code to insert into a syntax tree, accounting for the line it should start on
 */
export function GenerateCodeToInsert(
  code: string | string[],
  lineStart: number
) {
  // parse code and get our syntax tree
  const add = Parser(code, new CancellationToken(), { onlyParse: true }).tree;

  // bump line numbers for new code to start at the right place
  IncrementLineNumbers(add, lineStart);

  return add;
}

/**
 * Inserts new code an existing syntax tree
 */
export function AddCodeToSyntaxTree(options: IAddCodeToSyntaxTreeOptions) {
  // increment lines for entire syntax tree
  ConditionalLineNumberIncrement(
    options.tree,
    options.lineStart,
    options.insertCode.length
  );

  const add = GenerateCodeToInsert(options.insertCode, options.lineStart);

  // insert tokens
  options.addTo.splice(options.idxInsert, 0, ...add);
}
