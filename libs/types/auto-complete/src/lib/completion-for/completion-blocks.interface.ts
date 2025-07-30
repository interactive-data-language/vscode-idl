import {
  LogicalCaseSwitchThenToken,
  LogicalElseToken,
  LogicalExpressionDefaultToken,
  LogicalIfToken,
  LogicalThenToken,
  TOKEN_NAMES,
} from '@idl/tokenizer';

/**
 * Auto-complete for block statements like if-then-begin
 */
export type BlockCompletion = 'blocks';

/**
 * Options for adding blocks on auto-complete
 */
export interface IBlockCompletionOptions {
  /** Text we display */
  label: string;
  /** Text we display */
  snippet: string[];
}

export type CompletionBlockTokens =
  | LogicalCaseSwitchThenToken
  | LogicalElseToken
  | LogicalExpressionDefaultToken
  | LogicalIfToken
  | LogicalThenToken;

type CompletionBlockTokenLookup = {
  [key in CompletionBlockTokens]?: any;
};

/** Which blocks support completion */
export const COMPLETION_BLOCKS: CompletionBlockTokenLookup = {};
COMPLETION_BLOCKS[TOKEN_NAMES.LOGICAL_IF] = undefined;
COMPLETION_BLOCKS[TOKEN_NAMES.LOGICAL_THEN] = undefined;
COMPLETION_BLOCKS[TOKEN_NAMES.LOGICAL_ELSE] = undefined;
COMPLETION_BLOCKS[TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN] = undefined;
COMPLETION_BLOCKS[TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT] = undefined;
