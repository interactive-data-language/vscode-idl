import { CancellationToken } from '@idl/cancellation-tokens';

import { StripIDs } from '../helpers/strip-ids';
import { Tokenizer } from '../tokenizer';
import { IBaseTokenWithoutMatches, TOKEN_TYPES } from '../tokenizer.interface';
import { TOKEN_NAMES, TokenName } from '../tokens.interface';
import { NUMBER_STRING_TEST } from '../tokens/defs/numbers.interface';

describe('Validates number parsing', () => {
  it('validate test for number strings being valid', () => {
    const check = ['b', 's', 'l', 'ul', 'll', 'ull', 'd'];
    for (let i = 0; i < check.length; i++) {
      expect(NUMBER_STRING_TEST.test(check[i])).toBeTruthy();

      // account for imaginary and complex to make sure regex works
      expect(NUMBER_STRING_TEST.test(check[i] + 'i')).toBeTruthy();
      expect(NUMBER_STRING_TEST.test(check[i] + 'j')).toBeTruthy();
    }
  });

  it('validate test for number strings being valid', () => {
    expect(NUMBER_STRING_TEST.test('a')).toBeFalsy();
  });

  it('verifies we can detect all types of numbers', () => {
    const numbers = [
      `5`,
      `5.0`,
      `5.`,
      `.5`,
      // `-.5`,
      `.5d`,
      // `-1`,
      `1`,
      `5b`,
      `0S`,
      `0l`,
      `0ul`,
      `0ll`,
      `0ull`,
      `0.0d`,
      // `-0.0D`,
      `0.0D`,
    ];

    // process each number
    for (let i = 0; i < numbers.length; i++) {
      // extract number
      const number = numbers[i];

      // get tokens
      const tokens = Tokenizer(number, new CancellationToken()).tokens;

      // make sure we only found one token
      expect(tokens.length).toBe(1);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.NUMBER,
          pos: [0, 0, number.length],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);
    }
  });
});
