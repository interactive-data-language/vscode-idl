import { IDLNotebookEmbeddedItem } from './idl-notebook.embed.interface';
import {
  IDLNotebookImage_FromURIData,
  IDLNotebookImage_PNGData,
} from './idl-notebook-image.embed.interface';

/**
 * Parsed GeoJSON that we want to add to a map
 */
export interface IDLNotebookMap_Extents {
  /** EPSG code  */
  epsg: number;
  /** X min extent */
  xmin: number;
  /** Y min extent */
  ymin: number;
  /** X max extent */
  xmax: number;
  /** Y max extent */
  ymax: number;
}

/**
 * Properties for notebooks
 */
export interface IDLNotebookMap_VectorProperties {
  /** RGBA color array as a string: `"[red, green, blue, alpha]"` as `"[0,0,0,255]"` */
  color?: [number, number, number, number];
}

/** Data structure for vector data in our display */
export interface IDLNotebookMap_Vector {
  /** Properties for vector display */
  properties?: IDLNotebookMap_VectorProperties;
}

/**
 * Parsed GeoJSON that we want to add to a map
 */
export type IDLNotebookMap_GeoJSON = 'idlnotebookmap_geojson';

/**
 * Parsed GeoJSON that we want to add to a map
 */
export interface IDLNotebookMap_GeoJSONData extends IDLNotebookMap_Vector {
  /** Parsed GeoJSON as an object */
  geojson: string;
}

/**
 * When we have a map vector from a GeoJSON URI
 */
export type IDLNotebookMap_GeoJSONFromUri = 'idlnotebookmap_geojsonfromuri';

/**
 * GeoJSON data from a file that we want to add to a map
 */
export interface IDLNotebookMap_GeoJSONFromUriData
  extends IDLNotebookMap_Vector {
  /** Fully-qualified URI to GeoJSON file */
  uri: string;
}

/**
 * Parsed GeoJSON that we want to add to a map
 */
export type IDLNotebookMap_Image = 'idlnotebookmap_image';

/**
 * Parsed GeoJSON that we want to add to a map
 */
export interface IDLNotebookMap_ImageData extends IDLNotebookImage_PNGData {
  /** Extents of image on map */
  extents: IDLNotebookMap_Extents;
}

/**
 * Parsed GeoJSON that we want to add to a map
 */
export type IDLNotebookMap_ImageFromUri = 'idlnotebookmap_imagefromuri';

/**
 * Parsed GeoJSON that we want to add to a map
 */
export interface IDLNotebookMap_ImageFromUriData
  extends IDLNotebookImage_FromURIData {
  /** Extents of image on map */
  extents: IDLNotebookMap_Extents;
}

/**
 * Union type of all items we can embed on a map
 *
 * While we can specify shapefiles from IDL, they get mapped to
 * GeoJSON before getting here so we don't need types for it
 */
export type IDLNotebookMap_EmbeddedItemType =
  | IDLNotebookMap_GeoJSON
  | IDLNotebookMap_GeoJSONFromUri
  | IDLNotebookMap_Image
  | IDLNotebookMap_ImageFromUri;

/**
 * Notebook map
 */
export type IDLNotebookMap = 'idlnotebookmap';

/**
 * Data we are adding to a map in a notebook
 */
export interface IDLNotebookMapData<T extends IDLNotebookMap_EmbeddedItemType> {
  /** Data that we are embedding */
  data: IDLNotebookEmbeddedItem<T>[];
}

/**
 * All types that can be from embedded notebooks
 */
export type IDLNotebookMap_EmbedType =
  | IDLNotebookMap
  | IDLNotebookMap_EmbeddedItemType;

/**
 * Data embedded in a notebook cell
 */
export type IDLNotebookMap_EmbedTypeData<T extends IDLNotebookMap_EmbedType> =
  T extends IDLNotebookMap
    ? IDLNotebookMapData<IDLNotebookMap_EmbeddedItemType>
    : T extends IDLNotebookMap_GeoJSONFromUri
    ? IDLNotebookMap_GeoJSONFromUriData
    : T extends IDLNotebookMap_GeoJSON
    ? IDLNotebookMap_GeoJSONData
    : T extends IDLNotebookMap_Image
    ? IDLNotebookMap_ImageData
    : T extends IDLNotebookMap_ImageFromUri
    ? IDLNotebookMap_ImageFromUriData
    : never;
