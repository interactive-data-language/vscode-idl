import { CancellationToken } from '@idl/cancellation-tokens';
import { ActivateDefaultSyntaxPostProcessors } from '@idl/parsing/syntax-post-processors';
import {
  BuildSyntaxTree,
  DEFAULT_USES_THESE_GLOBAL_TOKEN,
  IParsed,
  PopulateGlobalLocalCompileOpts,
  PostProcessProblems,
} from '@idl/parsing/syntax-tree';
import { ActivateDefaultSyntaxRules } from '@idl/parsing/syntax-validators';
import { FAST_FIND_TOKEN_OPTIONS, Tokenizer } from '@idl/parsing/tokenizer';
import copy from 'fast-copy';
import { existsSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';

import { CodeChecksum } from './code-checksum';
import { DEFAULT_PARSER_OPTIONS, IParserOptions } from './parser.interface';
import { ParserGetOutline } from './parser-get-outline';

// call a function from our validators so the code gets loaded and bundled
ActivateDefaultSyntaxRules();
ActivateDefaultSyntaxPostProcessors();

/**
 * Creates an iterator and extracts tokens from our code
 */
export function ParserTokenize(
  code: string | string[],
  tokenized: IParsed,
  cancel: CancellationToken,
  full = true
) {
  /**
   * Dont catch errors at this level, we want failures to happen
   * when we have problems using the tokenizer so they
   * get caught and reported
   */
  // try {
  Object.assign(
    tokenized,
    full
      ? Tokenizer(code, cancel)
      : Tokenizer(code, cancel, FAST_FIND_TOKEN_OPTIONS)
  );

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
 * @param {boolean} [options.full=true] Do we do a full parse or not?
 * @param {boolean} [options.cleanup=true] Do we cleanup to reduce memory usage after?
 * @return {*}  {IParsed}
 */
export function Parser(
  code: string | string[],
  cancel: CancellationToken,
  inOptions: Partial<IParserOptions> = {}
): IParsed {
  /**
   * Merge with defaults
   */
  const options = Object.assign(copy(DEFAULT_PARSER_OPTIONS), inOptions);

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
    outline: [],
    semantic: { data: [] },
  };

  // extract tokens
  ParserTokenize(code, tokenized, cancel, options.full);

  // build the syntax tree and detect syntax problems
  BuildSyntaxTree(tokenized, cancel, options.full, options.isNotebook);

  /**
   * Populate our global, local (variables), and compile-opts
   *
   * Populate global tokens - do note that this also populates docs
   * so we probably dont want to turn it off
   *
   * If it is off, we dont get hover help or useful auto-complete
   */
  PopulateGlobalLocalCompileOpts(tokenized, cancel, true, options.isNotebook);

  // remove all problems if fast parse
  if (!options.full) {
    tokenized.parseProblems = [];
  }

  // clean up
  if (options.cleanup) {
    // always remove tokens
    tokenized.tokens = [];

    /**
     * Never clean up notebooks as it is the only way to get our text from worker threads
     */
    if (!(options.isNotebook || options.keepText)) {
      tokenized.text = [];
    }
  }

  // post process our syntax problems
  if (options.full) {
    PostProcessProblems(tokenized);
  }

  // get code outline
  ParserGetOutline(tokenized);

  return tokenized;
}

/**
 * Parsing function that reads a file from disk and parses it.
 *
 * It will throw an error if the file does not exist, so this should be
 * called in a try/catch block.
 */
export async function ParseFile(
  file: string,
  cancel: CancellationToken,
  options: Partial<IParserOptions> = {}
): Promise<IParsed> {
  // make sure that our file exists
  if (!existsSync(file)) {
    throw new Error(`File "${file}" not found`);
  }

  // read code
  const code = await readFile(file, 'utf-8');

  // parse and return
  return Parser(code, cancel, options);
}

/**
 * Parsing function that reads a file from disk and parses it.
 *
 * It will throw an error if the file does not exist, so this should be
 * called in a try/catch block.
 */
export function ParseFileSync(
  file: string,
  cancel: CancellationToken,
  options: Partial<IParserOptions> = {}
): IParsed {
  // make sure that our file exists
  if (!existsSync(file)) {
    throw new Error(`File "${file}" not found`);
  }

  // read code
  const code = readFileSync(file, 'utf-8');

  // parse and return
  return Parser(code, cancel, options);
}
