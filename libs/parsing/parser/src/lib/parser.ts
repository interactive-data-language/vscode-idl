import { ActivateDefaultSyntaxPostProcessors } from '@idl/parsing/syntax-post-processors';
import {
  BuildSyntaxTree,
  DEFAULT_USES_THESE_GLOBAL_TOKEN,
  IParsed,
  PopulateGlobalLocalCompileOpts,
  PostProcessProblems,
} from '@idl/parsing/syntax-tree';
import { ActivateDefaultSyntaxRules } from '@idl/parsing/syntax-validators';
import { Tokenizer } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';
import { existsSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';

import { CodeChecksum } from './code-checksum';

// call a function from our validators so the code gets loaded and bundled
ActivateDefaultSyntaxRules();
ActivateDefaultSyntaxPostProcessors();

/**
 * Creates an iterator and extracts tokens from our code
 */
export function ParserTokenize(code: string | string[], tokenized: IParsed) {
  /**
   * Dont catch errors at this level, we want failures to happen
   * when we have problems using the tokenizer so they
   * get caught and reported
   */
  // try {
  Object.assign(tokenized, Tokenizer(code));
  // } catch (err) {
  //   console.error(err);

  //   // track problem that will get reported to user
  //   tokenized.parseProblems.push(
  //     ProblemWithTranslation(
  //       IDL_PROBLEM_CODES.EMBARRASSING_FILE,
  //       [0, 0, 0],
  //       [0, 0, 0]
  //     )
  //   );
  // }
}

/**
 * Creates a syntax tree and does checking for syntax errors
 */
export function ParserBuildTree(tokenized: IParsed, full = true) {
  // try {
  // build tree - updates property for tokenized
  BuildSyntaxTree(tokenized, full);
  // } catch (err) {
  //   console.error(err);

  //   // track problem that will get reported to user
  //   tokenized.parseProblems.push(
  //     ProblemWithTranslation(
  //       IDL_PROBLEM_CODES.EMBARRASSING_FILE,
  //       [0, 0, 0],
  //       [0, 0, 0]
  //     )
  //   );
  // }
}

/**
 * Parses IDL code into tokens for linting, formatting, and error checking.
 * @param {(string | string[])} code The Code to parse
 * @param {boolean} [full=true] Do we do a full parse or not?
 * @param {boolean} [cleanup=true] Do we cleanup to reduce memory usage after?
 * @return {*}  {IParsed}
 */
export function Parser(
  code: string | string[],
  full = true,
  cleanup = true
): IParsed {
  // initialize out tokenized response
  const tokenized: IParsed = {
    checksum: CodeChecksum(code),
    hasDetail: false,
    hasCache: false,
    tokens: [],
    text: [],
    lines: 0,
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
    uses: copy(DEFAULT_USES_THESE_GLOBAL_TOKEN),
  };

  // extract tokens
  ParserTokenize(code, tokenized);

  // build the syntax tree and detect syntax problems
  ParserBuildTree(tokenized, full);

  // populate our global tokens and extract local for the global tokens
  PopulateGlobalLocalCompileOpts(tokenized);

  // clean up
  if (cleanup) {
    tokenized.tokens = [];
    tokenized.text = [];
  }

  // post process our syntax problems
  PostProcessProblems(tokenized);

  return tokenized;
}

/**
 * Parsing function that reads a file from disk and parses it.
 *
 * It will throw an error if the file does not exist, so this should be
 * called in a try/catch block.
 */
export async function ParseFile(file: string, full = true): Promise<IParsed> {
  // make sure that our file exists
  if (!existsSync(file)) {
    throw new Error(`File "${file}" not found`);
  }

  // read code
  const code = await readFile(file, 'utf-8');

  // parse and return
  return Parser(code, full);
}

/**
 * Parsing function that reads a file from disk and parses it.
 *
 * It will throw an error if the file does not exist, so this should be
 * called in a try/catch block.
 */
export function ParseFileSync(file: string, full = true): IParsed {
  // make sure that our file exists
  if (!existsSync(file)) {
    throw new Error(`File "${file}" not found`);
  }

  // read code
  const code = readFileSync(file, 'utf-8');

  // parse and return
  return Parser(code, full);
}
