const dirRegex = /[a-z]:\\/gim;

/**
 * Correct's VSCode paths to be correct. Makes them go from
 * 'c:\this' to 'C:\this'
 */
export function CleanPath(uri: string) {
  let toClean = uri;

  // recurse through the string
  let m: RegExpExecArray;
  while ((m = dirRegex.exec(uri)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === dirRegex.lastIndex) {
      dirRegex.lastIndex++;
    }

    // make the path upper case
    toClean = toClean.replace(m[0], m[0].toUpperCase());
  }

  // return the corrected string
  return toClean;
}
