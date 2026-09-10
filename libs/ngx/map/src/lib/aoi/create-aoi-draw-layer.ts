import {
  DrawPolygonMode,
  EditableGeoJsonLayer,
} from '@deck.gl-community/editable-layers';
import type { Feature, FeatureCollection, Polygon } from 'geojson';

/**
 * Feature collection used when no AOI has been drawn yet
 */
export const EMPTY_AOI_FEATURE_COLLECTION: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [],
};

/**
 * Creates the editable layer used to draw a single AOI polygon on the map.
 *
 * Only the most recently drawn polygon is kept - drawing a new one replaces
 * any previous AOI.
 */
export function CreateAoiDrawLayer(
  featureCollection: FeatureCollection<Polygon>,
  onEdit: (aoi: Feature<Polygon> | undefined) => void,
): EditableGeoJsonLayer {
  return new EditableGeoJsonLayer({
    id: 'aoi-draw-layer',
    data: featureCollection,
    mode: DrawPolygonMode,
    selectedFeatureIndexes: [],
    pickable: true,
    onEdit: (editAction) => {
      const features = editAction.updatedData.features;

      // only keep the most recently drawn/edited polygon as the AOI
      const latest =
        features.length > 0
          ? (features[features.length - 1] as Feature<Polygon>)
          : undefined;

      onEdit(latest);
    },
  });
}
