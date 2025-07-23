/**
 * Set IDL breakpoint
 */
export type BreakpointRequest = 'breakpoint';

/** Parameters to set preferences */
export type BreakpointParams = {
  /** File on disk */
  file: string;
  /** One based? */
  line: number;
  /** For new breakpoint, set as true */
  set?: boolean;
  clear?: boolean;
  enable?: boolean;
  disable?: boolean;
  condition?: string;
  once?: boolean;
  after?: number;
  onRecompile?: boolean;
};

/**
 * If breakpoint is set or not
 */
export type BreakpointResponse = boolean;
