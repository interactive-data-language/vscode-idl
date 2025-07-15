import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Does not detect unknown tokens`, () => {
  it(`[auto generated] with case`, async () => {
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
      `;+`,
      `; :Returns: Long`,
      `;`,
      `;-`,
      `function Class::Test`,
      `  compile_opt idl2`,
      ``,
      `  case (!true) of`,
      `    self.segnames.pix_latlon: (*self.scan_info_ptr).SetProperty, geo_file = outname`,
      `    self.segnames.pix_latlon: (*self.scan_info_ptr).SetProperty(eo_file = outname)`,
      `    else:`,
      `  endcase`,
      ``,
      `  return, 1`,
      `end`,
      ``,
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
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [9, 30, 1],
        end: [9, 81, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] with switch`, async () => {
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
      `;+`,
      `; :Returns: Long`,
      `;`,
      `;-`,
      `function Class::Test`,
      `  compile_opt idl2`,
      ``,
      `  switch (!true) of`,
      `    self.segnames.pix_latlon: (*self.scan_info_ptr).SetProperty, geo_file = outname`,
      `    self.segnames.pix_latlon: (*self.scan_info_ptr).SetProperty(eo_file = outname)`,
      `    else:`,
      `  endswitch`,
      ``,
      `  return, 1`,
      `end`,
      ``,
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
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [9, 30, 1],
        end: [9, 81, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
