import {
  IDLNotebookEmbeddedItem,
  IDLNotebookPlot,
  IDLNotebookPlot_Bubble,
  IDLNotebookPlot_BubbleAnimation,
  IDLNotebookPlot_Line,
  IDLNotebookPlot_LineAnimation,
} from '@idl/types/notebooks';
import { ChartDataset } from 'chart.js';

import { CreatedPlots, PlotAnimationCallback } from './create-plots.interface';

/**
 * Creates plot data for display in an IDL Notebook
 */
export function CreatePlots(
  embed: IDLNotebookEmbeddedItem<IDLNotebookPlot>
): CreatedPlots {
  /**
   * The plot data
   */
  const data: ChartDataset<any>[] = [];

  /**
   * Animation frame callbacks
   */
  const animationCallbacks: PlotAnimationCallback[] = [];

  /**
   * Get all items to embed
   */
  const toEmbed = embed.item.data;

  /**
   * Maximum number of frames
   */
  let nFrames = 0;

  // process all datasets
  for (let i = 0; i < toEmbed.length; i++) {
    switch (toEmbed[i].type) {
      /**
       * Check for line/scatter plot
       */
      case 'idlnotebookplot_line': {
        /** Strictly type */
        const typed = toEmbed[
          i
        ] as IDLNotebookEmbeddedItem<IDLNotebookPlot_Line>;

        // create typed dataset
        const plotData: ChartDataset<'scatter'> = {
          type: 'scatter',
          label: `Plot ${i + 1}`,
          data: typed.item.y.map((y, idx) => {
            return { x: typed.item.x[idx], y };
          }),
          showLine: true,
          // pointRadius: 0,
          pointStyle: 'triangle',
          pointBorderColor: 'red',
          pointBackgroundColor: 'red',
        };

        // create chart
        data.push(plotData);
        break;
      }

      /**
       * Check for line/scatter animation
       */
      case 'idlnotebookplot_lineanimation': {
        /** Strictly type */
        const typed = toEmbed[
          i
        ] as IDLNotebookEmbeddedItem<IDLNotebookPlot_LineAnimation>;

        // skip if no data
        if (typed.item.frames.length === 0) {
          continue;
        }

        // get the first frame
        const first = typed.item.frames[0];

        // create typed dataset
        const plotData: ChartDataset<'scatter'> = {
          type: 'scatter',
          label: `Plot ${i + 1}`,
          data: first.y.map((y, idx) => {
            return { x: first.x[idx], y };
          }),
          showLine: true,
          // pointRadius: 0,
          pointStyle: 'triangle',
          pointBorderColor: 'red',
          pointBackgroundColor: 'red',
        };

        // update the number of frames
        nFrames = Math.max(nFrames, typed.item.frames.length);

        /**
         * Add callback for our animation
         */
        animationCallbacks.push((frame: number) => {
          const fIdx = Math.min(frame, typed.item.frames.length - 1);

          /**
           * Get the frame we show
           */
          const showFrame = typed.item.frames[fIdx];

          // update label
          plotData.label = `Plot ${i + 1}, Frame ${fIdx + 1}`;

          /** update plot data */
          plotData.data = showFrame.y.map((y, idx) => {
            return { x: showFrame.x[idx], y };
          });
        });

        // create chart
        data.push(plotData);
        break;
      }

      /**
       * Check for bubble plot
       */
      case 'idlnotebookplot_bubble': {
        /** Strictly type */
        const typed = toEmbed[
          i
        ] as IDLNotebookEmbeddedItem<IDLNotebookPlot_Bubble>;

        // create typed dataset
        const plotData: ChartDataset<'bubble'> = {
          type: 'bubble',
          label: `Plot ${i + 1}`,
          data: typed.item.y.map((y, idx) => {
            return { x: typed.item.x[idx], y, r: typed.item.r[idx] };
          }),
        };

        // create chart
        data.push(plotData);
        break;
      }

      /**
       * Check for bubble plot animation
       */
      case 'idlnotebookplot_bubbleanimation': {
        /** Strictly type */
        const typed = toEmbed[
          i
        ] as IDLNotebookEmbeddedItem<IDLNotebookPlot_BubbleAnimation>;

        // skip if no data
        if (typed.item.frames.length === 0) {
          continue;
        }

        // get the first frame
        const first = typed.item.frames[0];

        // create typed dataset
        const plotData: ChartDataset<'bubble'> = {
          type: 'bubble',
          label: `Bubble plot ${i + 1}`,
          data: first.y.map((y, idx) => {
            return { x: first.x[idx], y, r: first.r[idx] };
          }),
        };

        // update the number of frames
        nFrames = Math.max(nFrames, typed.item.frames.length);

        /**
         * Add callback for our animation
         */
        animationCallbacks.push((frame: number) => {
          const fIdx = Math.min(frame, typed.item.frames.length - 1);

          /**
           * Get the frame we show
           */
          const showFrame = typed.item.frames[fIdx];

          // update label
          plotData.label = `Bubble plot ${i + 1}, Frame ${fIdx + 1}`;

          /** update plot data */
          plotData.data = showFrame.y.map((y, idx) => {
            return { x: showFrame.x[idx], y, r: showFrame.r[idx] };
          });
        });

        // track chart data
        data.push(plotData);
        break;
      }

      default:
        break;
    }
  }

  return { data, animationCallbacks, nFrames };
}
