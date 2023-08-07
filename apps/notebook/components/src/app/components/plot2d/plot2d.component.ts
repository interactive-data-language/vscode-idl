import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  SkipSelf,
} from '@angular/core';
import { IDLNotebookPlot2D } from '@idl/notebooks/types';
import Chart from 'chart.js/auto';

import { VSCodeRendererMessenger } from '../../services/vscode-renderer-messenger.service';
import { BaseRendererComponent } from '../base-renderer.component';
import { DataSharingService } from '../data-sharing.service';

/**
 * ID for notebook image selector
 */
export const IDL_NB_PLOT2D_COMPONENT_SELECTOR = 'idl-nb-plot2d';

/**
 * Component that creates a 2D line plot from data
 */
@Component({
  selector: 'idl-nb-plot2d',
  templateUrl: './plot2d.component.html',
  styles: [
    `
      .chart-container {
        max-width: 90%;
        aspect-ratio: 1;
      }
    `,
  ],
})
export class Plot2DComponent
  extends BaseRendererComponent<IDLNotebookPlot2D>
  implements OnInit, OnDestroy
{
  /**
   * A unique ID for the chart (needed so we can handle multiple charts)
   */
  private chartId = `chart-${Math.floor(performance.now())}`;

  /**
   * A reference to our chart
   */
  private chart: Chart<any> | undefined;

  /**
   * Callback to resize chart on window resize
   *
   * It re-draws when we get smaller, but not when we grow again
   */
  private resizeCb = () => {
    if (this.chart !== undefined) {
      this.chart.update();
    }
  };

  /**
   * We can access the latest data directly through our dataService which tracks
   * the last value on $embed
   */
  constructor(
    @SkipSelf() dataService: DataSharingService,
    messenger: VSCodeRendererMessenger,
    private el: ElementRef<HTMLElement>
  ) {
    super(dataService, messenger);

    // add canvas element with unique ID
    this.el.nativeElement.insertAdjacentHTML(
      'afterbegin',
      `<canvas class="chart-container" id="${this.chartId}"></canvas>`
    );

    // add resize event listener
    window.addEventListener('resize', this.resizeCb);
  }

  /**
   * Remove callbacks to prevent memory leaks
   */
  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeCb);
  }

  ngOnInit() {
    if (this.hasData) {
      this.chart = new Chart(this.chartId, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Test',
              data: this._embed.item.y.map((y, idx) => {
                return { x: this._embed.item.x[idx], y };
              }),
              showLine: true,
              // pointRadius: 0,
              pointStyle: 'triangle',
              pointBorderColor: 'red',
              pointBackgroundColor: 'red',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      });
    }
  }
}
