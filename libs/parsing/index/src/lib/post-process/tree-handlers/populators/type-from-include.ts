import { BasicCallback } from '@idl/parsing/syntax-tree';
import { IncludeToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';

import { GetVariables } from '../../../helpers/get-variables';
import { IncludeCache } from '../helpers/include-cache';
import { POPULATE_TYPE_HANDLER } from '../populate-type-handler';
import { PopulateTypeHandlerMeta } from '../populate-type-handler.interface';

/**
 * Skip first comma for these
 */
const SKIP_FIRST: { [key: string]: any } = {};
SKIP_FIRST[TOKEN_NAMES.CALL_PROCEDURE] = true;
SKIP_FIRST[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * Union type of call routine tokens
 */
export type ProcessToken = IncludeToken;

/**
 * Tokens that we are validating
 */
const TOKENS: ProcessToken[] = [TOKEN_NAMES.INCLUDE];

/**
 * Callback to validate that a keyword is correct
 */
const cb: BasicCallback<ProcessToken, PopulateTypeHandlerMeta> = (
  token,
  parsed,
  meta
) => {
  /**
   * Find our include file
   */
  const foundFile = meta.index.resolveInclude(token);

  // check if we have an unknown include
  if (foundFile === '') {
    return;
  }

  // return if our file we found is ourself
  if (foundFile === meta.file) {
    return;
  }

  /**
   * Get parsed file for include
   */
  const includeParsed = meta.index.tokensByFile.has(foundFile)
    ? meta.index.tokensByFile.get(foundFile)
    : IncludeCache(meta.index, foundFile);

  /**
   * Get tokens
   */
  const tokens = includeParsed.tree;

  /** Get the last token */
  const last = tokens[tokens.length - 1];

  /** Make sure it has a main level program */
  if (last?.name !== TOKEN_NAMES.MAIN_LEVEL) {
    return;
  }

  /**
   * Get variables
   */
  const includeVars = includeParsed.local.main;

  /**
   * Get current variables
   */
  const allVars = GetVariables(token, parsed);

  /**
   * Set all variables
   */
  const definedVars = Object.keys(includeVars);
  for (let i = 0; i < definedVars.length; i++) {
    /**
     * Handle our different cases for variable inheritance
     */
    switch (true) {
      /**
       * If we have a new variable that hasnt been found
       */
      case !(definedVars[i] in allVars):
        allVars[definedVars[i]] = copy(includeVars[definedVars[i]]);
        allVars[definedVars[i]].file = foundFile;
        allVars[definedVars[i]].filePos = allVars[definedVars[i]].pos;
        allVars[definedVars[i]].pos = token.pos;
        allVars[definedVars[i]].meta.isDefined = true;
        break;
      /**
       * Undefined variable that is defined in the include block
       */
      case !allVars[definedVars[i]].meta.isDefined:
        allVars[definedVars[i]] = copy(includeVars[definedVars[i]]);
        allVars[definedVars[i]].file = foundFile;
        allVars[definedVars[i]].filePos = allVars[definedVars[i]].pos;
        allVars[definedVars[i]].pos = token.pos;
        allVars[definedVars[i]].meta.isDefined = true;
        break;
      default:
        break;
    }
  }
};

for (let i = 0; i < TOKENS.length; i++) {
  POPULATE_TYPE_HANDLER.onBasicToken(TOKENS[i], cb);
}
