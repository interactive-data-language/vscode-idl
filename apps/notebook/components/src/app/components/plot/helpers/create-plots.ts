import {
  IDLNotebookEmbeddedItem,
  IDLNotebookPlot,
  IDLNotebookPlot_Bubble,
  IDLNotebookPlot_Line,
} from '@idl/notebooks/types';
import { ChartDataset } from 'chart.js';

import { CreatedPlots, PlotAnimationCallback } from './create-plot.interface';

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

  // process all datasets
  for (let i = 0; i < toEmbed.length; i++) {
    switch (toEmbed[i].type) {
      case 'idlnotebookplot_line': {
        /** Strictly type */
        const typed = toEmbed[
          i
        ] as IDLNotebookEmbeddedItem<IDLNotebookPlot_Line>;

        // create typed dataset
        const plotData: ChartDataset<'scatter'> = {
          type: 'scatter',
          label: 'Test',
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

      case 'idlnotebookplot_bubble': {
        /** Strictly type */
        const typed = toEmbed[
          i
        ] as IDLNotebookEmbeddedItem<IDLNotebookPlot_Bubble>;

        // create typed dataset
        const plotData: ChartDataset<'bubble'> = {
          type: 'bubble',
          label: 'Test',
          data: typed.item.y.map((y, idx) => {
            return { x: typed.item.x[idx], y, r: typed.item.r[idx] };
          }),
        };

        // create chart
        data.push(plotData);
        break;
      }

      default:
        break;
    }
  }

  return { data, animationCallbacks };
}
