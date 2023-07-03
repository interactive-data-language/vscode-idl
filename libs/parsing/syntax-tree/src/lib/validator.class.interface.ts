import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { BasicTokenNames, NonBasicTokenNames } from '@idl/parsing/tokenizer';

import { IBasicBranch, IBranch, SyntaxTree } from './branches.interface';

/**
 * @param {IBasicToken} token The token we are validating
 * @param {PositionArray} pos token position as `[line, index, length]`
 * @param {ISyntaxLookup} syntax Syntax problem lookup to add directly to
 */
export type BasicValidatorArgs<T extends BasicTokenNames> = [
  token: IBasicBranch<T>,
  syntax: SyntaxProblems
];

/**
 * Callback to validate a basic token
 */
export type BasicValidator<T extends BasicTokenNames> = (
  ...args: BasicValidatorArgs<T>
) => void;

/**
 * Lookup for validating basic tokens
 */
export type BasicValidatorLookup = {
  [property in BasicTokenNames]?: BasicValidator<property>[];
};

/**
 * @param {IBranch} branch The branch we are validating
 * @param {ISyntaxLookup} syntax Syntax problem lookup to add directly to
 */
export type BranchValidatorArgs<T extends NonBasicTokenNames> = [
  branch: IBranch<T>,
  syntax: SyntaxProblems
];

/**
 * Callback to validate a branch
 */
export type BranchValidator<T extends NonBasicTokenNames> = (
  ...args: BranchValidatorArgs<T>
) => void;

/**
 * Lookup for validating branches
 */
export type BranchValidatorLookup = {
  [property in NonBasicTokenNames]?: BranchValidator<property>[];
};

/**
 * @param {TreeToken[]} tree The complete syntax tree to validate
 * @param {ISyntaxLookup} syntax Syntax problem lookup to add directly to
 */
export type TreeValidatorArgs = [tree: SyntaxTree, syntax: SyntaxProblems];

/**
 * Callback to validate a syntax tree
 */
export type TreeValidator = (...args: TreeValidatorArgs) => void;

/**
 * Lookup for syntax tree validators
 */
export type TreeValidatorLookup = TreeValidator[];
