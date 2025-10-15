import { CancellationToken } from '@idl/cancellation-tokens';
import {
  GetTokenAtCursor,
  IBranch,
  IsWithinToken,
  TreeBranchToken,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import {
  ControlCompileOptToken,
  StructureNameToken,
  TOKEN_NAMES,
} from '@idl/tokenizer';
import {
  AUTO_COMPLETE_TYPE_LOOKUP,
  AutoCompleteRecipe,
  AutoCompleteType,
  CompileOptCompletion,
  ExecutiveCommandCompletion,
  FunctionCompletion,
  FunctionMethodCompletion,
  IncludeCompletion,
  KeywordCompletion,
  ProcedureCompletion,
  ProcedureMethodCompletion,
  PropertyCompletion,
  PropertyInStructureCompletion,
  SpecialFunctionCompletion,
  SpecialProcedureCompletion,
  StructureNameCompletion,
  SystemVariableCompletion,
  VariableCompletion,
} from '@idl/types/auto-complete';
import { Position } from 'vscode-languageserver/node';

import { GetParsedPROCode } from '../get-parsed/get-parsed-pro-code';
import { GetTypeBefore } from '../helpers/get-type-before';
import { IDLIndex } from '../idl-index.class';
import { GetBlockCompletionOptions } from './completion-for/completion-blocks';
import { GetCompileOptCompletionOptions } from './completion-for/completion-compile-opts';
import { GetExecutiveCommandCompletionOptions } from './completion-for/completion-executive-commands';
import { GetFunctionMethodCompletionOptions } from './completion-for/completion-function-methods';
import { GetFunctionCompletionOptions } from './completion-for/completion-functions';
import { GetKeywordCompletionOptions } from './completion-for/completion-keywords';
import { GetProcedureMethodCompletionOptions } from './completion-for/completion-procedure-methods';
import { GetPropertyCompletionOptions } from './completion-for/completion-properties';
import { GetPropertyInStructureCompletionOptions } from './completion-for/completion-properties-in-structures';
import { GetSpecialFunctionCompletionOptions } from './completion-for/completion-special-functions';
import { SPECIAL_FUNCTION_REGEX } from './completion-for/completion-special-functions.interface';
import { GetSpecialProcedureCompletionOptions } from './completion-for/completion-special-procedures';
import { SPECIAL_PROCEDURE_REGEX } from './completion-for/completion-special-procedures.interface';
import { GetVariableCompletionOptions } from './completion-for/completion-variables';
import {
  ALL_METHODS_COMPLETION,
  CAN_PROCEDURE_HERE,
  FUNCTION_METHOD_COMPLETION,
  FUNCTION_TOKENS,
  KEYWORD_COMPLETION,
  KEYWORDS,
  METHOD_INTERIOR_CHECK,
  METHOD_PROPERTY_COMPLETION,
  NO_PAREN,
  NO_PROPERTIES,
  PROCEDURE_TOKENS,
  PROCEDURES,
  ROUTINES,
} from './get-auto-complete.interface';

/**
 * Tokens that we dont do anything for
 */
const SKIP_THESE_TOKENS: { [key: string]: any } = {};
SKIP_THESE_TOKENS[TOKEN_NAMES.LINE_CONTINUATION] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.COMMENT] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.COMMENT_BLOCK] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.ROUTINE_NAME] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.QUOTE_DOUBLE] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.QUOTE_SINGLE] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.STRING_TEMPLATE_STRING] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.NUMBER] = true;
SKIP_THESE_TOKENS[TOKEN_NAMES.PYTHON] = true;

/**
 * Tokens that we dont do anything for
 */
const SKIP_THESE_PARENTS: { [key: string]: any } = {};
SKIP_THESE_PARENTS[TOKEN_NAMES.LINE_CONTINUATION] = true;
SKIP_THESE_PARENTS[TOKEN_NAMES.COMMENT] = true;
SKIP_THESE_PARENTS[TOKEN_NAMES.COMMENT_BLOCK] = true;
SKIP_THESE_PARENTS[TOKEN_NAMES.ROUTINE_NAME] = true;
SKIP_THESE_PARENTS[TOKEN_NAMES.ROUTINE_METHOD_NAME] = true;
// SKIP_THESE_PARENTS[TOKEN_NAMES.CALL_LAMBDA_FUNCTION] = true;

/**
 * Returns text for hover help
 */
