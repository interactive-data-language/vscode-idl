/**
 * Converts properties to lower case and returns object
 *
 * Does not recurse
 */
export function LCProps(object: { [key: string]: any }) {
  // make all keys lower case
  const mapped = {};

  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    mapped[keys[i].toLowerCase()] = object[keys[i]];
  }

  return mapped;
}
