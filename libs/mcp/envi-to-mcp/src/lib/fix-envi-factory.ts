/**
 * Maps the factory key returned by ENVI to actually match our
 * JSON schemas
 */
export const FACTORY_LOOKUP: { [key: string]: string } = {};

/**
 * Fixes the ENVI factory key so that all JSON parameters from ENVI
 * and tasks are normalized to be the same
 *
 * All should be PascalCase and human readable, but ENVI does
 * not follow a set standard.
 */
export function FixENVIFactory(obj: any): any {
  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return;
  }

  // Handle primitives
  if (typeof obj !== 'object') {
    return;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    for (let j = 0; j < obj.length; j++) {
      FixENVIFactory(obj[j]);
    }
    return;
  }

  /**
   * Get keys assuming we are an object
   */
  const keys = Object.keys(obj);

  // process each key
  for (let i = 0; i < keys.length; i++) {
    /** Extract the value */
    const val = obj[keys[i]];

    // determine how to proceed/recurse
    switch (true) {
      // recurse if array
      case Array.isArray(val):
        for (let j = 0; j < val.length; j++) {
          FixENVIFactory(val[j]);
        }
        break;
      // recurse if object
      case typeof val === 'object':
        FixENVIFactory(val);
        break;
      // map if a string
      case keys[i].toLowerCase() === 'factory' && typeof val === 'string': {
        const lc = val.toLowerCase();
        if (lc in FACTORY_LOOKUP) obj[keys[i]] = FACTORY_LOOKUP[lc];
        break;
      }
      default:
        break;
    }
  }
}
