import { CancellationToken } from '@idl/cancellation-tokens';

import { StripIDs } from '../helpers/strip-ids';
import { Tokenizer } from '../tokenizer';
import {
  IBaseTokenWithoutMatches,
  IBasicToken,
  TOKEN_TYPES,
} from '../tokenizer.interface';
import { TOKEN_NAMES, TokenName } from '../tokens.interface';
import { STRING_NUMBER_TEST } from '../tokens/defs/quotes.interface';

describe('Validates quote parsing', () => {
  /**
   * Binary number types we need to verify that we can properly detect
   */
  const types = ['', 'b', 'u', 's', 'us', 'l', 'll', 'ul', 'ull'];

  it('single quote binary data', () => {
    for (let i = 0; i < types.length; i++) {
      const tokens = Tokenizer(
        `'1001'b${types[i]}`,
        new CancellationToken()
      ).tokens;

      // make sure we have two tokens
      expect(tokens.length).toBe(1);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.NUMBER,
          pos: [0, 0, 7 + types[i].length],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);

      // verify extracted closing text
      const second = tokens[0] as IBasicToken<TokenName>;
      expect(second.matches.length).toBe(3);
      expect(second.matches[2]).toEqual(`b${types[i]}`);
      expect(STRING_NUMBER_TEST.test(second.matches[2])).toBeTruthy();
    }
  });

  it('single quote hex data', () => {
    for (let i = 0; i < types.length; i++) {
      const tokens = Tokenizer(
        `'1001'x${types[i]}`,
        new CancellationToken()
      ).tokens;

      // make sure we have two tokens
      expect(tokens.length).toBe(1);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.NUMBER,
          pos: [0, 0, 7 + types[i].length],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);

      // verify extracted closing text
      const second = tokens[0] as IBasicToken<TokenName>;
      expect(second.matches.length).toBe(3);
      expect(second.matches[2]).toEqual(`x${types[i]}`);
      expect(STRING_NUMBER_TEST.test(second.matches[2])).toBeTruthy();
    }
  });

  it('single quote hex octal', () => {
    for (let i = 0; i < types.length; i++) {
      const tokens = Tokenizer(
        `'1001'o${types[i]}`,
        new CancellationToken()
      ).tokens;

      // make sure we have two tokens
      expect(tokens.length).toBe(1);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.NUMBER,
          pos: [0, 0, 7 + types[i].length],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);

      // verify extracted closing text
      const second = tokens[0] as IBasicToken<TokenName>;
      expect(second.matches.length).toBe(3);
      expect(second.matches[2]).toEqual(`o${types[i]}`);
      expect(STRING_NUMBER_TEST.test(second.matches[2])).toBeTruthy();
    }
  });

  it('double quote binary data', () => {
    for (let i = 0; i < types.length; i++) {
      const tokens = Tokenizer(
        `"1001"b${types[i]}`,
        new CancellationToken()
      ).tokens;

      // make sure we have two tokens
      expect(tokens.length).toBe(1);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.NUMBER,
          pos: [0, 0, 7 + types[i].length],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);

      // verify extracted closing text
      const second = tokens[0] as IBasicToken<TokenName>;
      expect(second.matches.length).toBe(3);
      expect(second.matches[2]).toEqual(`b${types[i]}`);
      expect(STRING_NUMBER_TEST.test(second.matches[2])).toBeTruthy();
    }
  });

  it('double quote hex data', () => {
    for (let i = 0; i < types.length; i++) {
      const tokens = Tokenizer(
        `"1001"x${types[i]}`,
        new CancellationToken()
      ).tokens;

      // make sure we have two tokens
      expect(tokens.length).toBe(1);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.NUMBER,
          pos: [0, 0, 7 + types[i].length],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);

      // verify extracted closing text
      const second = tokens[0] as IBasicToken<TokenName>;
      expect(second.matches.length).toBe(3);
      expect(second.matches[2]).toEqual(`x${types[i]}`);
      expect(STRING_NUMBER_TEST.test(second.matches[2])).toBeTruthy();
    }
  });

  it('double quote octal data', () => {
    for (let i = 0; i < types.length; i++) {
      const tokens = Tokenizer(
        `"1001"o${types[i]}`,
        new CancellationToken()
      ).tokens;

      // make sure we have two tokens
      expect(tokens.length).toBe(1);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.NUMBER,
          pos: [0, 0, 7 + types[i].length],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);

      // verify extracted closing text
      const second = tokens[0] as IBasicToken<TokenName>;
      expect(second.matches.length).toBe(3);
      expect(second.matches[2]).toEqual(`o${types[i]}`);
      expect(STRING_NUMBER_TEST.test(second.matches[2])).toBeTruthy();
    }
  });

  it('make sure other strings correctly fail our check', () => {
    expect(STRING_NUMBER_TEST.test('bad')).toBeFalsy();
    expect(STRING_NUMBER_TEST.test('wrong')).toBeFalsy();
  });
});
