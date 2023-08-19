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
 * A single frame of data for a line plot
 */
export interface IDLNotebookPlot_LineFrame {
  /** X-axis data */
  x: number[];
  /** Y-axis data */
  y: number[];
}

/**
 * Line/scatter plot
 */
export type IDLNotebookPlot_Line = 'idlnotebookplot_line';

/**
 * Data structure for an image we want to embed from a URI
 */
export interface IDLNotebookPlot_LineData
  extends IDLNotebookPlot_WithProperties,
    IDLNotebookPlot_LineFrame {}

/**
 * Data structure for a frame of data for a bubble plot
 */
export interface IDLNotebookPlot_BubbleFrame extends IDLNotebookPlot_LineFrame {
  /** Size of bubbles */
  r: number[];
}

/**
 * Bubble plot from notebook
 */
export type IDLNotebookPlot_Bubble = 'idlnotebookplot_bubble';

/**
 * Data structure for an image we want to embed from a URI
 */
export interface IDLNotebookPlot_BubbleData
  extends IDLNotebookPlot_WithProperties,
    IDLNotebookPlot_BubbleFrame {}

/**
 * Union type of all items we can embed in a plot
 */
export type IDLNotebookPlot_EmbeddedItemType =
  | IDLNotebookPlot_Line
  | IDLNotebookPlot_Bubble;

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
    : T extends IDLNotebookPlot_Line
    ? IDLNotebookPlot_LineData
    : T extends IDLNotebookPlot_Bubble
    ? IDLNotebookPlot_BubbleData
    : never;
