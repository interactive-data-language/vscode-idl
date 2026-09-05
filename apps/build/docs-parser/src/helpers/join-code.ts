import { CodeFormatter } from './code-formatter';
import { IParsedHTML } from './parser.interface';

/**
 * Joins code blocks within the children of the specified elements.
 *
 * Does not do this recursively and only checks the first level of children
 */
export async function JoinCode(kids: IParsedHTML[]) {
  /** index where code parsing starts */
  let codeStart = -1;

  /** New code elements that we are joining */
  const newCode: IParsedHTML[] = [];

  /** Flag if we are processing code right now */
  let isCode = false;

  /** Track elements that were removed for consistent array indexing */
  let removed = 0;

  /** Number of elements in our array since we are potentially changing we need this as a constant */
  const nKids = kids.length;

  // writeFileSync(
  //   join(process.cwd(), 'before.json'),
  //   JSON.stringify(kids, null, 2)
  // );

  // process all children and join direct code blocks
  for (let j = 0; j < nKids; j++) {
    // get true index
    const i = j - removed;

    // only skip text when we dont have code
    if (kids[i].type === 'text' && !isCode) {
      continue;
    }

    // get our child
    const element = kids[i];

    /** Flag indicating if we have something to clean up or not */
    let cleanup = false;

    // check for element
    if (element.tagName === 'p') {
      // if we have indented code, update it
      if (element?.attributes[0]?.value === 'Code_Indented') {
        element.attributes[0].value = 'Code';
        element.children[0].content = `  ${element.children[0].content}`;
      }

      // check for code
      const elIsCode = element?.attributes[0]?.value === 'Code';

      // determine how to proceed
      if (elIsCode) {
        // check if we need to update starts or we
        if (!isCode) {
          isCode = true;
          codeStart = i;
        }

        // save element
        newCode.push(element);
      } else {
        cleanup = true;
      }
    } else {
      // save raw text and keep going
      if (element.type === 'text') {
        newCode.push(element);
      } else {
        cleanup = true;
        isCode = false;
      }
    }

    // cleanup if manually specified or the last element
    if (cleanup || j === nKids - 1) {
      // replace
      if (newCode.length > 0) {
        // get the number of elements
        const n = newCode.length;

        // update count for what was removed
        removed += n - 1;

        const newEl: IParsedHTML = {
          type: 'element',
          tagName: 'pre',
          attributes: [],
          children: [
            {
              type: 'text',
              content: await CodeFormatter(newCode.splice(0, n)),
            },
          ],
        };

        // replace children
        kids.splice(codeStart, n, newEl);
      }

      // update flag
      isCode = false;
    }
  }

  // writeFileSync(
  //   join(process.cwd(), 'after.json'),
  //   JSON.stringify(kids, null, 2)
  // );

  // process.exit();
}
