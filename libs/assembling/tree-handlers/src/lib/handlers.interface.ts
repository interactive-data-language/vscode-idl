import { ICodeStyle } from '@idl/assembling/config';
import {
  IHandlerCallbackMetadata,
  TreeCallbackHandler,
} from '@idl/parsing/syntax-tree';

/**
 * Type for metadata in our assembler style callbacks
 */
export interface AssemblerStyleMeta extends IHandlerCallbackMetadata {
  /**
   * Config for the current assembler
   */
  style: ICodeStyle;
  /**
   * Do we style code as if we know nothing about the source?
   */
  vanilla?: boolean;
}

/**
 * for any tree handler, the type that they all need.
 */
export type AssemblingStyleTreeHandler =
  TreeCallbackHandler<AssemblerStyleMeta>;

/**
 * For tree problem fixing handler
 */
export type AssemblingFixerTreeHandler =
  TreeCallbackHandler<IHandlerCallbackMetadata>;
