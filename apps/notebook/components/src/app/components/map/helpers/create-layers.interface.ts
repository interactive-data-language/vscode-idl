import { LayersList } from '@deck.gl/core';

/** [xmin, ymin, xmax, ymax] */
export type LayerBounds = [number, number, number, number];

export interface ILayers {
  layers: LayersList;
  bounds: LayerBounds;
}
