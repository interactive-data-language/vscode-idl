/**
 * !!!IMPORTANT!!!
 *
 * These need to match the structures in `idl/vscode/notebooks/idlnotebook__define.pro`
 */

import {
  IDLNotebookImage_EmbedType,
  IDLNotebookImage_EmbedTypeData,
} from './idl-notebook-image.embed.interface';
import {
  IDLNotebookMap_EmbedType,
  IDLNotebookMap_EmbedTypeData,
} from './idl-notebook-map.embed.interface';
import {
  IDLNotebookPlot_EmbedType,
  IDLNotebookPlot_EmbedTypeData,
} from './idl-notebook-plot.embed.interface';

/**
 * Types of messages that we can have
 *
 * These are the lower-case structure names from IDL
 *
 * These need to match the structures in `idl/vscode/notebooks/idlnotebook__define.pro`
 */
export type IDLNotebook_EmbedType =
  | IDLNotebookImage_EmbedType
  | IDLNotebookMap_EmbedType
  | IDLNotebookPlot_EmbedType;

/**
 * Data embedded in a notebook cell
 */
export type IDLNotebook_EmbedTypeData<T extends IDLNotebook_EmbedType> =
  T extends IDLNotebookImage_EmbedType
    ? IDLNotebookImage_EmbedTypeData<T>
    : T extends IDLNotebookMap_EmbedType
    ? IDLNotebookMap_EmbedTypeData<T>
    : T extends IDLNotebookPlot_EmbedType
    ? IDLNotebookPlot_EmbedTypeData<T>
    : never;

/**
 * Data structure for notebook embedded items
 */
export type IDLNotebookEmbeddedItem<T extends IDLNotebook_EmbedType> = {
  /**
   * The type of the item which is the lower-case structure name from IDL
   */
  type: T;
  /**
   * Data that we have embedded
   *
   * Lower-case stringified structure from IDL
   */
  item: IDLNotebook_EmbedTypeData<T>;
};

/**
 * Data type for embedded items from IDL
 */
export type IDLNotebookEmbeddedItems =
  IDLNotebookEmbeddedItem<IDLNotebook_EmbedType>[];
