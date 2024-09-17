import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Check for known keywords`, () => {
  it(`[auto generated] correctly with obj_destroy`, async () => {
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
      `pro TestClass__define`,
      `  compile_opt idl2`,
      `  !null = {TestClass, data: ptr_new()}`,
      `end`,
      ``,
      `function TestClass::init, value`,
      `  compile_opt idl2`,
      `  self.data = ptr_new(0)`,
      `  *self.data = value`,
      `  return, 1`,
      `end`,
      ``,
      `pro TestClass::Cleanup, keyword = keyword`,
      `  compile_opt idl2`,
      `  if keyword_set(keyword) then print, 'keyword set!'`,
      `  print, 'I have been called!'`,
      `end`,
      ``,
      ``,
      `pro test`,
      `  compile_opt idl2`,
      ``,
      `  obj = obj_new('TestClass', 1)`,
      ``,
      `  obj_destroy, obj, /keyword `,
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
    const expected: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
