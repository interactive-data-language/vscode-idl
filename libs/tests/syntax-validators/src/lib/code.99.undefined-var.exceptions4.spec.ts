import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Keyword variables should be defined`, () => {
  it(`[auto generated] and not report errors`, async () => {
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
      `function bridge_it::Init, nbridges, init = init, msg = msg, logdir = logdir, nrefresh = nrefresh, prefix = prefix`,
      `compile_opt idl2, hidden`,
      ``,
      `; check to see if different messag eneeds to be used`,
      `if ~keyword_set(msg) then self.msg = 'Time to complete bridge process (sec): ' else self.msg = msg`,
      ``,
      `; check to see if we have a number of processes to complete before refreshing the bridges`,
      `; otherwise set the refresh number to an absurbly high result!`,
      `if keyword_set(nrefresh) then self.nrefresh = nrefresh else self.nrefresh = 1000000l`,
      ``,
      `; check if init keyword is set, if so then we want to save the init string`,
      `if keyword_set(init) then self.init = strjoin(init, ' & ')`,
      ``,
      `; check if logdir is specified`,
      `if keyword_set(logdir) then begin`,
      `  if file_test(logdir) then begin`,
      `    self.logdir = logdir`,
      `  endif else begin`,
      `    message, 'Specified LOGDIR does not exist!'`,
      `  endelse`,
      `endif`,
      ``,
      `return, 1`,
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
        info: 'Unused variable "prefix"',
        start: [0, 107, 6],
        end: [0, 107, 6],
      },
      {
        code: 104,
        info: 'Unused variable "nbridges"',
        start: [0, 26, 8],
        end: [0, 26, 8],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
