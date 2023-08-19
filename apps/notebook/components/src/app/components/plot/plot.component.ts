import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { IDLNotebookPlot } from '@idl/notebooks/types';
import Chart from 'chart.js/auto';

import { VSCodeRendererMessenger } from '../../services/vscode-renderer-messenger.service';
import { BaseRendererComponent } from '../base-renderer.component';
import { DataSharingService } from '../data-sharing.service';
import { CreatePlots } from './helpers/create-plots';

/**
 * ID for notebook image selector
 */
export const IDL_NB_PLOT_COMPONENT_SELECTOR = 'idl-nb-plot';

/**
 * Component that creates a 2D line plot from data
 */
@Component({
  selector: 'idl-nb-plot',
  templateUrl: './plot.component.html',
  styles: [
    `
      .chart-container {
        max-width: 90%;
        aspect-ratio: 1;
      }
    `,
  ],
})
export class PlotComponent
  extends BaseRendererComponent<IDLNotebookPlot>
  implements AfterViewInit, OnDestroy
{
  /**
   * Canvas we draw to
   */
  @ViewChild('PlotCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

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
      this.canvas.nativeElement.style.width = `${
        this.el.nativeElement.offsetWidth * 0.9
      }px;`;
      this.canvas.nativeElement.style.height = `${
        this.el.nativeElement.offsetHeight * 0.9
      }px;`;
      this.chart.resize();
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

    // add resize event listener
    window.addEventListener('resize', this.resizeCb);
  }

  /**
   * Remove callbacks to prevent memory leaks
   */
  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeCb);
  }

  ngAfterViewInit() {
    if (this.hasData) {
      this.chart = new Chart(this.canvas.nativeElement, {
        data: {
          datasets: CreatePlots(this._embed),
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      });
    }
  }
}