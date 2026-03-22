import {
  IDLNotebookEmbeddedItem,
  IDLNotebookMap,
  IDLNotebookMap_GeoJSON,
  IDLNotebookMap_Image,
} from '@idl/types/notebooks';

import {
  LayerBounds,
  NotebookMapLayer,
  NotebookMapLayers,
  NotebookMapLayerType,
} from './create-layers.interface';
import { CreateNotebookMapGeoJSON } from './layers/create-notebook-map-geojson';
import { CreateNotebookMapImage } from './layers/create-notebook-map-image';

/**
 * Creates the deck.gl layers for the map
 */
export function CreateLayers(
  embed: IDLNotebookEmbeddedItem<IDLNotebookMap>,
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

        // create layer
        const layer = CreateNotebookMapGeoJSON({
          name: `Vector ${nVectors + 1}`,
          vector: typed,
        });

        // set bounds if needed
        if (layer.bounds && bounds === undefined) {
          bounds = layer.bounds;
        }

        // add to display layers
        embedLayers.push(layer.notebookLayer);

        // update vector counter
        nVectors++;

        break;
      }
      case mapEmbed.type === 'idlnotebookmap_image': {
        /** Typed message */
        const typed = mapEmbed as IDLNotebookEmbeddedItem<IDLNotebookMap_Image>;

        // create layer
        const layer = CreateNotebookMapImage({
          name: `Raster ${nRasters + 1}`,
          image: typed,
        });

        // update bounds
        if (layer.bounds && bounds === undefined) {
          bounds = layer.bounds;
        }

        // add to display layers
        embedLayers.push(layer.notebookLayer);

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
