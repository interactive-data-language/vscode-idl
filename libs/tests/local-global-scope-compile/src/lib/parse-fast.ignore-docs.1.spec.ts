import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify fast parsing ignores docs`, () => {
  it(`[auto generated] for structures`, async () => {
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
      `; :MyStruct:`,
      `;   prop: Long`,
      `;     Placeholder docs for argument or keyword`,
      `;   prop2: ENVIRaster`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro mystruct__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1, prop2: 4}`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, {
      postProcess: true,
      full: false,
    });

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: { mystruct__define: {} },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'mystruct__define',
        pos: [8, 4, 16],
        meta: {
          source: 'user',
          args: {},
          docs: '#### mystruct__define\n\n```idl\nmystruct__define\n```\n\n\n\n### Mystruct\n\nprop: Long\n  Placeholder docs for argument or keyword\nprop2: ENVIRaster\n  Placeholder docs for argument or keyword',
          docsLookup: {
            default: '',
            mystruct:
              'prop: Long\n  Placeholder docs for argument or keyword\nprop2: ENVIRaster\n  Placeholder docs for argument or keyword',
          },
          display: 'mystruct__define',
          kws: {},
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { mystruct__define: [] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});