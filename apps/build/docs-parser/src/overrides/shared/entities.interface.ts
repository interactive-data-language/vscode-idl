import { IDLTypeHelper } from '@idl/parsing/type-parser';

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
export const RECORD_TYPE = IDLTypeHelper.parseIDLType(ENTITIES.join(' | '));
