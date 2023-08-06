/**
 * !!!IMPORTANT!!!
 *
 * These need to match the structures in `idl/vscode/notebooks/idlnotebook__define.pro`
 */

/**
 * Base data structure for messages from IDL
 */
interface IDLNotebookBaseImageData {
  /** Number of pixels, width */
  xsize: number;
  /** Number of pixels, height */
  ysize: number;
}

/**
 * Notebook encoded PNG
 */
export type IDLNotebookEncodedPNG = 'idlnotebookencodedpng';

/**
 * Data structure for encoded PNG from IDL
 */
export interface IDLNotebookEncodedPNGData extends IDLNotebookBaseImageData {
  /** Base64 encoded PNG */
  data: string;
}

/**
 * Notebook animation from one or more encoded PNGs
 *
 * This doesn't come from IDL, instead we make this one ourselves
 * and map other messages to it
 */
export type IDLNotebookAnimationFromEncodedPNGs =
  'idlnotebookanimationfromencodedpngs';

/**
 * Data structure for encoded PNG from IDL
 */
export interface IDLNotebookAnimationFromEncodedPNGsData
  extends IDLNotebookBaseImageData {
  /** Base64 encoded PNGs */
  data: string[];
}

/**
 * Notebook image from a file on disk
 */
export type IDLNotebookImageFromURI = 'idlnotebookimagefromuri';

/**
 * Data structure for an image we want to embed from a URI
 */
export interface IDLNotebookImageFromURIData extends IDLNotebookBaseImageData {
  /** Fully-qualified filepath to image */
  uri: string;
}

/**
 * Notebook animation from multiple files on disk
 */
export type IDLNotebookAnimationFromURIs = 'idlnotebookanimationfromuris';

/**
 * Data structure for an animation we want to embed from an array
 * of images
 */
export interface IDLNotebookAnimationFromURIsData
  extends IDLNotebookBaseImageData {
  /** fully qualified filepaths to images */
  uris: string[];
}

/**
 * Types of messages that we can have
 *
 * These are the lower-case structure names from IDL
 *
 * These need to match the structures in `idl/vscode/notebooks/idlnotebook__define.pro`
 */
export type IDLNotebookEmbedType =
  | IDLNotebookEncodedPNG
  | IDLNotebookAnimationFromEncodedPNGs
  | IDLNotebookImageFromURI
  | IDLNotebookAnimationFromURIs;

/**
 * Data embedded in a notebook cell
 */
export type IDLNotebookEmbeddedItemData<T extends IDLNotebookEmbedType> =
  T extends IDLNotebookEncodedPNG
    ? IDLNotebookEncodedPNGData
    : T extends IDLNotebookAnimationFromEncodedPNGs
    ? IDLNotebookAnimationFromEncodedPNGsData
    : T extends IDLNotebookImageFromURI
    ? IDLNotebookImageFromURIData
    : T extends IDLNotebookAnimationFromURIs
    ? IDLNotebookAnimationFromURIsData
    : never;

/**
 * Data structure for notebook embedded items
 */
export type IDLNotebookEmbeddedItem<T extends IDLNotebookEmbedType> = {
  /**
   * The type of the item which is the lower-case structure name from IDL
   */
  type: T;
  /**
   * Data that we have embedded
   *
   * Lower-case stringified structure from IDL
   */
  data: IDLNotebookEmbeddedItemData<T>;
};

/**
 * Data type for embedded items from IDL
 */
export type IDLNotebookEmbeddedItems =
  IDLNotebookEmbeddedItem<IDLNotebookEmbedType>[];
