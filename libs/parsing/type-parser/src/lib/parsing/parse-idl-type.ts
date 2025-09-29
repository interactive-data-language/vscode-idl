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
import { ReduceIDLDataType } from '../serializing/reduce-types';
import { ARRAY_SHORTHAND_TYPES } from './array-shorthand-types.interface';
import { TASK_REGEX } from './parse-idl-type.interface';
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
      args: [],
      meta: {},
    };

    /**
     * Check for a literal type
     */
    if (tree[i].name in LITERAL_TYPE_MAP) {
      // sae value
      thisType.value = [baseType];

      // update name
      baseType = LITERAL_TYPE_MAP[tree[i].name];
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
  const tokenized = Tokenizer(type, cancel, TYPE_FIND_TOKEN_OPTIONS);

  /** Hold syntax problems */
  const problems: SyntaxProblems = [];

  /** Create syntax tree */
  const tree = SimplifiedBuildSyntaxTree(tokenized.tokens, problems, true);

  // recurse through and generate an IDL Data Type
  TypeParserRecursor(tree, parsedType);

  // set type defaults
  SetDefaultTypes(parsedType);

  // set display names
  PopulateTypeDisplayName(parsedType);

  // reduce types so that, if we have duplicates, we remove them
  const reduced = ReduceIDLDataType(parsedType);

  // remove duplicates and return
  return reduced;
}
