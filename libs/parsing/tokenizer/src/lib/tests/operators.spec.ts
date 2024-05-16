import { CancellationToken } from '@idl/cancellation-tokens';

import { StripIDs } from '../helpers/strip-ids';
import { TestGlobal } from '../helpers/test-global';
import { Tokenizer } from '../tokenizer';
import { IBaseTokenWithoutMatches, TOKEN_TYPES } from '../tokenizer.interface';
import { TOKEN_NAMES, TokenName } from '../tokens.interface';
import { OPERATORS } from '../tokens/defs/operators.interface';

describe('Validates operator parsing', () => {
  it('verifies we can detect most operators', () => {
    const operators = [
      `^`,
      `##`,
      `#`,
      `*`,
      `/`,
      `mod`,
      `+`,
      `-`,
      `<`,
      `>`,
      `~`,
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
          name: TOKEN_NAMES.OPERATOR,
          pos: [0, 2, operator.length],
        },
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.VARIABLE,
          pos: [0, operator.length + 3, 1],
        },
        {
          type: TOKEN_TYPES.END,
          name: TOKEN_NAMES.OPERATOR,
          pos: [0, operator.length + 4, 0],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);
    }
  });

  it('verifies we can detect most operators', () => {
    const operators = [
      `not`,
      `eq`,
      `ne`,
      `le`,
      `lt`,
      `ge`,
      `gt`,
      `and`,
      `or`,
      `xor`,
      `&&`,
      `||`,
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
          name: TOKEN_NAMES.OPERATOR_LOGICAL,
          pos: [0, 2, operator.length],
        },
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.VARIABLE,
          pos: [0, operator.length + 3, 1],
        },
        {
          type: TOKEN_TYPES.END,
          name: TOKEN_NAMES.OPERATOR_LOGICAL,
          pos: [0, operator.length + 4, 0],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);
    }
  });

  it('verifies special operators first', () => {
    const operators = [`++`, `--`];

    // process each number
    for (let i = 0; i < operators.length; i++) {
      // extract number
      const operator = operators[i];

      // get tokens
      const tokens = Tokenizer(`${operator}a`, new CancellationToken()).tokens;

      // make sure we only found one token
      expect(tokens.length).toBe(3);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.START,
          name: TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT,
          pos: [0, 0, 2],
        },
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.VARIABLE,
          pos: [0, 2, 1],
        },
        {
          type: TOKEN_TYPES.END,
          name: TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT,
          pos: [0, 3, 0],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);
    }
  });

  it('verifies special operators last', () => {
    const operators = [`++`, `--`];

    // process each number
    for (let i = 0; i < operators.length; i++) {
      // extract number
      const operator = operators[i];

      // get tokens
      const tokens = Tokenizer(`a${operator}`, new CancellationToken()).tokens;

      // make sure we only found one token
      expect(tokens.length).toBe(3);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.VARIABLE,
          pos: [0, 0, 1],
        },
        {
          type: TOKEN_TYPES.START,
          name: TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT,
          pos: [0, 1, 2],
        },
        {
          type: TOKEN_TYPES.END,
          name: TOKEN_NAMES.OPERATOR_INCREMENT_DECREMENT,
          pos: [0, 3, 0],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);
    }
  });

  it('verifies we dont catch arrow functions', () => {
    expect(OPERATORS.match.test(`->`)).toBeFalsy();
  });

  it('verifies we dont catch operators in words', () => {
    const ignore = [
      `mod`,
      `not`,
      `eq`,
      `ne`,
      `le`,
      `lt`,
      `ge`,
      `gt`,
      `and`,
      `or`,
      `xor`,
    ];
    for (let i = 0; i < ignore.length; i++) {
      expect(TestGlobal(`${ignore[i]}bcd`, OPERATORS.match)).toBeFalsy();
      expect(TestGlobal(`a${ignore[i]}bcd`, OPERATORS.match)).toBeFalsy();
      expect(TestGlobal(`_xy${ignore[i]}`, OPERATORS.match)).toBeFalsy();
    }
  });
});