export async function GetCompletionRecipes(
  index: IDLIndex,
  file: string,
  code: string | string[],
  position: Position
): Promise<AutoCompleteRecipe<AutoCompleteType>[]> {
  // initialize the value of our help
  const recipes: AutoCompleteRecipe<AutoCompleteType>[] = [];

  // get the tokens for our file
  const parsed = await GetParsedPROCode(
    index,
    file,
    code,
    new CancellationToken(),
    {
      postProcess: true,
    }
  );
  if (parsed !== undefined) {
    // determine what we have hovered over
    const cursor = GetTokenAtCursor(parsed, position);

    // unpack for easier access
    const global = cursor.globalParent;
    const local = cursor.localParent;
    let token = cursor.token;

    // check if we have a comma and need to go up a level
    if (token?.name === TOKEN_NAMES.COMMA) {
      if (token.scopeTokens.length > 0) {
        token = token.scopeTokens[token.scopeTokens.length - 1];
        cursor.token = token;
        cursor.accessTokens = token.accessTokens;
        cursor.scope = token.scope;
      }
    }

    /**
     * Check if we have a parent that we are supposed to skip
     */
    const scope = token?.scope || [];
    for (let i = 0; i < scope.length; i++) {
      if (scope[i] in SKIP_THESE_TOKENS) {
        return [];
      }
    }

    /**
     * Add block completions
     */
    GetBlockCompletionOptions(token || local, position, recipes);

    /**
     * Handle special cases for auto-complete
     */
    switch (true) {
      /**
       * Custom auto-complete functions where we have literal values
       */
      case token?.scope[token.scope.length - 1] === TOKEN_NAMES.CALL_FUNCTION &&
        SPECIAL_FUNCTION_REGEX.test(
          token?.scopeTokens[token.scope.length - 1]?.match[0]
        ): {
        const typed: AutoCompleteRecipe<SpecialFunctionCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.SPECIAL_FUNCTION,
          options: GetSpecialFunctionCompletionOptions(token),
        };
        recipes.push(typed);
        return recipes;
      }

      /**
       * Custom auto-complete procedures where we have literal values
       */
      case token?.scope[token.scope.length - 1] ===
        TOKEN_NAMES.CALL_PROCEDURE &&
        SPECIAL_PROCEDURE_REGEX.test(
          token?.scopeTokens[token.scope.length - 1]?.match[0]
        ): {
        const typed: AutoCompleteRecipe<SpecialProcedureCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.SPECIAL_PROCEDURE,
          options: GetSpecialProcedureCompletionOptions(token),
        };
        recipes.push(typed);
        return recipes;
      }

      /**
       * Tokens or parents that we skip
       */
      case token?.name in SKIP_THESE_TOKENS ||
        local?.name in SKIP_THESE_PARENTS:
        return [];

      /**
       * Include statements
       */
      case token?.name === TOKEN_NAMES.INCLUDE: {
        const typed: AutoCompleteRecipe<IncludeCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.INCLUDE,
          options: {},
        };
        recipes.push(typed);
        return recipes;
      }

      /**
       * Compile options
       */
      case local?.name === TOKEN_NAMES.CONTROL_COMPILE_OPT: {
        const typed: AutoCompleteRecipe<CompileOptCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.COMPILE_OPT,
          options: GetCompileOptCompletionOptions(
            local as TreeToken<ControlCompileOptToken>
          ),
        };
        recipes.push(typed);
        return recipes;
      }
      case token?.name === TOKEN_NAMES.CONTROL_COMPILE_OPT: {
        const typed: AutoCompleteRecipe<CompileOptCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.COMPILE_OPT,
          options: GetCompileOptCompletionOptions(
            token as TreeToken<ControlCompileOptToken>
          ),
        };
        recipes.push(typed);
        return recipes;
      }

      /**
       * System variables
       */
      case token?.name === TOKEN_NAMES.SYSTEM_VARIABLE: {
        const typed: AutoCompleteRecipe<SystemVariableCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.SYSTEM_VARIABLE,
          options: {},
        };
        recipes.push(typed);
        return recipes;
      }

      /**
       * Executive commands
       */
      case token?.name === TOKEN_NAMES.EXECUTIVE_COMMAND ||
        (token?.name === TOKEN_NAMES.DOT && token.pos[1] === 0): {
        const typed: AutoCompleteRecipe<ExecutiveCommandCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.EXECUTIVE_COMMAND,
          options: GetExecutiveCommandCompletionOptions(token),
        };
        recipes.push(typed);
        return recipes;
      }

      /**
       * Structures
       */
      case token?.name === TOKEN_NAMES.STRUCTURE && token?.kids?.length === 0: {
        const typed: AutoCompleteRecipe<StructureNameCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.STRUCTURE_NAME,
          options: {},
        };
        recipes.push(typed);
        return recipes;
      }
      case token?.name === TOKEN_NAMES.STRUCTURE_INHERITANCE &&
        // fully typed inherits
        token.match[0].trim().toLowerCase() === 'inherits' &&
        // make sure it ends with a space
        token.match[0].endsWith(' '): {
        const typed: AutoCompleteRecipe<StructureNameCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.STRUCTURE_NAME,
          options: {},
        };
        recipes.push(typed);
        return recipes;
      }
      case token?.name === TOKEN_NAMES.STRUCTURE_NAME &&
        token?.kids?.length === 0: {
        const typed: AutoCompleteRecipe<StructureNameCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.STRUCTURE_NAME,
          options: {},
        };
        recipes.push(typed);
        return recipes;
      }
      case token?.name === TOKEN_NAMES.STRUCTURE_NAME: {
        const typed: AutoCompleteRecipe<PropertyInStructureCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.PROPERTY_IN_STRUCTURE,
          options: GetPropertyInStructureCompletionOptions(
            token as IBranch<StructureNameToken>
          ),
        };
        recipes.push(typed);
        return recipes;
      }
      // return if we have a parent token that we are never supposed to process
      default:
    }

    /** Flag if we should add parentheses to function calls */
    let addParen = true;

    /** Flag if we should include variables in auto-complete */
    let addVariables = true;

    /** Track if within the start of our token or not */
    let isWithinStart = false;

    // check if we should add parentheses
    if (token !== undefined) {
      // check if we are within the start
      isWithinStart = IsWithinToken(position, token.pos);

      if (token.name in NO_PAREN) {
        switch (true) {
          case position.line === token.pos[0] &&
            position.character >= token.pos[1] + token.pos[2]:
            addParen = true;
            break;
          case IsWithinToken(position, token.pos):
            addParen = false;
            break;
          default:
            break;
        }
      }
    }

    // variables should match paren logic because, if we are in
    // a function call (no paren) then it is definitively a function
    // call and should not have variables
    addVariables = addParen;

    // make sure we have a token so that we can try and add keywords
    if (
      (token !== undefined || cursor.scopeTokens.length > 1) &&
      token?.name !== TOKEN_NAMES.ASSIGNMENT
    ) {
      /**
       * Verify that we can actually add completion for keywords
       *
       * Our detection catches the end of tokens, so we want
       * to exclude being on the outside of the parentheses because
       * we are not technically within the function call, but it is
       * within for procedures and assignment
       */
      let canKeyword =
        token.name in KEYWORD_COMPLETION ||
        (token.match[0] || '').trim() === '/';

      // double check we are not a function and in the closing parentheses
      if (token?.name in ROUTINES && canKeyword) {
        if ((token as TreeBranchToken).end !== undefined) {
          if (
            IsWithinToken(position, [
              (token as TreeBranchToken).end.pos[0],
              (token as TreeBranchToken).end.pos[1] + 1,
              (token as TreeBranchToken).end.pos[2],
            ])
          ) {
            canKeyword = false;
          }
        }
      }

      /**
       * If procedure, do we disable keywords?
       */
      const noProKeywords = isWithinStart && token?.name in PROCEDURE_TOKENS;

      /**
       * If function, do we disable keywords?
       */
      const noFunctionKeywords =
        isWithinStart &&
        position.character < token.pos[1] + token.pos[2] &&
        token?.name in FUNCTION_TOKENS;

      /**
       * If we can keyword, double check we arent in the start of a routine
       */
      if (canKeyword && !(noProKeywords || noFunctionKeywords)) {
        const typed: AutoCompleteRecipe<KeywordCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.KEYWORD,
          options: GetKeywordCompletionOptions(
            parsed,
            index,
            token || cursor.scopeTokens[cursor.scopeTokens.length - 1]
          ),
        };
        recipes.push(typed);
      }
    }

    // TODO: return if in lambda function?
    const type = GetTypeBefore(index, cursor, parsed);

    /**
     * Flag if we can add method or properties
     */
    let canMethod = token?.name in METHOD_PROPERTY_COMPLETION;
    if (canMethod) {
      /**
       * If we are at the edge of our start, then dont send methods
       */
      if (
        token.name in METHOD_INTERIOR_CHECK &&
        token.pos[1] + token.pos[2] - 1 < position.character
      ) {
        canMethod = false;
      }
    }

    // handle our cases
    switch (true) {
      // if keyword, do nothing else
      case token?.name in KEYWORDS:
        break;
      /**
       * Are we completing methods or properties?
       */
      case canMethod: {
        /**
         * Add properties. If we are where we can use a procedure, add another
         * dot for properties because something else needs to come afterwards
         */
        if (isWithinStart && !(token?.name in NO_PROPERTIES)) {
          const typed: AutoCompleteRecipe<PropertyCompletion> = {
            type: AUTO_COMPLETE_TYPE_LOOKUP.PROPERTY,
            options: GetPropertyCompletionOptions(
              local?.name in PROCEDURES ? '' : '',
              type
            ),
          };
          recipes.push(typed);
        }

        /**
         * Check if we need to add variables
         */
        if (!isWithinStart && addVariables) {
          const varComplete: AutoCompleteRecipe<VariableCompletion> = {
            type: AUTO_COMPLETE_TYPE_LOOKUP.VARIABLE,
            options: GetVariableCompletionOptions(parsed, global?.token),
          };
          recipes.push(varComplete);

          const sysVarComplete: AutoCompleteRecipe<SystemVariableCompletion> = {
            type: AUTO_COMPLETE_TYPE_LOOKUP.SYSTEM_VARIABLE,
            options: {},
          };
          recipes.push(sysVarComplete);

          const funcComplete: AutoCompleteRecipe<FunctionCompletion> = {
            type: AUTO_COMPLETE_TYPE_LOOKUP.FUNCTION,
            options: GetFunctionCompletionOptions(addParen),
          };
          recipes.push(funcComplete);
        }

        /**
         * Check if we send function or procedure methods
         */
        if (isWithinStart) {
          switch (true) {
            case token?.name in FUNCTION_METHOD_COMPLETION: {
              const typed: AutoCompleteRecipe<FunctionMethodCompletion> = {
                type: AUTO_COMPLETE_TYPE_LOOKUP.FUNCTION_METHOD,
                options: GetFunctionMethodCompletionOptions(type, addParen),
              };
              recipes.push(typed);
              break;
            }
            case token?.name in ALL_METHODS_COMPLETION:
              {
                if (
                  local?.name in CAN_PROCEDURE_HERE ||
                  token?.name === TOKEN_NAMES.CALL_PROCEDURE_METHOD
                ) {
                  const typed: AutoCompleteRecipe<ProcedureMethodCompletion> = {
                    type: AUTO_COMPLETE_TYPE_LOOKUP.PROCEDURE_METHOD,
                    options: GetProcedureMethodCompletionOptions(type),
                  };
                  recipes.push(typed);
                }
                const typed: AutoCompleteRecipe<FunctionMethodCompletion> = {
                  type: AUTO_COMPLETE_TYPE_LOOKUP.FUNCTION_METHOD,
                  options: GetFunctionMethodCompletionOptions(type, addParen),
                };
                recipes.push(typed);
              }
              break;
            default:
              break;
          }
        }

        break;
      }
      /**
       * Default is that we can write functions or procedures and
       * should send variables for auto completion super-fun
       */
      default:
        if (addVariables) {
          const varComplete: AutoCompleteRecipe<VariableCompletion> = {
            type: AUTO_COMPLETE_TYPE_LOOKUP.VARIABLE,
            options: GetVariableCompletionOptions(parsed, global?.token),
          };
          recipes.push(varComplete);

          const sysVarComplete: AutoCompleteRecipe<SystemVariableCompletion> = {
            type: AUTO_COMPLETE_TYPE_LOOKUP.SYSTEM_VARIABLE,
            options: {},
          };
          recipes.push(sysVarComplete);
        }

        // check if we can send procedures or if it needs to be functions
        if (
          token?.name in PROCEDURES ||
          (isWithinStart && token?.name === TOKEN_NAMES.CALL_PROCEDURE)
        ) {
          const typed: AutoCompleteRecipe<ProcedureCompletion> = {
            type: AUTO_COMPLETE_TYPE_LOOKUP.PROCEDURE,
            options: {},
          };
          recipes.push(typed);
        } else {
          const typed: AutoCompleteRecipe<FunctionCompletion> = {
            type: AUTO_COMPLETE_TYPE_LOOKUP.FUNCTION,
            options: GetFunctionCompletionOptions(addParen),
          };
          recipes.push(typed);
        }
    }
  }

  return recipes;
}
