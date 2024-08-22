import { CancellationToken } from '@idl/cancellation-tokens';

import { StripIDs } from '../helpers/strip-ids';
import { Tokenizer } from '../tokenizer';
import { IBaseTokenWithoutMatches, TOKEN_TYPES } from '../tokenizer.interface';
import { TOKEN_NAMES, TokenName } from '../tokens.interface';
import { VARIABLE } from '../tokens/defs/variables.interface';

describe('Validates variable parsing (mostly done elsewhere)', () => {
  it('verifies we can parse many kinds of variables', () => {
    const variables = [`_aA$`];

    // process each number
    for (let i = 0; i < variables.length; i++) {
      // extract number
      const variable = variables[i];

      // get tokens
      const tokens = Tokenizer(
        `a = ${variable}`,
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
          pos: [0, 2, 1],
        },
        {
          type: TOKEN_TYPES.BASIC,
          name: TOKEN_NAMES.VARIABLE,
          pos: [0, 4, variable.length],
        },
        {
          type: TOKEN_TYPES.END,
          name: TOKEN_NAMES.ASSIGNMENT,
          pos: [0, variable.length + 4, 0],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);
    }
  });

  it('verifies solo variables parsed as procedures', () => {
    const variables = [`_aA$`];

    // process each number
    for (let i = 0; i < variables.length; i++) {
      // extract number
      const variable = variables[i];

      // get tokens
      const tokens = Tokenizer(`${variable}`, new CancellationToken()).tokens;

      // make sure we only found one token
      expect(tokens.length).toBe(2);

      // define our expected tokens
      const expected: IBaseTokenWithoutMatches<TokenName>[] = [
        {
          type: TOKEN_TYPES.START,
          name: TOKEN_NAMES.CALL_PROCEDURE,
          pos: [0, 0, variable.length],
        },
        {
          type: TOKEN_TYPES.END,
          name: TOKEN_NAMES.CALL_PROCEDURE,
          pos: [0, 4, 0],
        },
      ];

      expect(StripIDs(tokens, true)).toEqual(expected);
    }
  });

  it('verifies we correctly identify statements that have variables', () => {
    const variables = [`a->super::myfunc(a)`];

    // process each number
    for (let i = 0; i < variables.length; i++) {
      expect(VARIABLE.match.test(variables[i])).toBeTruthy();
    }
  });

  it('verifies we correctly ignore statements that are not variables', () => {
    const variables = [`_IDLitVisualization::SetProperty`];

    // process each number
    for (let i = 0; i < variables.length; i++) {
      expect(VARIABLE.match.test(variables[i])).toBeFalsy();
    }
  });
});
