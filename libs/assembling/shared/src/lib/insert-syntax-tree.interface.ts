import { IParsed, SyntaxTree } from '@idl/parsing/syntax-tree';

/**
 * When adding code into an existing syntax tree, the parameters
 * that you need to specify
 */
export interface IAddCodeToSyntaxTreeOptions {
  /** The syntax tree we are adding to, can be anything */
  addTo: SyntaxTree;
  /** The index where we insert the new */
  idxInsert: number;
  /** IDL code that we insert */
  insertCode: string[];
  /** The line that our code changes start at */
  lineStart: number;
  /** Original parsed code */
  parsed: IParsed;
}
