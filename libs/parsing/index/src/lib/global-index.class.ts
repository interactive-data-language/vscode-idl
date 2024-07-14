import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import {
  MAIN_LEVEL_NAME,
  SyntaxProblemWithoutTranslation,
} from '@idl/parsing/syntax-tree';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  CUSTOM_TYPE_DISPLAY_NAMES,
  GLOBAL_TOKEN_TYPES,
  GlobalTokens,
  GlobalTokenType,
  IGlobalIndexedToken,
} from '@idl/types/core';
import { SyntaxProblems } from '@idl/types/problem-codes';

import {
  ExportedGlobalTokensByType,
  GlobalIndexedToken,
  GlobalTokensByTypeByName,
  PROBLEM_MAP,
} from './global-index.interface';
import { SaveGlobalDisplayNames } from './helpers/save-global-display-names';
import { IDL_INDEX_OPTIONS } from './idl-index.interface';
import GlobToRegExp = require('glob-to-regexp');
import { ShouldExportItem } from './helpers/should-export-item';

/**
 * Class that manages storing/querying our index of global tokens
 */
export class GlobalIndex {
  /**
   * By file name, track the global token types that are present.
   *
   * Used to filter out processing/checking excess files that we dont need to
   */
  globalTokensByFile: { [key: string]: GlobalTokens } = {};

  /**
   * Tokens categorized by type to reduce number of checks for global conflicts
   */
  globalTokensByTypeByName: GlobalTokensByTypeByName = {};

  /**
   * Track all of our syntax problems
   */
  globalSyntaxProblemsByFile: { [key: string]: SyntaxProblems } = {};

  /**
   * Track changed files that we need to sync problems for regarding
   * global tokens (i.e. duplicate problems)
   */
  changedFiles: { [key: string]: boolean } = {};

  /**
   * Constructor which initializes properties in our constants so that they
   * are always present
   */
  constructor() {
    const types = Object.values(GLOBAL_TOKEN_TYPES);
    for (let i = 0; i < types.length; i++) {
      this.globalTokensByTypeByName[types[i]] = {};
    }
    this.globalTokensByFile = {};
    this.globalSyntaxProblemsByFile = {};
    this.changedFiles = {};
  }

  /**
   * Selects global tokens that need to be exported and makes sure the tokens can be exported.
   *
   * Each global token is copied so it can be manipulated after-the-path.
   *
   * Specify an array of glob expressions used to test filenames if the global token should
   * be exported or not.
   *
   * All glob expressions are treated as if they are case-insensitive.
   *
   * If more than one global token has the same name, we only export the first instance
   * in our global index.
   */
  export(
    globs: string[] = [],
    filters: string[] = [],
    everything = false
  ): ExportedGlobalTokensByType {
    /**
     * Exported tokens
     */
    const exported = {} as ExportedGlobalTokensByType;

    /**
     * Types of the global tokens
     */
    const types = Object.values(GLOBAL_TOKEN_TYPES);

    // init return value
    for (let i = 0; i < types.length; i++) {
      exported[types[i]] = [];
    }

    // check if we export everything
    if (everything) {
      for (let i = 0; i < types.length; i++) {
        const byNameForType = this.globalTokensByTypeByName[types[i]];
        const names = Object.keys(byNameForType);
        for (let j = 0; j < names.length; j++) {
          exported[types[i]].push(byNameForType[names[j]][0]);
        }
      }
      return exported;
    }

    /** Convert globs to regex */
    const exprs = globs.map((item) => GlobToRegExp(item, { flags: '' }));

    /** Convert globs to regex */
    const badExprs = filters.map((item) => GlobToRegExp(item, { flags: '' }));

    /** Get files */
    const files = Object.keys(this.globalTokensByFile);

    /** Process each file */
    for (let i = 0; i < files.length; i++) {
      /** Clean the file name */
      const cleaned = files[i].replace(/\\/g, '/');

      // check for bad expressions
      let skip = false;
      for (let j = 0; j < badExprs.length; j++) {
        if (badExprs[j].test(cleaned)) {
          skip = true;
          break;
        }
      }

      // skip if needs to be excluded
      if (skip) {
        continue;
      }

      // check against all globs if we do have filters
      let keep = true;
      for (let z = 0; z < exprs.length; z++) {
        if (!exprs[z].test(cleaned)) {
          keep = false;
          break;
        }
      }

      // make sure that we pass all filters
      if (!keep) {
        continue;
      }

      /** Get tokens by name */
      const forFile = this.globalTokensByFile[files[i]].filter((item) =>
        ShouldExportItem(item)
      );

      // process all tokens
      for (let j = 0; j < forFile.length; j++) {
        exported[forFile[j].type].push(forFile[j] as any);
      }
    }

    return exported;
  }

