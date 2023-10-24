import { LanguageConfiguration } from 'vscode';

import { ON_ENTER_COMMENTS } from './helpers/on-enter-comments';

/**
 * IDL's language
 */
export const LANGUAGE_CONFIGURATION: LanguageConfiguration = {
  comments: {
    lineComment: ';',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
    // ['`', '`'],
    ['of', 'end'],
    ['of', 'endcase'],
    ['of', 'endswitch'],
    ['begin', 'endcase'],
    ['begin', 'endswitch'],
    ['begin', 'endif'],
    ['begin', 'endelse'],
    ['begin', 'endfor'],
    ['begin', 'endforeach'],
    ['begin', 'endwhile'],
    ['begin', 'endrep'],
    ['begin', 'end'],
    ['pro', 'end'],
    ['function', 'end'],
  ],
  indentationRules: {
    increaseIndentPattern: /^.*(?:\b(?:pro|function|begin|of)\b)\s*(;.*)?$/i,
    // /^.*(?:\b(?:pro|function|begin|of)\b|(?<![a-z_0-9])\$)\s*(;.*)?$/i,
    decreaseIndentPattern:
      /^.*\b(?:endif|endelse|endfor|endforeach|endrep|endwhile|endswitch|endcase)\b.*$/i,
  },
  onEnterRules: [
    ...ON_ENTER_COMMENTS,
    // {
    //   beforeText: /^\s*\bswitch\b.*\bof\b.*$/,
    //   action: {
    //     appendText: 'endswitch',
    //     indentAction: IndentAction.None,
    //   },
    // },
  ],
  wordPattern: /(-?\d*\.\d\w*)|([^`~@#%^&*()\-=+[{\]}\\|;:\\'",.<>/?\s]+)/,
};
