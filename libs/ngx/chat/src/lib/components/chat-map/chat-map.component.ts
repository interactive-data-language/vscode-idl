import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Deck, FlyToInterpolator } from '@deck.gl/core';
import {
  CreateBaseMapLayer,
  CreateLayers,
  FitViewToLayers,
  NotebookMapLayer,
  NotebookMapLayers,
  NotebookMapLayerType,
  RecreateLayers,
} from '@idl/ngx/map';
import { ThemeService } from '@idl/ngx/theme';
import { ChatMessageContent_Map } from '@idl/types/chat';
import { copy } from 'fast-copy';

/**
 * Initial view state — default to CONUS center until data is loaded
 */
const INITIAL_VIEW_STATE = {
  latitude: 39.997,
  longitude: -105.21,
  zoom: 4,
};

/**
 * Standalone map component for rendering IDLNotebookMap data inside a chat message.
 *
 * Mirrors the notebook MapComponent but:
 * - Accepts a `mapData` signal input instead of extending BaseRendererComponent
 * - Uses ThemeService for dark/light basemap selection
 * - Fixed 400px height, no drag-and-drop layer panel (MVP)
 */
@Component({
  selector: 'ngx-chat-map',
  templateUrl: './chat-map.component.html',
  styleUrl: './chat-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: { style: 'display:block;height:400px;position:relative;width:100%' },
})
export class ChatMapComponent implements AfterViewInit, OnDestroy {
  /** Canvas element deck.gl renders into */
  @ViewChild('MapCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  /** Structured map data from the chat message content */
  readonly mapData = input.required<ChatMessageContent_Map['mapData']>();

  /** Deck.gl instance */
  private deck!: Deck;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Periodic redraw interval (mirrors notebook component behaviour) */
  private interval: ReturnType<typeof setInterval> = setInterval(() => {
    if (this.deck !== undefined) {
      this.deck.redraw('chat-map-interval');
    }
  }, 100);

  /** Current deck.gl layers */
  private layers!: NotebookMapLayers<NotebookMapLayerType>;

  private readonly themeService = inject(ThemeService);

  constructor() {
    // React to theme changes — recreate basemap once deck is initialised
    effect(() => {
      // Read signal so this effect re-runs when theme changes
      const isDark = this.themeService.isDarkMode();
      if (this.deck !== undefined) {
        this.deck.setProps({
          layers: [
            CreateBaseMapLayer(isDark),
            ...RecreateLayers(this.layers?.layers ?? []).reverse(),
          ],
        });
      }
    });
  }

  ngAfterViewInit(): void {
    const embed: Parameters<typeof CreateLayers>[0] =
      this.mapData() as Parameters<typeof CreateLayers>[0];

    this.layers = CreateLayers(embed);

    // Choose initial view position from layer bounds
    const fit = FitViewToLayers(
      this.layers,
      this.el.nativeElement.offsetWidth || 600,
      400,
    );
    const viewState = fit
      ? { ...INITIAL_VIEW_STATE, ...fit }
      : { ...INITIAL_VIEW_STATE };

    this.deck = new Deck({
      canvas: this.canvas.nativeElement,
      initialViewState: viewState,
      controller: true,
      width: this.el.nativeElement.offsetWidth,
      height: 400,
      getCursor: () => 'unset',
      layers: [
        CreateBaseMapLayer(this.themeService.isDarkMode()),
        ...this.layers.layers.map((l) => l.layer),
      ],
    });

    this.deck.redraw();

    // Reverse so the UI layer order matches visual order (not needed without panel, but consistent)
    this.layers.layers.reverse();

    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    clearInterval(this.interval);
    if (this.deck !== undefined) {
      this.deck.finalize();
    }
  }

  /**
   * Fly back to the data extents
   */
  resetView(): void {
    if (!this.deck) return;

    this.deck.setProps({ initialViewState: undefined as any });

    const fit = FitViewToLayers(
      this.layers,
      this.el.nativeElement.offsetWidth || 600,
      400,
    );
    const target = fit
      ? { ...INITIAL_VIEW_STATE, ...fit }
      : { ...INITIAL_VIEW_STATE };

    this.deck.setProps({
      initialViewState: {
        ...copy(target),
        transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
        transitionDuration: 'auto',
      },
    });
  }

  private readonly onResize = (): void => {
    if (this.deck !== undefined) {
      this.deck.setProps({ width: this.el.nativeElement.offsetWidth });
      this.deck.redraw();
    }
  };

  /**
   * Re-render when layer properties change
   */
  private propertyChange(
    layers?: NotebookMapLayer<NotebookMapLayerType>[],
  ): void {
    this.deck.setProps({
      layers: [
        CreateBaseMapLayer(this.themeService.isDarkMode()),
        ...RecreateLayers(
          Array.isArray(layers) ? layers : this.layers.layers,
        ).reverse(),
      ],
    });
  }
}
