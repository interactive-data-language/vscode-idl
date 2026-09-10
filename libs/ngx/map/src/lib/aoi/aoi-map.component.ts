import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Deck } from '@deck.gl/core';
import type { Feature, FeatureCollection, Polygon } from 'geojson';

import { CreateBaseMapLayer } from '../layers/create-basemap-layer';
import {
  CreateAoiDrawLayer,
  EMPTY_AOI_FEATURE_COLLECTION,
} from './create-aoi-draw-layer';

/**
 * Default view state, centered on the continental US at a low zoom level
 */
const INITIAL_VIEW_STATE = {
  latitude: 39.5,
  longitude: -98.35,
  zoom: 3,
};

/**
 * Map component that lets a user draw a single AOI (area of interest)
 * polygon and emits the drawn geometry as GeoJSON
 */
@Component({
  selector: 'ngx-map-aoi',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './aoi-map.component.html',
  styleUrl: './aoi-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AoiMapComponent implements AfterViewInit, OnDestroy {
  /**
   * Emits the drawn AOI polygon (or `undefined` once cleared) whenever the
   * user finishes or edits their drawing
   */
  aoiChange = output<Feature<Polygon> | undefined>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('AoiMapCanvas');

  /** Whether to use the dark theme basemap */
  darkTheme = input(true);

  private currentFeatureCollection: FeatureCollection<Polygon> =
    EMPTY_AOI_FEATURE_COLLECTION;

  private deck?: Deck;

  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    window.addEventListener('resize', this.resizeCb);
  }

  /**
   * Clears the currently drawn AOI polygon
   */
  clear(): void {
    this.currentFeatureCollection = EMPTY_AOI_FEATURE_COLLECTION;
    this.updateLayers();
    this.aoiChange.emit(undefined);
  }

  ngAfterViewInit(): void {
    this.deck = new Deck({
      canvas: this.canvas().nativeElement,
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      width: this.el.nativeElement.offsetWidth,
      height: this.el.nativeElement.offsetHeight,
      layers: this.createLayers(),
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeCb);
    this.deck?.finalize();
  }

  private createLayers() {
    return [
      CreateBaseMapLayer(this.darkTheme()),
      CreateAoiDrawLayer(this.currentFeatureCollection, (aoi) => {
        this.currentFeatureCollection = aoi
          ? { type: 'FeatureCollection', features: [aoi] }
          : EMPTY_AOI_FEATURE_COLLECTION;
        this.updateLayers();
        this.aoiChange.emit(aoi);
      }),
    ];
  }

  private readonly resizeCb = () => {
    this.deck?.setProps({
      width: this.el.nativeElement.offsetWidth,
      height: this.el.nativeElement.offsetHeight,
    });
  };

  private updateLayers(): void {
    this.deck?.setProps({ layers: this.createLayers() });
  }
}