  /**
   * Resets all lookups to an initial state
   */
  reset() {
    const types = Object.values(GLOBAL_TOKEN_TYPES);
    for (let i = 0; i < types.length; i++) {
      this.globalTokensByTypeByName[types[i]] = {};
    }
  }

  /**
   * Retrieve global tokens that match our name and type
   */
  findMatchingGlobalToken<T extends GlobalTokenType>(
    type: T,
    name: string
  ): IGlobalIndexedToken<T>[] {
    // get the tokens to process
    if (type in this.globalTokensByTypeByName) {
      // convert the name to lower case
      const useName = name.trim().toLowerCase();

      // extract global variables of type
      const toCheck = this.globalTokensByTypeByName[type];

      if (useName in toCheck) {
        return toCheck[useName] as IGlobalIndexedToken<T>[];
      }
    }

    // get the tokens of the matching type
    return [];
  }

  // /**
  //  * Use fuzzy searching to search global tokens of the specified type
  //  */
  // searchGlobalTokens<T extends GlobalTokenType>(
  //   type: T,
  //   searchFor: string
  // ): IGlobalIndexedToken<T>[] {
  //   // convert the name to lower case
  //   const useSearch = searchFor.trim().toLowerCase();

  //   // initialize the results
  //   const results: IGlobalIndexedToken<T>[] = [];

  //   // get the tokens to process
  //   if (type in this.tokensByType) {
  //     // search for matching global tokens
  //     const found = fuzzysort.go(useSearch, this.tokensByType[type], {
  //       key: 'name',
  //       limit: 100, // don't return more results than you need!
  //       threshold: -10000, // don't return bad results
  //     });

  //     // extract actual results and return
  //     for (let i = 0; i < found.length; i++) {
  //       results.push(found[i].obj as IGlobalIndexedToken<T>);
  //     }
  //   }

  //   // get the tokens of the matching type
  //   return results;
  // }

  /**
   * Returns string for our IDL problem that a user sees
   */
  private getProblemDetail(token: GlobalIndexedToken): string {
    // map problem code
    return (
      IDL_TRANSLATION.parsing.errors[PROBLEM_MAP[token.type]] +
      `: "${token.name}"`
    );
  }

  /**
   * Searches all files to remove duplicate token problems.
   *
   * Pseudo efficient and only processes files that have tokens of the
   * same type.
   *
   * @param token The token we are removing
   * @param clear If set, we don't check the file and remove all
   */
  private removeDuplicateTokenProblems(
    token: GlobalIndexedToken,
    clear = true
  ) {
    // sting we match at the beginning
    const problemCode = PROBLEM_MAP[token.type];

    // string we match at the end
    const endMatch = `: "${token.name}"`;

    // check all files that we need to process
    const files = this.globalTokensByTypeByName[token.type][token.name]
      .filter((item) => item.file !== undefined)
      .map((item) => item.file);

    // process each file
    for (let z = 0; z < files.length; z++) {
      // get the problems for our file
      const problems = this.globalSyntaxProblemsByFile[files[z]] || [];

      // get number of problems
      const l = problems.length;

      // process problems
      for (let i = 0; i < l; i++) {
        // reverse index
        const j = l - i - 1;

        // extract the problem
        const problem = problems[j];

        // check if our file matches
        if (
          (problem.file === token.file || clear) &&
          problem.code === problemCode &&
          problem.info.endsWith(endMatch)
        ) {
          this.changedFiles[problem.file] = true;
          problems.splice(j, 1);
        }
      }
    }
  }

  /**
   * Track problems with duplicate global variables
   */
  private addDuplicateTokenProblem(token: GlobalIndexedToken) {
    // as long as we have a file, save our problem
    if (token.file !== undefined) {
      // check if we need to initialize the value in our file
      if (!(token.file in this.globalSyntaxProblemsByFile)) {
        this.globalSyntaxProblemsByFile[token.file] = [];
      }
      this.globalSyntaxProblemsByFile[token.file].push(
        SyntaxProblemWithoutTranslation(
          PROBLEM_MAP[token.type],
          this.getProblemDetail(token),
          token.pos,
          token.pos,
          token.file
        )
      );
      this.changedFiles[token.file] = true;
    }
  }

