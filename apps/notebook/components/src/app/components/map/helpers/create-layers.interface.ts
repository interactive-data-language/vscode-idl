import { LayerProps } from '@deck.gl/core';
import GeoJsonLayer, {
  _GeoJsonLayerProps,
} from '@deck.gl/layers/dist/geojson-layer/geojson-layer';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookMap_GeoJSON,
  IDLNotebookMap_Image,
} from '@idl/types/notebooks';

import { AwesomeImage, AwesomeImageProps } from './awesome-image.class';

/** [xmin, ymin, xmax, ymax] */
export type LayerBounds = [number, number, number, number];

/** Type of layer */
export type NotebookMapLayerType = 'geojson' | 'image';

/** GeoJSON properties, from hover help and type inspection */
export type GeoJSONProps = Partial<
  Required<_GeoJsonLayerProps<any>> & Required<LayerProps>
>;

/** Properties for a notebook layer */
export type NotebookMapLayerProps<T extends NotebookMapLayerType> =
  T extends 'image'
    ? AwesomeImageProps
    : T extends 'geojson'
    ? GeoJSONProps
    : { [key: string]: any };

/** Properties for a notebook layer */
export type NotebookMapDeckLayer<T extends NotebookMapLayerType> =
  T extends 'image' ? AwesomeImage : T extends 'geojson' ? GeoJsonLayer : never;

/** Properties for a notebook layer */
export type NotebookMapEmbedItem<T extends NotebookMapLayerType> =
  T extends 'image'
    ? IDLNotebookEmbeddedItem<IDLNotebookMap_Image>
    : T extends 'geojson'
    ? IDLNotebookEmbeddedItem<IDLNotebookMap_GeoJSON>
    : never;

/**
 * Stored content for the layer
 */
export type NotebookMapLayer<T extends NotebookMapLayerType> = {
  /** type of layer */
  type: T;
  /** Name of the layer */
  name: string;
  /** Deck layer */
  layer: NotebookMapDeckLayer<T>;
  /** Properties for the layer */
  props: NotebookMapLayerProps<T>;
  /** Create item */
  embed: NotebookMapEmbedItem<T>;
};

export type NotebookMapLayers<T extends NotebookMapLayerType> = {
  /** Layers to display */
  layers: NotebookMapLayer<T>[];
  /** overall bounds of layers */
  bounds: LayerBounds;
};
