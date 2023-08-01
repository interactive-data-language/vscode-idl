/**
 * Interface for !magic in IDL
 */
export interface BangMagic {
  embed: 1 | 0;
  window: number;
  type: 0 | 1 | 2;
  xsize: number;
  ysize: number;
}

/**
 * Interface for !envi_magic in IDL
 */
export interface BangENVIMagic {
  /** Path to file */
  uri: string;
  xsize: number;
  ysize: number;
}
