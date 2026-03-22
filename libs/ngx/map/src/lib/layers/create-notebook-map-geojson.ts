import { GeoJsonLayer } from '@deck.gl/layers';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookMap_GeoJSON,
} from '@idl/types/notebooks';
import { bboxify } from '@mapbox/geojson-extent';
import { nanoid } from 'nanoid';

import { LayerBounds } from '../create-layers.interface';
import { CreatedLayerNotebookMapLayer } from './created-layer.interface';

/**
 * Creates a notebook map image
 */
export function CreateNotebookMapGeoJSON(params: {
  name: string;
  vector: IDLNotebookEmbeddedItem<IDLNotebookMap_GeoJSON>;
}): CreatedLayerNotebookMapLayer<'geojson'> {
  const parsed = JSON.parse(params.vector.item.geojson);

  // starting color
  let color = [66, 245, 135, 125];
  if (params.vector.item?.properties?.color) {
    color = params.vector.item?.properties?.color;
  }

  // initialize bounds
  let bounds: LayerBounds = undefined as any;

  // attempt to get bounds of the geojson
  const geoBounds = bboxify(parsed);
  if (geoBounds.bbox) {
    const bbox = geoBounds.bbox;

    /**
     * Check if 2d or 3d
     */
    if (bbox.length === 4) {
      bounds = bbox;
    } else {
      bounds = [bbox[0], bbox[1], bbox[3], bbox[4]];
    }
  }

  return {
    bounds: bounds,
    notebookLayer: {
      type: 'geojson',
      name: params.name,
      embed: params.vector,
      layer: new GeoJsonLayer({
        id: nanoid(),
        stroked: true,
        filled: true,
        getFillColor: (geo) => {
          if (geo.properties && 'color' in geo.properties) {
            const rgb = geo.properties['color'];
            return [rgb[0], rgb[1], rgb[2], 175];
          } else {
            return color as any;
          }
        },
        data: parsed,
        pickable: true,
      }),
      props: {
        opacity: 1,
      },
    },
  };
}
