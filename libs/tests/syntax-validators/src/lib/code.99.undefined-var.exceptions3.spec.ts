import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Without known global, arguments are least restrictive`, () => {
  it(`[auto generated] and bidirectional`, async () => {
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
      `; :Returns:`,
      `;   any`,
      `;`,
      `; :Arguments:`,
      `;   data: bidirectional, required, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function dataToMemoryRaster, data`,
      `  compile_opt idl2, hidden`,
      ``,
      `  ; make everything`,
      `  oSvc = obj_new('IDLcfSvcOpenMemoryRaster') ; IDLcfSvcOpenMemoryRaster()`,
      `  ok = oSvc.Open(memory_data = data, '', oRaster, data_type = data.typecode)`,
      `  ok = IDLcfGetServiceObject(!null, 'ManageRaster', oManageRaster)`,
      `  void = oManageRaster.ManageBands(oRaster)`,
      ``,
      `  ; return our raster`,
      `  return, ENVIWrapComponent(oRaster)`,
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
        code: 104,
        info: 'Unused variable "void"',
        start: [16, 2, 4],
        end: [16, 2, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