  /**
   * When we save a token, properly accounts for the number of tokens we have
   * with the same name and where they come from.
   */
  private checkForDuplicate(token: GlobalIndexedToken) {
    if (!IDL_INDEX_OPTIONS.IS_MAIN_THREAD) {
      return;
    }
    if (token.name in this.globalTokensByTypeByName[token.type]) {
      // check if we have a problem
      switch (true) {
        case this.globalTokensByTypeByName[token.type][token.name].length > 1:
          this.addDuplicateTokenProblem(token);
          break;
        case this.globalTokensByTypeByName[token.type][token.name].length === 1:
          this.addDuplicateTokenProblem(
            this.globalTokensByTypeByName[token.type][token.name][0]
          );
          this.addDuplicateTokenProblem(token);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Removes any tokens that we have tracked by a particular file
   *
   * Returns the global tokens that we removed
   */
  removeTokensForFile(file: string) {
    /** Save removed global tokens */
    let tokens: GlobalTokens = [];

    // check if we have processed our file or not
    if (file in this.globalTokensByFile) {
      // get the tokens that we have for our file
      tokens = this.globalTokensByFile[file];

      // remove tokens from display and auto complete
      // RemoveGlobalDisplayNames(tokens);

      // process each token
      for (let i = 0; i < tokens.length; i++) {
        // skip if not known
        if (
          !(tokens[i].name in this.globalTokensByTypeByName[tokens[i].type])
        ) {
          continue;
        }

        // get the tokens by name
        const byName =
          this.globalTokensByTypeByName[tokens[i].type][tokens[i].name];

        /** Initial number of problems */
        const l = byName.length;

        // process all tokens by name
        for (let j = 0; j < l; j++) {
          // get index of our token
          const z = l - j - 1;

          // check if we match
          if (byName[z].file === file) {
            switch (true) {
              // 3 or more duplicates
              case byName.length > 2:
                this.removeDuplicateTokenProblems(byName[z], false);
                break;
              // if we have two, and we remove one, all problems must leave
              case byName.length == 2:
                this.removeDuplicateTokenProblems(byName[0], true);
                this.removeDuplicateTokenProblems(byName[1], true);
                break;
              case byName.length === 1:
                // remove display name
                delete IDL_DISPLAY_NAMES[tokens[i].type][tokens[i].name];

                // remove structure/type names
                if (tokens[i].type === GLOBAL_TOKEN_TYPES.STRUCTURE) {
                  delete CUSTOM_TYPE_DISPLAY_NAMES[tokens[i].name.trim()];
                }
                break;
              default:
                // do nothing
                break;
            }

            // always remove token if we match our file
            byName.splice(z, 1);
          }
        }
      }

      // reset value
      this.globalTokensByFile[file] = [];

      // mark as changed if we had problems
      if (file in this.globalSyntaxProblemsByFile) {
        this.changedFiles[file] = undefined;
      }

      // reset problems for our file as well
      this.globalSyntaxProblemsByFile[file] = [];
    }

    return tokens;
  }

  /**
   * Add tokens to our global index. Removes any tokens previously found for
   * a file.
   */
  trackGlobalTokens(tokens: GlobalTokens, file?: string) {
    // check if we need to clean up first
    if (file) {
      if (file in this.globalTokensByFile) {
        this.removeTokensForFile(file);
      }
      this.globalTokensByFile[file] = tokens;
    }

    // save display names for global - do this here where we index code and files
    SaveGlobalDisplayNames(tokens);

    // add all of our tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // skip token if we are a main level program
      if (
        token.type === GLOBAL_TOKEN_TYPES.PROCEDURE &&
        token.name === MAIN_LEVEL_NAME
      ) {
        continue;
      }

      // set file
      token.file = file;

      // add a count for our token - do this before adding
      // because we find other tokens that match
      this.checkForDuplicate(token);

      // save by type
      if (token.name in this.globalTokensByTypeByName[token.type]) {
        this.globalTokensByTypeByName[token.type][token.name].push(token);
      } else {
        this.globalTokensByTypeByName[token.type][token.name] = [token];
      }
    }
  }
}
