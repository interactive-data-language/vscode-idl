/**
 * Function to recursively parse a type for us to preserve type arguments
 * and support recursive arguments
 *
 * TODO: If we want a future of type parsing, then we need to define syntax
 * and generalize the tokenizer and syntax tree creation to be able to
 * take different sets of token definitions.
 */
export function SplitType(type: string, found: string[]) {
  // check our syntax to determine what we do next
  const orPos = type.indexOf('|');

  // check if we have type detail
  let argsPos = type.indexOf('<');

  // determine how to proceed
  switch (true) {
    /**
     * If we have type args and they appear before our first or operator
     * then we handle these first
     */
    case argsPos !== -1 && (orPos === -1 || argsPos < orPos): {
      // track number of open alligators
      let count = 1;

      // process each element
      let i: number;
      for (i = argsPos + 1; i < type.length; i++) {
        if (type[i] === '<') {
          count++;
        }
        if (type[i] === '>') {
          count--;
          if (count === 0) {
            found.push(
              type.substring(0, argsPos).trim(),
              type.substring(argsPos + 1, i).trim()
            );
            argsPos = i + 1;
            break;
          }
        }
      }

      /**
       * If we have a type syntax error, then parse what we
       * can and throw the rest away
       */
      if (count > 0) {
        found.push(type.substring(0, argsPos).trim(), undefined);
      } else {
        /**
         * If we parsed correctly, then check if we have an or operator
         * next that we need to check
         *
         * Don't use what we saved above as we could have had the "or" operator
         * within a type arg
         */
        const next = type.substring(i + 1).trim();
        if (next[0] === '|') {
          SplitType(next.substring(1), found);
        }
      }
      break;
    }
    /**
     * Check if we have an or operator that we need to also process
     */
    case orPos !== -1:
      found.push(type.substring(0, orPos - 1).trim(), undefined);
      SplitType(type.substring(orPos + 1), found);
      break;
    /**
     * Nothing special, so just parse it normal
     */
    default:
      found.push(type.trim(), undefined);
      break;
  }
}
