/**
 * 2D plot from notebook
 */
export type IDLNotebookPlot2D = 'idlnotebookplot2d';

/**
 * Data structure for an image we want to embed from a URI
 */
export interface IDLNotebookPlot2DData {
  /** X-axis data */
  x: number[];
  /** Y-axis data */
  y: number[];
}

/**
 * Types of messages that we can have
 *
 * These are the lower-case structure names from IDL
 *
 * These need to match the structures in `idl/vscode/notebooks/idlnotebook__define.pro`
 */
export type IDLNotebookPlot2D_EmbedType = IDLNotebookPlot2D;

/**
 * Data embedded in a notebook cell
 */
export type IDLNotebookPlot2D_EmbedTypeData<
  T extends IDLNotebookPlot2D_EmbedType
> = T extends IDLNotebookPlot2D ? IDLNotebookPlot2DData : never;
