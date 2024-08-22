import { CancellationToken } from '@idl/cancellation-tokens';

import { StripIDs } from '../helpers/strip-ids';
import { Tokenizer } from '../tokenizer';
import { IBaseTokenWithoutMatches, TOKEN_TYPES } from '../tokenizer.interface';
import { TOKEN_NAMES, TokenName } from '../tokens.interface';

describe('Validates compound operator parsing', () => {
  it('verifies we can detect most operators', () => {
    const operators = [
      `*=`,
      `/=`,
      `+=`,
      `-=`,
      `#=`,
      `<=`,
      `##=`,
      `>=`,
      `and=`,
      `or=`,
      `xor=`,
      `^=`,
      `eq=`,
      `ne=`,
      `lt=`,
      `le=`,
      `gt=`,
      `ge=`,
      `mod=`,
    ];

    // process each number
    for (let i = 0; i < operators.length; i++) {
      // extract number
      const operator = operators[i];

      // get tokens
      const tokens = Tokenizer(
        `a ${operator} b`,
        new CancellationToken()
      ).tokens;

      // make sure we only found one token
      expect(tokens.length).toBe(4);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.VARIABLE,
          pos: [0, 0, 1],
        },
        {
          type: TOKEN_TYPES.START,
          name: TOKEN_NAMES.ASSIGNMENT,
          pos: [0, 2, operator.length],
        },
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.VARIABLE,
          pos: [0, operator.length + 3, 1],
        },
        {
          type: TOKEN_TYPES.END,
          name: TOKEN_NAMES.ASSIGNMENT,
          pos: [0, operator.length + 4, 0],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);
    }
  });
});
