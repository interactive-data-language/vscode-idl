import { CancellationToken } from '@idl/cancellation-tokens';
import {
  FindDirectBranchChildren,
  IParsed,
  SplitTreeOnCommas,
  SyntaxProblemWithTranslation,
  TreeToken,
} from '@idl/parsing/syntax-tree';
import { BracketToken, TOKEN_NAMES } from '@idl/parsing/tokenizer';
import {
  IDL_ANY_TYPE,
  IDLDataType,
  IDLTypeHelper,
  KNOWN_IDL_TYPES,
  ParseIDLType,
  SerializeIDLType,
} from '@idl/types/core';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
import copy from 'fast-copy';

import { GetTypeBefore } from '../../../helpers/get-type-before';
import { IDLIndex } from '../../../idl-index.class';
import {
  ALLOWED_TO_INDEX,
  ALLOWED_TYPES_AS_INDEX,
} from './type-from-indexing.interface';
import { TypeFromTokens } from './type-from-tokens';

/**
 * Attempts to determine type from indexing a variable
 */
export function TypeFromIndexing(
  index: IDLIndex,
  parsed: IParsed,
  token: TreeToken<BracketToken>
): IDLDataType {
  // get the type before
  const type = GetTypeBefore(
    index,
    {
      token: token,
      accessTokens: token.accessTokens,
      scope: token.scope,
      scopeTokens: token.scopeTokens,
      globalParent: {
        token: token.scopeTokens[0],
        type: 'function', // doesn't matter,
        name: '', // doesnt matter
      },
      cancel: new CancellationToken(),
    },
    parsed
  );

  // return if we have any
  if (IDLTypeHelper.isAnyType(type)) {
    return copy(IDL_ANY_TYPE);
  }

  // get all possible return types, first type argument for any compound type
  let possibleTypes: IDLDataType = [];

  // validate every data type to make sure we can use indexing
  for (let i = 0; i < type.length; i++) {
    // only report errors if known
    if (type[i].name in KNOWN_IDL_TYPES) {
      if (type[i].name in ALLOWED_TO_INDEX) {
        possibleTypes = possibleTypes.concat(type[i].args[0]);
      } else {
        possibleTypes.push(type[i]);
      }
    }
  }

  // return if nothing
  if (possibleTypes.length === 0) {
    return copy(IDL_ANY_TYPE);
  }

  /**
   * Remove duplicates
   */
  possibleTypes = IDLTypeHelper.reduceIDLDataType(possibleTypes);

  // get the return type if we have an array present for indexing
  let baseType = '';
  switch (true) {
    case IDLTypeHelper.isType(type, 'array'):
      baseType = 'Array';
      break;
    case IDLTypeHelper.isType(type, 'list'):
      baseType = 'List';
      break;
    case IDLTypeHelper.isType(type, 'hash'):
      baseType = 'Hash';
      break;
    case IDLTypeHelper.isType(type, 'orderedhash'):
      baseType = 'OrderedHash';
      break;
    case IDLTypeHelper.isType(type, 'dictionary'):
      baseType = 'Dictionary';
      break;
    default:
    /**
     * TODO: check if we have an overload method for brackets indicating that
     * we can, in fact, return something instead of "any"
     */
    // return copy(IDL_ANY_TYPE);
  }

  // make return type for quick access
  const returnType =
    baseType === ''
      ? possibleTypes
      : ParseIDLType(`${baseType}<${SerializeIDLType(possibleTypes)}>`);

  // if we have colons we are returning a slice/subscript range and also an array
  const colons = FindDirectBranchChildren(token, TOKEN_NAMES.COLON);
  if (colons.length > 0) {
    switch (true) {
      case baseType === 'Array' || baseType === 'List':
        return returnType;
      default:
        /**
         * If we index a scalar with an array, we return an array of our original
         * type
         */
        if (baseType === '') {
          return ParseIDLType(`Array<${SerializeIDLType(possibleTypes)}>`);
        }

        parsed.postProcessProblems.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.ILLEGAL_SUBSCRIPT,
            token.pos,
            token?.end ? token.end.pos : token.pos
          )
        );
        return copy(IDL_ANY_TYPE);
    }
  }

  // check simple case where we have an asterisk which means we return an array
  const kids = FindDirectBranchChildren(token, TOKEN_NAMES.OPERATOR_INDEXING);
  if (kids.length > 0) {
    return returnType;
  }

  // split indexing by commas
  const split = SplitTreeOnCommas(token.kids);

  /** Flag if we are indexing with an array */
  let haveArray = false;

  // check all elements
  for (let i = 0; i < split.children.length; i++) {
    // get type from our children
    const childType = TypeFromTokens(index, parsed, split.children[i]);

    // return if any
    if (IDLTypeHelper.isAnyType(childType)) {
      return copy(IDL_ANY_TYPE);
    }

    // check for invalid indexing type
    for (let j = 0; j < childType.length; j++) {
      if (!(childType[j].name in ALLOWED_TYPES_AS_INDEX)) {
        parsed.postProcessProblems.push(
          SyntaxProblemWithTranslation(
            IDL_PROBLEM_CODES.ILLEGAL_INDEX_TYPE,
            token.pos,
            token?.end ? token.end.pos : token.pos
          )
        );
        return copy(IDL_ANY_TYPE);
      }
    }

    // check for array
    if (IDLTypeHelper.isType(childType, 'array')) {
      haveArray = true;
      break;
    }
  }

  /**
   * Determine what kind of value might be returned
   */
  switch (true) {
    /**
     * If we have an array, we return any types that have type args which
     * indicates that they can have subscripting
     */
    case haveArray:
      if (baseType === '') {
        return ParseIDLType(`Array<${SerializeIDLType(possibleTypes)}>`);
      }
      return returnType;
    /**
     * Default is that we return the types from our type args
     *
     * Even if we have an "any" in our indexing, we will be lenient
     * and assume that the user is doing the right thing to index
     */
    default:
      // if any is type, return any
      if (IDLTypeHelper.isAnyType(possibleTypes)) {
        return copy(IDL_ANY_TYPE);
      } else {
        return possibleTypes;
      }
  }
}
