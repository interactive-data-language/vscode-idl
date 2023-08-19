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
import { ChartConfig } from './helpers/chart-config';
import { CreatePlots } from './helpers/create-plots';
import { CreatedPlots } from './helpers/create-plots.interface';

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
      @import 'shared-styles.scss';
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
   * Track a reference to our created plots
   */
  plots: CreatedPlots = {
    data: [],
    animationCallbacks: [],
    nFrames: 0,
  };

  /**
   * Frame rate for animations
   */
  interval = 1000;

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
   * If we have an animation, updates chart data
   */
  setFrame(frame: number) {
    if (this.hasData) {
      const nAnimations = this.plots.animationCallbacks.length;
      if (nAnimations > 0) {
        for (let i = 0; i < nAnimations; i++) {
          this.plots.animationCallbacks[i](frame);
        }

        // update chart with no animation
        this.chart?.update('none');
      }
    }
  }

  /**
   * Remove callbacks to prevent memory leaks
   */
  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeCb);
    if (this.hasData) {
      this.hasData = false;
      this.plots = {
        animationCallbacks: [],
        data: [],
        nFrames: 0,
      };
      this.chart?.destroy();
    }
  }

  ngAfterViewInit() {
    if (this.hasData) {
      // create plot data
      this.plots = CreatePlots(this._embed);

      // create options for our plot
      const options = ChartConfig(this._embed, this.plots.nFrames > 0);

      // update interval
      if (options.frameInterval !== undefined) {
        this.interval = options.frameInterval;
      }

      // create our charts
      this.chart = new Chart(this.canvas.nativeElement, {
        data: {
          datasets: this.plots.data,
        },
        options,
      });
    }
  }
}
