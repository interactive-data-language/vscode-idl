import { WebMercatorViewport } from '@deck.gl/core';

import {
  NotebookMapLayers,
  NotebookMapLayerType,
} from '../create-layers.interface';

/**
 * Computes a longitude/latitude/zoom that fits all layer bounds within the
 * given viewport dimensions.  Returns `null` when no bounds are available.
 */
export function FitViewToLayers(
  layers: NotebookMapLayers<NotebookMapLayerType>,
  width: number,
  height: number,
): { latitude: number; longitude: number; zoom: number } | null {
  if (!layers?.bounds) {
    return null;
  }

  const { longitude, latitude, zoom } = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(
    [
      [layers.bounds[0], layers.bounds[1]],
      [layers.bounds[2], layers.bounds[3]],
    ],
    { padding: 100 },
  );

  return { longitude, latitude, zoom };
}
