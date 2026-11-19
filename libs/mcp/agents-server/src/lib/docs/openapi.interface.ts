/**
 * Loosely typed OpenAPI object; Swagger UI validates the final document
 */
export type OpenAPIObject = { [key: string]: unknown };

/**
 * Paths (and their operations) for a single routes file
 */
export type OpenAPIPaths = { [path: string]: OpenAPIObject };

/**
 * Builds a reference to a shared schema in `components.schemas`
 */
export function SchemaRef(name: string): OpenAPIObject {
  return { $ref: `#/components/schemas/${name}` };
}

/**
 * Builds a JSON response for the given schema
 */
export function JsonResponse(
  description: string,
  schema: OpenAPIObject,
): OpenAPIObject {
  return { description, content: { 'application/json': { schema } } };
}

/**
 * Builds a JSON request body for the given schema
 */
export function JsonBody(
  schema: OpenAPIObject,
  required = true,
): OpenAPIObject {
  return { required, content: { 'application/json': { schema } } };
}

/**
 * Builds an error response using the shared error schema
 */
export function ErrorResponse(description: string): OpenAPIObject {
  return JsonResponse(description, SchemaRef('ErrorResponse'));
}
