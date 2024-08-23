import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { DRAG_INDICATOR } from './svgs/drag-indicator';
import { FAST_FORWARD } from './svgs/fast-forward';
import { FAST_REWIND } from './svgs/fast-rewind';
import { LAYERS } from './svgs/layers';
import { MY_LOCATION_FILLED } from './svgs/my-location-fill';
import { PAUSE } from './svgs/pause';
import { PLAY } from './svgs/play';
import { SAVE } from './svgs/save';

/**
 * Adds custom icons for use in material
 *
 * This has been updated to directly include the SVG content
 * instead of needing to load the SVGs via HTTP
 */
export function RegisterIcons(
  registry: MatIconRegistry,
  sanitizer: DomSanitizer
) {
  // icons we load
  const icons: { [key: string]: any } = {
    drag_indicator: DRAG_INDICATOR,
    'fast-forward': FAST_FORWARD,
    'fast-rewind': FAST_REWIND,
    layers: LAYERS,
    my_location_fill: MY_LOCATION_FILLED,
    pause: PAUSE,
    play: PLAY,
    save: SAVE,
  };

  // process all of our icons
  const keys = Object.keys(icons);
  for (let i = 0; i < keys.length; i++) {
    registry.addSvgIconLiteral(
      keys[i],
      sanitizer.bypassSecurityTrustHtml(icons[keys[i]])
    );
  }
}
