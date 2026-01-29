/**
 * Routine that returns a copy of an object with all "description" properties
 * converted to string arrays for readability
 */
export function SplitDescription(obj: { [key: string]: any }): any {
  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitives
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => SplitDescription(item));
  }

  // Handle objects
  const result: { [key: string]: any } = {};
  for (const key in obj) {
    if (key === 'description' && typeof obj[key] === 'string') {
      // Split description on newlines
      result[key] = obj[key].split('\n');
    } else {
      // Recursively process other properties
      result[key] = SplitDescription(obj[key]);
    }
  }
  return result;
}
