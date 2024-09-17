import { GeoJsonLayer } from '@deck.gl/layers';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookMap,
  IDLNotebookMap_GeoJSON,
  IDLNotebookMap_Image,
} from '@idl/types/notebooks';
import { bboxify } from '@mapbox/geojson-extent';
import { nanoid } from 'nanoid';

import { CreateImage } from './create-image';
import {
  LayerBounds,
  NotebookMapLayer,
  NotebookMapLayers,
  NotebookMapLayerType,
} from './create-layers.interface';

/**
 * Creates the deck.gl layers for the map
 */
export function CreateLayers(
  embed: IDLNotebookEmbeddedItem<IDLNotebookMap>
): NotebookMapLayers<NotebookMapLayerType> {
  /**
   * Create layers that we want to embed
   */
  const embedLayers: NotebookMapLayer<NotebookMapLayerType>[] = [];

  /** Count rasters for default names */
  let nRasters = 0;

  /** Count vectors for default names */
  let nVectors = 0;

  /**
   * Get all items to embed
   */
  const toEmbed = embed.item.data;

  /**
   * Track bounds
   */
  let bounds: LayerBounds = undefined as any;

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

        const newLayer: NotebookMapLayer<'geojson'> = {
          type: 'geojson',
          name: `Vector ${nVectors + 1}`,
          embed: typed,
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
        };

        nVectors++;

        // save layer
        embedLayers.push(newLayer);
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

        const newLayer: NotebookMapLayer<'image'> = {
          type: 'image',
          name: `Raster ${nRasters + 1}`,
          embed: typed,
          layer: CreateImage(typed),
          props: {
            opacity: 1,
          },
        };

        // save layer
        embedLayers.push(newLayer);

        // update raster counter
        nRasters++;
        break;
      }
      default:
        break;
    }
  }

  return { layers: embedLayers, bounds };
}
