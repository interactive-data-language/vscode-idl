/**
 * Base data structure for messages from IDL
 */
interface IDLNotebookImage_Base {
  /** Number of pixels, width */
  xsize: number;
  /** Number of pixels, height */
  ysize: number;
}

/**
 * Notebook animation from one or more encoded PNGs
 *
 * This doesn't come from IDL, instead we make this one ourselves
 * and map other messages to it
 */
export type IDLNotebookImage_AnimationFromPNGs =
  'idlnotebookimage_animationfrompngs';

/**
 * Data structure for encoded PNG from IDL
 */
export interface IDLNotebookImage_AnimationFromPNGsData
  extends IDLNotebookImage_Base {
  /** Base64 encoded PNGs */
  data: string[];
}

/**
 * Notebook animation from multiple files on disk
 */
export type IDLNotebookImage_AnimationFromUris =
  'idlnotebookimage_animationfromuris';

/**
 * Data structure for an animation we want to embed from an array
 * of images
 */
export interface IDLNotebookImage_AnimationFromUrisData
  extends IDLNotebookImage_Base {
  /** fully qualified filepaths to images */
  uris: string[];
}

/**
 * Notebook image from a file on disk
 */
export type IDLNotebookImage_FromURI = 'idlnotebookimage_fromuri';

/**
 * Data structure for an image we want to embed from a URI
 */
export interface IDLNotebookImage_FromURIData extends IDLNotebookImage_Base {
  /** Fully-qualified filepath to image */
  uri: string;
}

/**
 * Notebook encoded PNG
 */
export type IDLNotebookImage_PNG = 'idlnotebookimage_png';

/**
 * Data structure for encoded PNG from IDL
 */
export interface IDLNotebookImage_PNGData extends IDLNotebookImage_Base {
  /** Base64 encoded PNG */
  data: string;
}

/**
 * All types that can be from embedded notebooks
 */
export type IDLNotebookImage_EmbedType =
  | IDLNotebookImage_AnimationFromPNGs
  | IDLNotebookImage_AnimationFromUris
  | IDLNotebookImage_PNG
  | IDLNotebookImage_FromURI;

/**
 * Data embedded in a notebook cell
 */
export type IDLNotebookImage_EmbedTypeData<
  T extends IDLNotebookImage_EmbedType
> = T extends IDLNotebookImage_AnimationFromPNGs
  ? IDLNotebookImage_AnimationFromPNGsData
  : T extends IDLNotebookImage_AnimationFromUris
  ? IDLNotebookImage_AnimationFromUrisData
  : T extends IDLNotebookImage_PNG
  ? IDLNotebookImage_PNGData
  : T extends IDLNotebookImage_FromURI
  ? IDLNotebookImage_FromURIData
  : never;
