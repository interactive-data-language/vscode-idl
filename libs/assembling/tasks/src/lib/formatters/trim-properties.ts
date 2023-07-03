/**
 * For string values, trims excess properties and recurses through the object
 */
export function TrimProperties<T extends object>(obj: T) {
  // get keys
  const keys = Object.keys(obj);

  // process each vale
  for (let j = 0; j < keys.length; j++) {
    switch (true) {
      // trim string
      case typeof obj[keys[j]] === 'string':
        obj[keys[j]] = (obj[keys[j]] as string).trim();
        break;
      // if object, recurse
      case typeof obj[keys[j]] === 'object':
        TrimProperties(obj[keys[j]]);
        break;
      default:
        break;
    }
  }
}
