import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects unexpected closers`, () => {
  it(`[auto generated] finds all unexpected closers`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

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
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [0, 0, 1],
        end: [0, 0, 1],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [1, 0, 1],
        end: [1, 0, 1],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [3, 0, 5],
        end: [3, 0, 5],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [4, 0, 7],
        end: [4, 0, 7],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [5, 0, 6],
        end: [5, 0, 6],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [6, 0, 10],
        end: [6, 0, 10],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [7, 0, 6],
        end: [7, 0, 6],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [8, 0, 8],
        end: [8, 0, 8],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [9, 0, 9],
        end: [9, 0, 9],
        canReport: true,
      },
      {
        code: 1,
        info: 'Unexpected closing statement',
        start: [10, 0, 7],
        end: [10, 0, 7],
        canReport: true,
      },
      {
        code: 34,
        info: 'Main level programs cannot be empty. IDL expects statements besides comments and "end".',
        start: [11, 0, 3],
        end: [11, 0, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] correctly processes routines and expects no errors`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [
      `Function f1`,
      `  if keyword_set(fclip) then begin`,
      `    return, 1`,
      `  endif`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 9],
        end: [0, 11, 0],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "fclip"',
        start: [1, 17, 5],
        end: [1, 17, 5],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
