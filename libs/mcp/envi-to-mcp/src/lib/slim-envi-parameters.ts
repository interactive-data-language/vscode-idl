/**
 * Keys that are removed from schemas and results when operating in "slim" mode
 */
export const SLIM_KEYS = ['auxiliary_url'];

/**
 * Returns a deep copy of a JSON schema with all slim keys removed from
 * every `properties` object (and from matching `required` arrays).
 *
 * Does not mutate the input so the full schema can stay in the registry.
 */
export function SlimENVISchema<T>(schema: T): T {
  // primitives
  if (schema === null || typeof schema !== 'object') {
    return schema;
  }

  // arrays
  if (Array.isArray(schema)) {
    return schema.map((item) => SlimENVISchema(item)) as T;
  }

  const copy: { [key: string]: any } = {};
  const keys = Object.keys(schema);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val = (schema as any)[key];

    switch (true) {
      // drop slim keys from property maps
      case key === 'properties' && val !== null && typeof val === 'object': {
        const props: { [key: string]: any } = {};
        const names = Object.keys(val);
        for (let j = 0; j < names.length; j++) {
          if (!SLIM_KEYS.includes(names[j])) {
            props[names[j]] = SlimENVISchema(val[names[j]]);
          }
        }
        copy[key] = props;
        break;
      }
      // keep `required` consistent with properties
      case key === 'required' && Array.isArray(val):
        copy[key] = val.filter((name) => !SLIM_KEYS.includes(name));
        break;
      default:
        copy[key] = SlimENVISchema(val);
        break;
    }
  }

  return copy as T;
}

/**
 * Removes all slim keys, in place, from results coming back from IDL
 *
 * Mirrors `FixENVIFactory`
 */
export function SlimENVIResult(obj: any): void {
  if (obj === null || typeof obj !== 'object') {
    return;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      SlimENVIResult(obj[i]);
    }
    return;
  }

  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    if (SLIM_KEYS.includes(keys[i])) {
      delete obj[keys[i]];
    } else {
      SlimENVIResult(obj[keys[i]]);
    }
  }
}
