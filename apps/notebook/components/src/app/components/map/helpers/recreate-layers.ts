import { Layer } from '@deck.gl/core';
import { GeoJsonLayer } from '@deck.gl/layers';

import { CreateImage } from './create-image';
import {
  NotebookMapLayer,
  NotebookMapLayerType,
} from './create-layers.interface';

/**
 * Regenerates layers
 */
export function RecreateLayers(
  layers: NotebookMapLayer<NotebookMapLayerType>[]
): Layer[] {
  /** Layers for deck.gl */
  const deckLayers: Layer[] = [];

  // process all layers
  for (let i = 0; i < layers.length; i++) {
    switch (layers[i].type) {
      case 'geojson': {
        const typed = layers[i] as any as NotebookMapLayer<'geojson'>;
        deckLayers.push(
          new GeoJsonLayer({
            id: typed.layer.id,
            stroked: typed.layer.props.stroked,
            filled: typed.layer.props.filled,
            getFillColor: typed.layer.props.getFillColor,
            data: typed.layer.props.data,
            pickable: typed.layer.props.pickable,
            ...typed.props,
          })
        );
        break;
      }
      case 'image': {
        const typed = layers[i] as any as NotebookMapLayer<'image'>;
        deckLayers.push(CreateImage(typed.embed, typed.props));
        break;
      }
      default:
        break;
    }
  }

  return deckLayers;
}
