import { z } from 'zod';

// A position is [longitude, latitude] — numbers
const Position = z.tuple([z.number(), z.number()]);

const Point = z.object({
  type: z.literal('Point'),
  coordinates: Position,
});

const MultiPoint = z.object({
  type: z.literal('MultiPoint'),
  coordinates: z.array(Position),
});

const LineString = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(Position),
});

const MultiLineString = z.object({
  type: z.literal('MultiLineString'),
  coordinates: z.array(z.array(Position)),
});

const Polygon = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(Position)),
});

const MultiPolygon = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(Position))),
});

// Geometry = union of all types
const Geometry = z.union([
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
]);

// Feature = Geometry + properties
const Feature = z.object({
  type: z.literal('Feature'),
  geometry: Geometry,
  properties: z.record(z.any()),
  id: z.union([z.string(), z.number()]).optional(),
});

/**
 * Returns an ENVI GeoJSON parameter
 */
export function MCPENVIGeoJSON(description: string) {
  return z
    .object({
      type: z.literal('FeatureCollection'),
      features: z.array(Feature),
    })
    .describe(
      `${description}\n\nThis is just GeoJSON with a single feature collection`
    );
}
