import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { Deck, FlyToInterpolator, WebMercatorViewport } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { IDLNotebookMap } from '@idl/types/notebooks';
import copy from 'fast-copy';
import { firstValueFrom } from 'rxjs';

import { VSCodeRendererMessenger } from '../../services/vscode-renderer-messenger.service';
import { BaseRendererComponent } from '../base-renderer.component';
import { DataSharingService } from '../data-sharing.service';
import { CreateLayers } from './helpers/create-layers';
import {
  NotebookMapLayers,
  NotebookMapLayerType,
} from './helpers/create-layers.interface';
import { RecreateLayers } from './helpers/recreate-layers';

/**
 * Initial view state
 */
const INITIAL_VIEW_STATE = {
  latitude: 39.99758595367171,
  longitude: -105.2101538546129,
  zoom: 14,
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
      @import 'styles.scss';

      .map-container {
        width: 100%;
      }

      .map-credits {
        position: absolute;
        right: 0;
        bottom: 0;
        color: black !important;
        background: rgba(150, 150, 150, 125);
      }
    `,
  ],
})
export class MapComponent
  extends BaseRendererComponent<IDLNotebookMap>
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

  /** Current layers */
  layers!: NotebookMapLayers<NotebookMapLayerType>;

  /** Do we show the layers dialog */
  showLayers = false;

  /**
   * Interval callback to make sure we render
   *
   * If we don't do this, they there's some weird state (guessing it has
   * to do with the iframe this is in for notebooks)
   */
  private interval: any = setInterval(() => {
    if (this.deck !== undefined) {
      this.deck.redraw('YOLO');
    }
  }, 100);

  /**
   * Callback to resize chart on window resize
   *
   * It re-draws when we get smaller, but not when we grow again
   */
  private resizeCb = () => {
    if (this.deck !== undefined) {
      this.deck.setProps({
        width: this.el.nativeElement.offsetWidth,
        height: this.el.nativeElement.offsetHeight,
      });
      this.deck.redraw();
    }
  };

  /** Layer for the base map */
  baseMapLayer = this.createBaseMapLayer();

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
    this._subscriptions.add(
      this.messenger.themeChange$.subscribe((isDark) => {
        this.baseMapLayer = this.createBaseMapLayer();
        this.propertyChange();
      })
    );
  }

  /**
   * Creates our basemap layer
   */
  createBaseMapLayer() {
    return new TileLayer({
      data: this.messenger.darkTheme
        ? `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}.png`
        : `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png`,

      minZoom: 0,
      maxZoom: 16,
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

      fetch: async (url) => {
        // get value as bloc
        const val = await firstValueFrom(
          this.http.get(url, {
            withCredentials: false,
            responseType: 'blob',
          })
        );

        // convert to data URI and display
        return URL.createObjectURL(val);
      },

      onTileUnload: (tile) => {
        URL.revokeObjectURL(tile.data);
      },
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('resize', this.resizeCb);
    window.clearInterval(this.interval);
  }

  ngAfterViewInit() {
    if (this.hasData) {
      /**
       * Crete layers from our input
       */
      const layers = CreateLayers(this._embed);

      // save layers
      this.layers = layers;

      // update default view state
      this.updateInitialViewState();

      /**
       * Create instance of deck with basemap and layers
       */
      this.deck = new Deck({
        canvas: this.canvas.nativeElement,
        initialViewState: INITIAL_VIEW_STATE,
        controller: true,
        width: this.el.nativeElement.offsetWidth,
        height: this.el.nativeElement.offsetHeight,
        getCursor: () => 'unset',
        // getTooltip: (info) => {
        //   if (info.object) {
        //     return {
        //       html: `<${IDL_NB_MAP_PROPERTY_SHEET_SELECTOR} properties='${JSON.stringify(
        //         info.object?.properties || {}
        //       )}'></${IDL_NB_MAP_PROPERTY_SHEET_SELECTOR}>`,
        //     };
        //   } else {
        //     return null;
        //   }
        // },
        layers: [
          this.baseMapLayer,
          ...layers.layers.map((nbLayer) => nbLayer.layer),
        ],
      });

      // manually trigger a re-draw which seems to help when display stays black
      this.deck.redraw();
    }
  }

  /**
   * Updates our view state based on data extents and the current map size
   */
  updateInitialViewState() {
    if (this.layers) {
      // check if we have bounds from our layers
      if (this.layers.bounds) {
        /**
         * Get viewport
         */
        const { longitude, latitude, zoom } = new WebMercatorViewport({
          width: this.el.nativeElement.offsetWidth,
          height: this.el.nativeElement.offsetHeight,
        }).fitBounds(
          [
            [this.layers.bounds[0], this.layers.bounds[1]],
            [this.layers.bounds[2], this.layers.bounds[3]],
          ],
          {
            padding: 100,
          }
        );

        /**
         * Update view state
         */
        Object.assign(INITIAL_VIEW_STATE, { longitude, latitude, zoom });
      }
    }
  }

  /**
   * Set the view back to defaults
   */
  resetView() {
    /**
     * Reset initial view state so deck.gl picks up changes
     *
     * Without this, the next code doesnt work
     */
    this.deck.setProps({ initialViewState: undefined });

    // update our view state in case the map size has changed
    this.updateInitialViewState();

    /**
     * Set view state with an animation
     */
    this.deck.setProps({
      initialViewState: {
        ...copy(INITIAL_VIEW_STATE),
        transitionInterpolator: new FlyToInterpolator({
          speed: 2,
        }),
        transitionDuration: 'auto',
      },
    });
  }

  /**
   * Re-render layers because properties have changed
   */
  propertyChange() {
    this.deck.setProps({
      layers: [this.baseMapLayer, ...RecreateLayers(this.layers)],
    });
  }
}
