import { Assembler } from '@idl/assembler';
import {
  ASSEMBLER_FORMATTER_LOOKUP,
  STYLE_FLAG_LOOKUP,
} from '@idl/assembling/config';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';

import { ElementsToText } from './elements-to-text';
import { IParsedHTML } from './parser.interface';

/**
 * Convert special HTML characters to
 */
function UnEscape(htmlStr: string) {
  return htmlStr
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#160;/gim, ' ');
}

/**
 * IDL Index for formatting codes and methods
 */
const INDEX = new IDLIndex(
  new LogManager({
    alert: () => {
      // do nothing
    },
  }),
  0,
  true
);

/**
 * Wrapper to parse code and add an "end" if we need it so
 * we can potentially format
 */
async function ParseAndFormatCode(code: string) {
  // parse
  let tokenized = await INDEX.getParsedProCode('my_file.pro', code, {
    postProcess: true,
    isNotebook: true,
  });

  // check for missing main level end
  let addEnd = false;
  for (let i = 0; i < tokenized.parseProblems.length; i++) {
    if (
      tokenized.parseProblems[i].code === IDL_PROBLEM_CODES.MISSING_MAIN_END
    ) {
      addEnd = true;
      break;
    }
  }

  // add end and process again
  if (addEnd) {
    tokenized = await INDEX.getParsedProCode('my_file.pro', code + '\nend', {
      postProcess: true,
      isNotebook: true,
    });
  }

  // attempt to format
  let formatted = Assembler(tokenized, {
    formatter: ASSEMBLER_FORMATTER_LOOKUP.FIDDLE,
    spaceOffset: 2,
    style: {
      hex: STYLE_FLAG_LOOKUP.UPPER,
    },
    autoFix: true,
    autoDoc: false,
  });

  // remove extra end if we have it
  if (formatted !== undefined && addEnd) {
    formatted = formatted.replace(/\s*end\n*$/im, '');
  }

  // return if we could format or not
  return formatted !== undefined ? formatted : code;
}

/**
 * Formats code blocks for consistent appearance throughout the application
 */
export async function CodeFormatter(code: IParsedHTML[]): Promise<string> {
  // convert to text and remove HTML escape characters so we can parse
  const raw = UnEscape(ElementsToText(code.filter((el) => el.type !== 'text')));

  return `\`\`\`idl\n${await ParseAndFormatCode(raw)}\n\`\`\`\n`;
}
