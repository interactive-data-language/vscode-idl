import { ChartDataset } from 'chart.js';

/**
 * Callback data structure for an animation frame
 */
export type PlotAnimationCallback = (frame: number) => void;

/**
 * Data structure for plots that we created
 */
export type CreatedPlots = {
  data: ChartDataset<any>[];
  animationCallbacks: PlotAnimationCallback[];
};
