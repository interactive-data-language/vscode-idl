import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  SkipSelf,
} from '@angular/core';
import { Deck } from '@deck.gl/core/typed';
import { TileLayer } from '@deck.gl/geo-layers/typed';
import { BitmapLayer, ScatterplotLayer } from '@deck.gl/layers/typed';
import { IDLNotebookPlot2D } from '@idl/notebooks/types';
import axios from 'axios';

import { VSCodeRendererMessenger } from '../../services/vscode-renderer-messenger.service';
import { BaseRendererComponent } from '../base-renderer.component';
import { DataSharingService } from '../data-sharing.service';

const INITIAL_VIEW_STATE = {
  latitude: 37.8,
  longitude: -122.45,
  zoom: 15,
};

/**
 * ID for notebook map
 */
export const IDL_NB_MAP_COMPONENT_SELECTOR = 'idl-nb-map';

/**
 * Component that creates a 2D line plot from data
 */
@Component({
  selector: 'idl-nb-map',
  templateUrl: './map.component.html',
  styles: [
    `
      .map-container {
        width: 650px;
        height: 650px;
      }
    `,
  ],
})
export class MapComponent
  extends BaseRendererComponent<IDLNotebookPlot2D>
  implements OnInit, OnDestroy
{
  /**
   * A unique ID for the chart (needed so we can handle multiple charts)
   */
  private mapId = `map-${Math.floor(performance.now())}`;

  private deck!: Deck;

  /**
   * Callback to resize chart on window resize
   *
   * It re-draws when we get smaller, but not when we grow again
   */
  private resizeCb = () => {
    if (this.deck !== undefined) {
      const el = document.getElementById(this.mapId);
      if (el !== null) {
        // el.style.width = `${this.el.nativeElement.offsetWidth * 0.9}px;`;
        // el.style.height = `${this.el.nativeElement.offsetHeight * 0.9}px;`;
      }
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
      `<canvas class="map-container" id="${this.mapId}" style="width: 650px;height: 650px;"></canvas>`
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
    const canvas = document.getElementById(
      this.mapId
    ) as HTMLCanvasElement | null;
    if (this.hasData && canvas !== null) {
      this.deck = new Deck({
        canvas: canvas,
        initialViewState: INITIAL_VIEW_STATE,
        controller: true,
        layers: [
          new TileLayer({
            // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
            data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',

            minZoom: 0,
            maxZoom: 19,
            tileSize: 256,

            loadOptions: {},

            renderSubLayers: (props) => {
              return new BitmapLayer(props, {
                data: undefined,
                image: props.data,
                bounds: [
                  props.tile.boundingBox[0][0],
                  props.tile.boundingBox[0][1],
                  props.tile.boundingBox[1][0],
                  props.tile.boundingBox[1][1],
                ],
              });
            },

            fetch: async (url, ctx) => {
              return (
                await axios.get(url, {
                  withCredentials: false,
                  headers: {},
                })
              ).data;
            },
          }),
          new ScatterplotLayer({
            data: [
              { position: [-122.45, 37.8], color: [255, 0, 0], radius: 100 },
            ],
            getFillColor: (d) => d.color,
            getRadius: (d) => d.radius,
          }),
        ],
      });
    }
  }
}
