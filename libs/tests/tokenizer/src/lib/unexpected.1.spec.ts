import { CancellationToken } from '@idl/cancellation-tokens';
import {
  IBaseToken,
  StripIDs,
  TOKEN_NAMES,
  TOKEN_TYPES,
  Tokenizer,
  TokenName,
} from '@idl/parsing/tokenizer';

describe(`[auto generated] Validates unexpected closer parsing`, () => {
  it(`[auto generated] verifies we catch unexpected closers (other tests cover correctly catching real closers instead of these)`, () => {
    // test code to extract tokens from
    const code = [
      `)`,
      `]`,
      `}`,
      `endif`,
      `endelse`,
      `endfor`,
      `endforeach`,
      `endrep`,
      `endwhile`,
      `endswitch`,
      `endcase`,
      `end`,
    ];

    // extract tokens
    const tokenized = Tokenizer(code, new CancellationToken());

    // define expected tokens
    const expected: IBaseToken<TokenName>[] = [
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [0, 0, 1],
        matches: [`)`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [1, 0, 1],
        matches: [`]`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [2, 0, 1],
        matches: [`}`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [3, 0, 5],
        matches: [`endif`, `endif`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [4, 0, 7],
        matches: [`endelse`, `endelse`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [5, 0, 6],
        matches: [`endfor`, `endfor`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [6, 0, 10],
        matches: [`endforeach`, `endforeach`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [7, 0, 6],
        matches: [`endrep`, `endrep`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [8, 0, 8],
        matches: [`endwhile`, `endwhile`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [9, 0, 9],
        matches: [`endswitch`, `endswitch`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.UNEXPECTED_CLOSER,
        pos: [10, 0, 7],
        matches: [`endcase`, `endcase`],
      },
      {
        type: TOKEN_TYPES.BASIC,
        name: TOKEN_NAMES.MAIN_LEVEL_END,
        pos: [11, 0, 3],
        matches: [`end`],
      },
    ];

    expect(StripIDs(tokenized.tokens)).toEqual(expected);
  });
});
