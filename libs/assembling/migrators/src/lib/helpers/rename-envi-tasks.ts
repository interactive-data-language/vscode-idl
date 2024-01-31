/**
 * Regex to get ENVI task
 *
 * Groups:
 *
 * 1. Full
 * 2. Front
 * 3. Task name
 * 4. Closer
 */
const ENVI_TASK_REGEX = /(ENVITask\(\s*(?:'|"|`))(.*)((?:'|"|`))/i;

/**
 * Renames all references to a certain ENVI task
 */
export function RenameENVITasks(
  strings: string[],
  nameMap: { [key: string]: string }
) {
  /** Process each line */
  for (let i = 0; i < strings.length; i++) {
    /** Match! */
    const match = ENVI_TASK_REGEX.exec(strings[i]);

    // check if we have text to replace
    if (match !== null) {
      const taskName = match[2].toLowerCase();
      // skip if not the same task
      if (!(taskName in nameMap)) {
        continue;
      }

      // build the new string
      const newString = `${match[1]}${nameMap[taskName]}${match[3]}`;

      // update
      strings[i] = `${strings[i].substring(
        0,
        match.index
      )}${newString}${strings[i].substring(match.index + match[0].length)}`;
    }
  }
}
