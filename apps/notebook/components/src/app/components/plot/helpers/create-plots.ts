import {
  IDLNotebookEmbeddedItem,
  IDLNotebookPlot,
  IDLNotebookPlot_2D,
} from '@idl/notebooks/types';
import { ChartDataset } from 'chart.js';

/**
 * Creates plot data for display in an IDL Notebook
 */
export function CreatePlots(embed: IDLNotebookEmbeddedItem<IDLNotebookPlot>) {
  /**
   * The plot data
   */
  const data: ChartDataset<any>[] = [];

  /**
   * Get all items to embed
   */
  const toEmbed = embed.item.data;

  // process all datasets
  for (let i = 0; i < toEmbed.length; i++) {
    switch (toEmbed[i].type) {
      case 'idlnotebookplot_2d': {
        /** Strictly type */
        const typed = toEmbed[i] as IDLNotebookEmbeddedItem<IDLNotebookPlot_2D>;

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
      default:
        break;
    }
  }

  return data;
}
