import { IDLCallStackItem } from './idl.interface';

/**
 * Output that gets returned from our IDL process
 *
 * Typed out for consistency
 */
export interface IDLOutput {
  /** Output from IDL as a string */
  idlOutput: string;
  /** Information about where we stopped */
  stopped?: {
    /** Where are we stopped */
    stack: IDLCallStackItem;
  };
}
