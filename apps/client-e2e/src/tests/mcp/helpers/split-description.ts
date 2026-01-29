/**
 * Routine that returns a copy of an object with all "description" properties
 * converted to string arrays for readability
 */
export function SplitDescription(obj: { [key: string]: any }): any {
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
      SplitDescription(obj[j]);
    }
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
          SplitDescription(val[j]);
        }
        break;
      // recurse if object
      case typeof val === 'object':
        SplitDescription(val);
        break;
      // split if a string
      case keys[i].toLowerCase() === 'description' && typeof val === 'string':
        obj[keys[i]] = val.split(/\n/g);
        break;
      default:
        break;
    }
  }
}
