import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Line separators (&)`, () => {
  it(`[auto generated] Another example from docs`, async () => {
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
      `compile_opt idl2`,
      ``,
      `if rtol lt ftol then begin ;Done?`,
      `t = y[0] & y[0] = y[ilo] & y[ilo] = t ;Sort so fcn min is 0th elem`,
      `t = p[*,ilo] & p[*,ilo] = p[*,0] & p[*,0] = t`,
      `return, t                 ;params for fcn min`,
      `endif`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        ``,
        `if rtol lt ftol then begin ; Done?`,
        `  t = y[0]`,
        `  y[0] = y[ilo]`,
        `  y[ilo] = t ; Sort so fcn min is 0th elem`,
        `  t = p[*, ilo]`,
        `  p[*, ilo] = p[*, 0]`,
        `  p[*, 0] = t`,
        `  return, t ; params for fcn min`,
        `endif`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 20,
        info: 'In procedures and main level programs, the "return" procedure cannot have values',
        start: [5, 0, 6],
        end: [5, 45, 0],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "rtol"',
        start: [2, 3, 4],
        end: [2, 3, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ftol"',
        start: [2, 11, 4],
        end: [2, 11, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "y"',
        start: [3, 4, 1],
        end: [3, 4, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "y"',
        start: [3, 11, 1],
        end: [3, 11, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "y"',
        start: [3, 18, 1],
        end: [3, 18, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ilo"',
        start: [3, 20, 3],
        end: [3, 20, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "y"',
        start: [3, 27, 1],
        end: [3, 27, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ilo"',
        start: [3, 29, 3],
        end: [3, 29, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "p"',
        start: [4, 4, 1],
        end: [4, 4, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ilo"',
        start: [4, 8, 3],
        end: [4, 8, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "p"',
        start: [4, 15, 1],
        end: [4, 15, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ilo"',
        start: [4, 19, 3],
        end: [4, 19, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "p"',
        start: [4, 26, 1],
        end: [4, 26, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "p"',
        start: [4, 35, 1],
        end: [4, 35, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
