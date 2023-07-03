import { IParsedHTML } from './parser.interface';

/**
 * Routine that recurses to convert elements to text
 */
export function ElementsToTextRecurser(
  els: IParsedHTML[],
  strings: string[],
  after = false
) {
  // determine how to proceed
  for (let i = 0; i < els.length; i++) {
    switch (true) {
      case els[i].children !== undefined:
        ElementsToTextRecurser(els[i].children, strings, false);
        break;
      case els[i].type === 'text':
        strings.push(els[i].content.trimRight());
        break;
      default:
        // do nothing
        break;
    }

    // check if we have a break
    if (els[i].tagName === 'br') {
      strings.push('\n');
    }

    // check if we need to push a new line or not
    if (els[i].tagName === 'p' && after) {
      strings.push('\n');
    }
  }
}

/**
 * Converts elements to text
 *
 * @param {IParsedHTML[]} els
 * @param {boolean} [after=true] If set, in first pass we add new lines after "p" elements
 */
export function ElementsToText(els: IParsedHTML[], after = true): string {
  const strings: string[] = [];

  ElementsToTextRecurser(els, strings, after);

  return strings.join('');
}
