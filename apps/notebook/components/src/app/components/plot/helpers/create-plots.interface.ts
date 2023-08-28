import { ChartDataset } from 'chart.js';

/**
 * Callback data structure for an animation frame
 */
export type PlotAnimationCallback = (frame: number) => void;

/**
 * Data structure for plots that we created
 */
export type CreatedPlots = {
  /**
   * Chart datasets
   */
  data: ChartDataset<any>[];
  /**
   * Animation callbacks
   */
  animationCallbacks: PlotAnimationCallback[];
  /**
   * Largest number of frames
   */
  nFrames: number;
};
