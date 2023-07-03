import { TreeCallbackHandler } from './recursion-and-callbacks/tree-callback-handler.class';
import { IHandlerCallbackMetadata } from './recursion-and-callbacks/tree-callback-handler.interface';

/**
 * Type for metadata in our validator callbacks
 */
export type IDLPostProcessorMeta = IHandlerCallbackMetadata;

/**
 * NOTE: ALL CALLBACKS HAVE PLACEHOLDER VALUES FOR EVERYTHING BESIDES THE
 * FIRST ARGUMENT.
 *
 * Manages validating and making sure that syntax is correct for IDL code.
 *
 * There are three kinds of validators: basic, branch, and tree.
 *
 * Basic validators are for basic tokens, branch validators are for tokens
 * with a start and an end, and tree validators process the entire syntax tree.
 */
export const IDL_SYNTAX_TREE_POST_PROCESSOR =
  new TreeCallbackHandler<IDLPostProcessorMeta>();
