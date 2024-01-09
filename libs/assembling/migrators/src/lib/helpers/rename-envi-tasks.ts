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
  oldName: string,
  newName: string
) {
  /** Process each line */
  for (let i = 0; i < strings.length; i++) {
    /** Match! */
    const match = ENVI_TASK_REGEX.exec(strings[i]);

    // check if we have text to replace
    if (match !== null) {
      // skip if not the same task
      if (match[2].toLowerCase() !== oldName.toLowerCase()) {
        continue;
      }

      // build the new string
      const newString = `${match[1]}${newName}${match[3]}`;

      // update
      strings[i] = `${strings[i].substring(
        0,
        match.index
      )}${newString}${strings[i].substring(match.index + match[0].length)}`;
    }
  }
}
