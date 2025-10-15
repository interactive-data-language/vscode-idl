import { IFoundTokens } from '@idl/tokenizer';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';
import { IDisabledProblems, SyntaxProblems } from '@idl/types/problem-codes';
import { PositionArray } from '@idl/types/tokenizer';
import copy from 'fast-copy';
import { DocumentSymbol, SemanticTokens } from 'vscode-languageserver';

import { SyntaxTree } from './branches.interface';
import {
  DEFAULT_USES_THESE_GLOBAL_TOKEN,
  UsesTheseGlobalTokens,
} from './build-syntax-tree.interface';
import {
  DEFAULT_LOCAL_TOKENS,
  ILocalTokens,
} from './populators/populate-local.interface';

/**
 * Type of parsed item that we have
 */
export type ParsedType = 'def' | 'notebook' | 'pro';

/**
 * Lightweight parsed response for advanced use cases
 */
export interface IParsedLightWeight {
  /** What problems are disabled? */
  disabledProblems: IDisabledProblems;
  /** Global tokens that we want to find in other places */
  global: GlobalTokens;
  /** Problems found within code from basic parsing */
  parseProblems: SyntaxProblems;
  /** Problems from post processing (type errors) which get reset every time we post-process */
  postProcessProblems: SyntaxProblems;
}

/**
 * Data structure for parsed code
 */
export interface IParsed extends IFoundTokens, IParsedLightWeight {
  /**
   * Checksum for code, used for change detection
   */
  checksum: string;
  /** Compile options by routine */
  compile: ICompileOptions;
  /**
   * If we have set a token cache or not
   */
  hasCache: boolean;
  /**
   * Flag indicating if our parsed content has detail added to
   * our tokens which is used for types.
   */
  hasDetail: boolean;
  /** Local tokens that we have found */
  local: ILocalTokens;
  /** The outline of our current PRO code */
  outline: DocumentSymbol[];
  /** Semantic tokens that we highlight */
  semantic: {
    /** Procedures that are variables (for notebook parsing) */
    notProcedure: PositionArray[];
    /** Built semantic tokens */
    built: SemanticTokens;
  };
  /** Tokens converted into syntax tree */
  tree: SyntaxTree;
  /**
   * type of parsed code
   */
  type: ParsedType;
  /** Global constructs that we call (for change detection) */
  uses: UsesTheseGlobalTokens;
}

/**
 * Default (reference) object for use in processing our tree
 */
export const DEFAULT_PARSED: IParsed = {
  checksum: '',
  hasDetail: false,
  hasCache: false,
  type: 'pro',
  tokens: [],
  text: [],
  lines: 0,
  disabledProblems: {
    all: false,
    forFile: {},
    forLines: {},
  },
  parseProblems: [],
  postProcessProblems: [],
  tree: [],
  global: [],
  local: copy(DEFAULT_LOCAL_TOKENS),
  compile: {
    func: {},
    pro: {},
    main: [],
  },
  uses: DEFAULT_USES_THESE_GLOBAL_TOKEN,
  outline: [],
  semantic: { notProcedure: [], built: { data: [] } },
};
