import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';

import { ConditionalLineNumberIncrement } from './conditional-line-number-increment';
import { IncrementLineNumbers } from './increment-line-numbers';
import { IAddCodeToSyntaxTreeOptions } from './insert-syntax-tree.interface';

/**
 * Inserts new code an existing syntax tree
 */
export function AddCodeToSyntaxTree(options: IAddCodeToSyntaxTreeOptions) {
  // increment lines for entire syntax tree
  ConditionalLineNumberIncrement(
    options.parsed.tree,
    options.lineStart,
    options.insertCode.length
  );

  const add = GenerateCodeToInsert(options.insertCode, options.lineStart);

  // insert tokens
  options.addTo.splice(options.idxInsert, 0, ...add);
}

/**
 * Generates code to insert into a syntax tree, accounting for the line it should start on
 */
export function GenerateCodeToInsert(
  code: string | string[],
  lineStart: number
) {
  // parse code and get our syntax tree
  const add = Parser(code, new CancellationToken()).tree;

  // bump line numbers for new code to start at the right place
  IncrementLineNumbers(add, lineStart);

  return add;
}
