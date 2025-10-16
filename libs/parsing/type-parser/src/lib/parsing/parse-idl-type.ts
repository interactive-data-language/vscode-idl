import { CancellationToken } from '@idl/cancellation-tokens';
import {
  SimplifiedBuildSyntaxTree,
  SplitTreeOnCommas,
} from '@idl/parsing/shared';
import {
  TOKEN_NAMES,
  Tokenizer,
  TYPE_FIND_TOKEN_OPTIONS,
} from '@idl/tokenizer';
import {
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IDLDataTypeBase,
  IDLTypes,
  TYPE_ALIASES,
} from '@idl/types/idl-data-types';
import { SyntaxProblems } from '@idl/types/problem-codes';
import { SyntaxTree, TreeBranchToken } from '@idl/types/syntax-tree';

import { GetTaskDisplayName } from '../helpers/get-task-display-name';
import { ReduceIDLDataType } from '../helpers/reduce-types';
import { ARRAY_SHORTHAND_TYPES } from './array-shorthand-types.interface';
import { UpdateNumberBaseType } from './number-to-literal';
import { TASK_REGEX, TASK_REGEX_GLOBAL } from './parse-idl-type.interface';
import { PopulateTypeDisplayName } from './populate-type-display-name';
import { SetDefaultTypes } from './set-default-types';

/** Tokens we skip for now */
const SKIP: { [key: string]: undefined } = {};
SKIP[TOKEN_NAMES.COMMA] = undefined;
SKIP[TOKEN_NAMES.TYPE_OR_OPERATOR] = undefined;
SKIP[TOKEN_NAMES.UNKNOWN] = undefined;

/**
 * TODO: Put thi sin
 */
SKIP[TOKEN_NAMES.UNEXPECTED_CLOSER] = undefined;

/**
 * What names do we use for types
 */
const LITERAL_TYPE_MAP: { [key: string]: string } = {};
LITERAL_TYPE_MAP[TOKEN_NAMES.QUOTE_DOUBLE] = IDL_TYPE_LOOKUP.STRING;
LITERAL_TYPE_MAP[TOKEN_NAMES.QUOTE_SINGLE] = IDL_TYPE_LOOKUP.STRING;
LITERAL_TYPE_MAP[TOKEN_NAMES.NUMBER] = IDL_TYPE_LOOKUP.NUMBER;

/**
 * What are string types
 */
const STRING_TYPES: { [key: string]: string } = {};
STRING_TYPES[TOKEN_NAMES.QUOTE_DOUBLE] = IDL_TYPE_LOOKUP.STRING;
STRING_TYPES[TOKEN_NAMES.QUOTE_SINGLE] = IDL_TYPE_LOOKUP.STRING;

/**
 * Recurse syntax tree and extract into a type
 */
function TypeParserRecursor(tree: SyntaxTree, parsedType: IDLDataType) {
  for (let i = 0; i < tree.length; i++) {
    // check for tokens we skip
    if (tree[i].name in SKIP) {
      continue;
    }

    /** Check for type function */
    const isFunction = tree[i].name === TOKEN_NAMES.TYPE_FUNCTION;

    /** Init type */
    let baseType = isFunction ? tree[i].match[1].trim() : tree[i].match[0];

    /** Init display name */
    let displayType = baseType;

    /**
     * Handle task parsing
     */
    if (TASK_REGEX.test(baseType)) {
      const displayInfo = GetTaskDisplayName(baseType);
      baseType = displayInfo.type;
      displayType = displayInfo.type;
    }

    // init type
    const thisType: IDLDataTypeBase<IDLTypes> = {
      name: baseType,
      display: displayType,
      serialized: '',
      args: [],
      meta: {},
    };

    /**
     * Check for a literal type
     */
    if (tree[i].name in LITERAL_TYPE_MAP) {
      switch (true) {
        case tree[i].name in STRING_TYPES:
          baseType = LITERAL_TYPE_MAP[tree[i].name];
          thisType.value = [tree[i].match[1]];
          break;
        case tree[i].name === TOKEN_NAMES.NUMBER:
          UpdateNumberBaseType(thisType, tree[i].match[0]);
          baseType = thisType.name;
          break;
        default:
          baseType = LITERAL_TYPE_MAP[tree[i].name];
          thisType.value = [baseType];
          break;
      }

      thisType.name = baseType;
      thisType.display = baseType;
    }

    // set the name of the data type
    if (thisType.name.toLowerCase() in TYPE_ALIASES) {
      thisType.name = TYPE_ALIASES[thisType.name.toLowerCase()];
    }

    // check if we recurse and get type arguments or not
    if (tree[i].name === TOKEN_NAMES.TYPE_FUNCTION) {
      // split on commas because operators
      const split = SplitTreeOnCommas((tree[i] as TreeBranchToken).kids);

      // process type for each argument
      for (let j = 0; j < split.children.length; j++) {
        /** Init type for argument */
        const argType: IDLDataType = [];

        // populate type
        TypeParserRecursor(split.children[j], argType);

        // save if we found something
        if (argType.length > 0) {
          thisType.args.push(argType);
        }
      }
    }

    // make our type
    parsedType.push(thisType);
  }
}

/**
 * Post process IDL types that we have parsed or manually created
 */
export function PostProcessIDLType(type: IDLDataType) {
  // set type defaults
  SetDefaultTypes(type);

  // remove duplicates and return the top level
  const reduced = ReduceIDLDataType(type);

  // remove duplicates and process all type arguments
  for (let i = 0; i < reduced.length; i++) {
    for (let j = 0; j < reduced[i].args.length; j++) {
      reduced[i].args[j] = PostProcessIDLType(reduced[i].args[j]);
    }
  }

  // set display names
  PopulateTypeDisplayName(reduced);

  return reduced;
}

/**
 * Parses a type string as a syntax tree using type grammmar definitions
 */
export function ParseIDLType(type: string) {
  /** Initialize the IDL data type */
  const parsedType: IDLDataType = [];

  // remove `type` from the string
  let use = type.replace(/type\s*=\s*/gim, '').trim();

  // return if nothing to process
  if (use === '') {
    return parsedType;
  }

  /**
   * Normalize any task types since we support two flavors
   *
   * ENVISubsetRasterTask or ENVITask<SubsetRaster>
   *
   * This converts the first to the second. We need both because
   * our structure names in IDL and ENVI are the full name
   */
  use = use.replace(TASK_REGEX_GLOBAL, (match, g1, g2) => {
    return `${g1}Task<${g2}>`;
  });

  // normalize case
  const lc = use.toLowerCase();

  // check if we have a shorthand arr type
  if (lc.endsWith('arr')) {
    if (lc in ARRAY_SHORTHAND_TYPES) {
      use = ARRAY_SHORTHAND_TYPES[lc];
    }
  }

  /** Create cancellation token */
  const cancel = new CancellationToken();

  /** Extract type tokens */
  const tokenized = Tokenizer(use, cancel, TYPE_FIND_TOKEN_OPTIONS);

  /** Hold syntax problems */
  const problems: SyntaxProblems = [];

  /** Create syntax tree */
  const tree = SimplifiedBuildSyntaxTree(tokenized.tokens, problems, true);

  // recurse through and generate an IDL Data Type
  TypeParserRecursor(tree, parsedType);

  // post process and clean up
  return PostProcessIDLType(parsedType);
}
