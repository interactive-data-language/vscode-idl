import { BasicTokenNames, NonBasicTokenNames } from '@idl/parsing/tokenizer';

import { SyntaxTree, TreeToken } from '../branches.interface';
import { IParsed } from '../parsed.interface';
import { ITreeRecurserCurrent } from './tree-recurser.interface';

/**
 * Information passed to each handler callback
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IHandlerCallbackMetadata extends ITreeRecurserCurrent {}

/**
 * @param {TreeToken<BasicTokenNames>} token The token we are pre-processing
 * @param {IParsed} parsed Complete parsed code
 */
export type BaseBasicCallbackArgs<T extends BasicTokenNames> = [
  token: TreeToken<T>,
  parsed: IParsed
];

/**
 * @param {TreeToken<BasicTokenNames>} token The token we are pre-processing
 * @param {IParsed} parsed Complete parsed code
 * @param {TMeta} meta Additional metadata
 */
export type BasicCallbackArgs<
  T extends BasicTokenNames,
  TMeta extends IHandlerCallbackMetadata
> = [token: TreeToken<T>, parsed: IParsed, meta: TMeta];

/**
 * Callback to process a basic token
 */
export type BasicCallback<
  T extends BasicTokenNames,
  TMeta extends IHandlerCallbackMetadata
> = (...args: BasicCallbackArgs<T, TMeta>) => void;

/**
 * Lookup of callbacks for basic tokens
 */
export type BasicCallbackLookup<TMeta extends IHandlerCallbackMetadata> = {
  // don't use "property" for the type on the right here
  [property in BasicTokenNames]?: BasicCallback<BasicTokenNames, TMeta>[];
};

/**
 * @param {TreeToken<NonBasicTokenNames>} branch The branch we are processing
 * @param {IParsed} parsed Complete parsed code
 * @param {TMeta} meta Additional metadata
 */
export type BranchCallbackArgs<
  T extends NonBasicTokenNames,
  TMeta extends IHandlerCallbackMetadata
> = [branch: TreeToken<T>, parsed: IParsed, meta: TMeta];

/**
 * Callback to process a branch
 */
export type BranchCallback<
  T extends NonBasicTokenNames,
  TMeta extends IHandlerCallbackMetadata
> = (...args: BranchCallbackArgs<T, TMeta>) => void;

/**
 * Lookup of branch callbacks
 */
export type BranchCallbackLookup<TMeta extends IHandlerCallbackMetadata> = {
  // don't use "property" for the type on the right here, it screws up types
  [property in NonBasicTokenNames]?: BranchCallback<
    NonBasicTokenNames,
    TMeta
  >[];
};

/**
 * @param {TreeToken[]} tree The complete syntax tree to process
 * @param {IParsed} parsed Complete parsed code
 * @param {TMeta} meta Additional metadata
 */
export type TreeCallbackArgs<TMeta extends IHandlerCallbackMetadata> = [
  tree: SyntaxTree,
  parsed: IParsed,
  meta: TMeta
];

/**
 * Callback to process a syntax tree
 */
export type TreeCallback<TMeta extends IHandlerCallbackMetadata> = (
  ...args: TreeCallbackArgs<TMeta>
) => void;

/**
 * Lookup for syntax tree callbacks
 */
export type TreeCallbackLookup<TMeta extends IHandlerCallbackMetadata> =
  TreeCallback<TMeta>[];
