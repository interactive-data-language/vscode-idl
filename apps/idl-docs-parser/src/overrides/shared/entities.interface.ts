import { ParseIDLType } from '@idl/types/idl-data-types';

const ENTITIES: string[] = [
  'MultiPoint',
  'MultiPointM',
  'MultiPointZ',
  'Point',
  'PointM',
  'PointZ',
  'Polygon',
  'PolygonM',
  'PolygonZ',
  'Polyline',
  'PolylineM',
  'PolylineZ',
];

/**
 * Data type for vector records
 */
export const RECORD_TYPE = ParseIDLType(ENTITIES.join(' | '));
