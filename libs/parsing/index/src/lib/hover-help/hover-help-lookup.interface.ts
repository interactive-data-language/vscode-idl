import { GlobalTokenType } from '@idl/data-types/core';
import { PositionArray } from '@idl/parsing/tokenizer-types';

/**
 * Lightweight version of hover help that reduces the amount of data that needs to
 * be passed around
 */
export interface IHoverHelpLookup<T extends GlobalTokenType> {
  /** Type of global token */
  type: T;
  /** Name of the global token */
  name: string;
  /** Position in our document that we show hover help for */
  pos: PositionArray;
  /** Name of the argument we want */
  arg?: string;
  /** Name of the argument we want */
  kw?: string;
  /** Name of the property we want */
  prop?: string;
}
