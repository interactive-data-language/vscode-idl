import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { Deck } from '@deck.gl/core/typed';
import { TileLayer } from '@deck.gl/geo-layers/typed';
import { BitmapLayer, ScatterplotLayer } from '@deck.gl/layers/typed';
import { IDLNotebookPlot2D } from '@idl/notebooks/types';

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
        height: 500px !important;
      }
    `,
  ],
})
export class MapComponent
  extends BaseRendererComponent<IDLNotebookPlot2D>
  implements AfterViewInit, OnDestroy
{
  /**
   * Canvas we draw to
   */
  @ViewChild('MapCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  /**
   * Reference to our map
   */
  private deck!: Deck;

  /**
   * Callback to resize chart on window resize
   *
   * It re-draws when we get smaller, but not when we grow again
   */
  private resizeCb = () => {
    if (this.deck !== undefined) {
      this.deck.setProps({
        width: this.el.nativeElement.offsetWidth - 1,
        height: this.el.nativeElement.offsetHeight - 1,
      });
      this.deck.redraw();
    }
  };

  /**
   * We can access the latest data directly through our dataService which tracks
   * the last value on $embed
   */
  constructor(
    @SkipSelf() dataService: DataSharingService,
    messenger: VSCodeRendererMessenger,
    private el: ElementRef<HTMLElement>,
    private http: HttpClient
  ) {
    super(dataService, messenger);
    window.addEventListener('resize', this.resizeCb);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeCb);
  }

  ngAfterViewInit() {
    if (this.hasData) {
      this.deck = new Deck({
        canvas: this.canvas.nativeElement,
        initialViewState: INITIAL_VIEW_STATE,
        controller: true,
        width: this.el.nativeElement.offsetWidth - 1,
        height: this.el.nativeElement.offsetHeight - 1,
        layers: [
          new TileLayer({
            // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
            data: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

            minZoom: 0,
            maxZoom: 19,
            tileSize: 256,

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
              // get value as bloc
              const val = await this.http
                .get(url, {
                  withCredentials: false,
                  responseType: 'blob',
                })
                .toPromise();

              // convert to data URI and display
              return URL.createObjectURL(val);
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
