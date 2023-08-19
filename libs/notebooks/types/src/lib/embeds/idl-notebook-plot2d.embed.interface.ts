import { IDLNotebookEmbeddedItem } from './idl-notebook.embed.interface';

/**
 * Placeholder data structure for properties for our plots from
 * IDL
 */
export interface IDLNotebookPlot_Properties {
  [key: string]: any;
}

/**
 * Base plot with properties for shared access
 */
export interface IDLNotebookPlot_WithProperties {
  properties?: IDLNotebookPlot_Properties;
}

/**
 * 2D plot from notebook
 */
export type IDLNotebookPlot_2D = 'idlnotebookplot_2d';

/**
 * Data structure for an image we want to embed from a URI
 */
export interface IDLNotebookPlot_2DData extends IDLNotebookPlot_WithProperties {
  /** X-axis data */
  x: number[];
  /** Y-axis data */
  y: number[];
}

/**
 * Union type of all items we can embed in a plot
 */
export type IDLNotebookPlot_EmbeddedItemType = IDLNotebookPlot_2D;

/**
 * Notebook plot
 */
export type IDLNotebookPlot = 'idlnotebookplot';

/**
 * Data for a notebook plot
 */
export interface IDLNotebookPlotData<
  T extends IDLNotebookPlot_EmbeddedItemType
> {
  /** Data that we are embedding */
  data: IDLNotebookEmbeddedItem<T>[];
}

/**
 * Types of messages that we can have
 *
 * These are the lower-case structure names from IDL
 *
 * These need to match the structures in `idl/vscode/notebooks/idlnotebook__define.pro`
 */
export type IDLNotebookPlot_EmbedType =
  | IDLNotebookPlot
  | IDLNotebookPlot_EmbeddedItemType;

/**
 * Data embedded in a notebook cell
 */
export type IDLNotebookPlot_EmbedTypeData<T extends IDLNotebookPlot_EmbedType> =
  T extends IDLNotebookPlot
    ? IDLNotebookPlotData<IDLNotebookPlot_EmbeddedItemType>
    : T extends IDLNotebookPlot_2D
    ? IDLNotebookPlot_2DData
    : never;
