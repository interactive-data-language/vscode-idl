import { LayersList } from '@deck.gl/core/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookMap,
  IDLNotebookMap_GeoJSON,
  IDLNotebookMap_Image,
} from '@idl/notebooks/types';
import { bboxify } from '@mapbox/geojson-extent';
import { nanoid } from 'nanoid';

import { AwesomeImage } from './awesome-image.class';

/**
 * Creates the deck.gl layers for the map
 */
export function CreateLayers(embed: IDLNotebookEmbeddedItem<IDLNotebookMap>) {
  /**
   * Create layers that we want to embed
   */
  const embedLayers: LayersList = [];

  /**
   * Get all items to embed
   */
  const toEmbed = embed.item.data;

  /**
   * Track bounds
   */
  let bounds: [number, number, number, number] = undefined as any;

  // process all of our data
  for (let i = 0; i < toEmbed.length; i++) {
    const mapEmbed = toEmbed[i];

    // determine how to proceed with le embedding
    switch (true) {
      /**
       * Do we have parsed GeoJSON to embed?
       */
      case mapEmbed.type === 'idlnotebookmap_geojson': {
        const typed =
          mapEmbed as IDLNotebookEmbeddedItem<IDLNotebookMap_GeoJSON>;
        const parsed = JSON.parse(typed.item.geojson);

        // starting color
        let color = [66, 245, 135, 125];
        if (typed.item?.properties?.color) {
          color = typed.item?.properties?.color;
        }

        /**
         * Check if we need to set some bounds
         */
        if (bounds === undefined) {
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
        }

        embedLayers.push(
          new GeoJsonLayer({
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
          })
        );
        break;
      }
      case mapEmbed.type === 'idlnotebookmap_image': {
        /** Typed message */
        const typed = mapEmbed as IDLNotebookEmbeddedItem<IDLNotebookMap_Image>;

        /** Get image extents */
        const extent = typed.item.extents;

        // embedLayers.push(
        //   new BitmapLayer({
        //     id: 'bitmap-layer',
        //     image: `data:image/png;base64,${typed.item.data}`,
        //     bounds: [extent.xmin, extent.ymin, extent.xmax, extent.ymax],
        //     parameters: {},
        //   })
        // );

        /**
         * Check if we need to set some bounds
         */
        if (bounds === undefined) {
          bounds = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
        }

        embedLayers.push(
          new AwesomeImage({
            id: nanoid(),
            image: `data:image/png;base64,${typed.item.data}`,
            bounds: [extent.xmin, extent.ymin, extent.xmax, extent.ymax],
            pickable: false,
          })
        );

        break;
      }
      default:
        break;
    }
  }

  return { layers: embedLayers, bounds };
}
