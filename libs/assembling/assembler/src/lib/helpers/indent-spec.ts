import { MakeSpaces } from '@idl/parsing/syntax-tree';

const LUNA_REGEX = /^(\w+)\s*=\s*luna\s*\(/i;
const SUITE_REGEX = /^\w+\s*=\s*(\w+)\.suite\s*\(/i;
const TEST_REGEX = /^\w+\s*=\s*(\w+)\.test\s*\(/i;
const EXPECTS_REGEX = /^(\w+)\s*=\s*\w+\.expects\s*\(/i;
const DIRECT_EXPECTS_REGEX = /^\(\s*\w+\.expects\s*\(/i;
const ROUTINE_REGEX = /^(pro|function)\s/i;
const END_REGEX = /^end\s*(;.*)?$/i;

/**
 * Adds extra indentation to formatted lines of main-level code that uses
 * Luna (i.e. `.spec.pro` files) so suites and tests are nested:
 *
 * ```idl
 * l = luna()
 *   s = l.suite('suite')
 *     it = s.test('test')
 *       (it.expects(1)).toEqual, 1
 * l.generateTestSummary
 * end
 * ```
 *
 * Expects lines that have already been formatted (i.e. routine bodies
 * are indented so `end` for routines is the only `end` at the base indent).
 */
export function IndentSpec(
  lines: string[],
  tabWidth: number,
  spaceOffset = 0,
): string[] {
  /** Variable names for luna objects */
  const lunas = new Set<string>();

  /** Level of each line, undefined for comments/blanks which are resolved after */
  const levels: (number | undefined)[] = new Array(lines.length);

  /** Level for lines that don't open something */
  let bodyLevel = 0;

  /** Inside a procedure or function */
  let inRoutine = false;

  /** Previous code line ended with a line continuation */
  let continued = false;

  /** Level of the statement that is being continued */
  let continuedLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // comments and blank lines are resolved by the next line of code
    if (trimmed === '' || trimmed.startsWith(';')) {
      levels[i] = continued ? continuedLevel : undefined;
      continue;
    }

    /** Only lines at the base indent can change our state */
    const isBase = lines[i].length - lines[i].trimStart().length <= spaceOffset;

    let level = bodyLevel;

    switch (true) {
      case continued:
        level = continuedLevel;
        break;
      case inRoutine:
        level = 0;
        if (isBase && END_REGEX.test(trimmed)) {
          inRoutine = false;
        }
        break;
      case isBase: {
        const lunaMatch = LUNA_REGEX.exec(trimmed);
        const suiteMatch = SUITE_REGEX.exec(trimmed);

        switch (true) {
          case ROUTINE_REGEX.test(trimmed):
            inRoutine = true;
            bodyLevel = 0;
            level = 0;
            break;
          case lunaMatch !== null:
            lunas.add(lunaMatch[1].toLowerCase());
            bodyLevel = 0;
            level = 0;
            break;
          case suiteMatch !== null && lunas.has(suiteMatch[1].toLowerCase()):
            level = 1;
            bodyLevel = 2;
            break;
          case TEST_REGEX.test(trimmed) && bodyLevel >= 2:
            level = 2;
            bodyLevel = 3;
            break;
          case EXPECTS_REGEX.test(trimmed) && bodyLevel >= 3:
            level = 3;
            bodyLevel = 4;
            break;
          case DIRECT_EXPECTS_REGEX.test(trimmed) && bodyLevel >= 3:
            level = 3;
            bodyLevel = 3;
            break;
          case END_REGEX.test(trimmed):
          case lunas.has(trimmed.split(/[.\s,=(]/)[0].toLowerCase()):
            level = 0;
            bodyLevel = 0;
            break;
        }
        break;
      }
    }

    levels[i] = level;
    continuedLevel = level;
    continued = /\$\s*(;.*)?$/.test(trimmed);
  }

  // comments use the level of the next line of code, blank lines stay empty
  let next = 0;
  const out: string[] = new Array(lines.length);
  for (let i = lines.length - 1; i >= 0; i--) {
    const level = levels[i] ?? next;
    if (levels[i] !== undefined) {
      next = level;
    }
    out[i] =
      lines[i].trim() === ''
        ? lines[i]
        : MakeSpaces(level * tabWidth) + lines[i];
  }

  return out;
}
