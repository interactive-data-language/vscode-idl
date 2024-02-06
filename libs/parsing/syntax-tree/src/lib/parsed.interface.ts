import { IDisabledProblems, SyntaxProblems } from '@idl/parsing/problem-codes';
import { IFoundTokens } from '@idl/parsing/tokenizer';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';
import { DocumentSymbol, SemanticTokens } from 'vscode-languageserver';

import { SyntaxTree } from './branches.interface';
import {
  DEFAULT_USES_THESE_GLOBAL_TOKEN,
  UsesTheseGlobalTokens,
} from './build-syntax-tree.interface';
import { ILocalTokens } from './populators/populate-local.interface';

/**
 * Data structure for parsed code
 */
export interface IParsed extends IFoundTokens {
  /**
   * Checksum for code, used for change detection
   */
  checksum: string;
  /**
   * Flag indicating if our parsed content has detail added to
   * our tokens which is used for types.
   */
  hasDetail: boolean;
  /**
   * If we have set a token cache or not
   */
  hasCache: boolean;
  /** What problems are disabled? */
  disabledProblems: IDisabledProblems;
  /** Problems found within code from basic parsing */
  parseProblems: SyntaxProblems;
  /** Problems from post processing (type errors) which get reset every time we post-process */
  postProcessProblems: SyntaxProblems;
  /** Tokens converted into syntax tree */
  tree: SyntaxTree;
  /** Global tokens that we want to find in other places */
  global: GlobalTokens;
  /** Local tokens that we have found */
  local: ILocalTokens;
  /** Compile options by routine */
  compile: ICompileOptions;
  /** Global constructs that we call (for change detection) */
  uses: UsesTheseGlobalTokens;
  /** The outline of our current PRO code */
  outline: DocumentSymbol[];
  /** Semantic tokens that we highlight */
  semantic: SemanticTokens;
}

/**
 * Default (reference) object for use in processing our tree
 */
export const DEFAULT_PARSED: IParsed = {
  checksum: '',
  hasDetail: false,
  hasCache: false,
  tokens: [],
  text: [],
  lines: 0,
  disabledProblems: {
    all: false,
    forFile: [],
    forLines: {},
  },
  parseProblems: [],
  postProcessProblems: [],
  tree: [],
  global: [],
  local: {
    func: {},
    pro: {},
    main: {},
  },
  compile: {
    func: {},
    pro: {},
    main: [],
  },
  uses: DEFAULT_USES_THESE_GLOBAL_TOKEN,
  outline: [],
  semantic: { data: [] },
};
