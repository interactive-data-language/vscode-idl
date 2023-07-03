/**
 * Orders keys in an object
 */
export function OrderObject<T extends object>(obj: T, ref: any): T {
  /**
   * Init new object
   */
  const newObj = {} as T;

  // get keys of reference object
  const keys = Object.keys(ref);

  // order
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] in obj) {
      newObj[keys[i]] = obj[keys[i]];
    }
  }

  return newObj;
}
