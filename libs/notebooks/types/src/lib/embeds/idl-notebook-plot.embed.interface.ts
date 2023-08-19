import { ChartOptions } from 'chart.js';

import { IDLNotebookEmbeddedItem } from './idl-notebook.embed.interface';

/**
 * Base plot with properties for shared access
 */
export interface IDLNotebookPlot_WithProperties {
  properties?: { [key: string]: any };
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
 * Data structure for Line/scatter plot
 */
export interface IDLNotebookPlot_LineData
  extends IDLNotebookPlot_WithProperties,
    IDLNotebookPlot_LineFrame {}

/**
 * Line/scatter animation
 */
export type IDLNotebookPlot_LineAnimation = 'idlnotebookplot_lineanimation';

/**
 * Data structure for Line/scatter animation
 */
export interface IDLNotebookPlot_LineAnimationData
  extends IDLNotebookPlot_WithProperties {
  /**
   * The data frames for animation
   */
  frames: IDLNotebookPlot_LineFrame[];
}

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
 * Data structure for bubble plot
 */
export interface IDLNotebookPlot_BubbleData
  extends IDLNotebookPlot_WithProperties,
    IDLNotebookPlot_BubbleFrame {}

/**
 * Bubble plot animation from notebook
 */
export type IDLNotebookPlot_BubbleAnimation = 'idlnotebookplot_bubbleanimation';

/**
 * Data structure for bubble plot animation
 */
export interface IDLNotebookPlot_BubbleAnimationData
  extends IDLNotebookPlot_WithProperties {
  /**
   * The data frames for animation
   */
  frames: IDLNotebookPlot_BubbleFrame[];
}

/**
 * Union type of all items we can embed in a plot
 */
export type IDLNotebookPlot_EmbeddedItemType =
  | IDLNotebookPlot_Line
  | IDLNotebookPlot_LineAnimation
  | IDLNotebookPlot_Bubble
  | IDLNotebookPlot_BubbleAnimation;

/**
 * Notebook plot
 */
export type IDLNotebookPlot = 'idlnotebookplot';

/**
 * Placeholder data structure for properties for our plots from
 * IDL
 */
export interface IDLNotebookPlot_Properties extends ChartOptions {
  /**
   * Animation frame interval (ms) (i.e. delay between frames)
   */
  frameInterval?: number;
}

/**
 * Data for a notebook plot
 */
export interface IDLNotebookPlotData<
  T extends IDLNotebookPlot_EmbeddedItemType
> {
  /** Data that we are embedding */
  data: IDLNotebookEmbeddedItem<T>[];
  /** Properties for the chart */
  properties?: IDLNotebookPlot_Properties;
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
    : T extends IDLNotebookPlot_LineAnimation
    ? IDLNotebookPlot_LineAnimationData
    : T extends IDLNotebookPlot_Bubble
    ? IDLNotebookPlot_BubbleData
    : T extends IDLNotebookPlot_BubbleAnimation
    ? IDLNotebookPlot_BubbleAnimationData
    : never;
