import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify complex formatting`, () => {
  it(`[auto generated] moves main level correctly`, async () => {
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
      `; :Description:`,
      `;    Function which will initialize the bdige_it object and start all bridges. When bridges are initialized`,
      `;    they are done so in parallel, but whe function will not return until every bridge is idle again.`,
      `;`,
      `; :Params:`,
      `;    nbridges: in, required, type=int`,
      `;       The number of bridges that you want to create`,
      `;`,
      `; :Keywords:`,
      `;    INIT : in, optional, type=strarr`,
      `;       Optional argument which allows you to pass in a string array of extra commands`,
      `;       to have each IDL_IDLBridge object execute upon creation.`,
      `;    MSG : in, optional, type=string`,
      `;       Optional argument to show the message prefix when a bridge process has completed for the TIME`,
      `;       keyword in bridge_it::run and bridge_it::run().`,
      `;    LOGDIR : in, optional, type=string`,
      `;       Specify the directory that the log file will be written to. The log file is just a text file with`,
      `;       all of the IDL Console output from each child process.`,
      `;    NREFRESH : in, optional, type=long`,
      `;       Specify the number of bridge processes to execute before closing and re-starting the`,
      `;       child process. Necessary for some ENVI routines so that we don't have memory fragmentation`,
      `;       regarding opening lots of small rasters.`,
      `;    PREFIX : in, optional, type=string, default='_KW_'`,
      `;       This optional keyword specifies the prefix which is used to differentiate between arguments and`,
      `;       keywords when it comes time to parse the arguments and keyword that will be passed into a routine.`,
      `;`,
      `; :Author: Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)`,
      `;`,
      `;-`,
      `function bridge_it::Init, nbridges, INIT = init, MSG = msg, LOGDIR = logdir, NREFRESH = nrefresh, PREFIX = prefix`,
      `  compile_opt idl2, hidden`,
      `  on_error, 2`,
      ``,
      `  return, 1`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Description:`,
        `;   Function which will initialize the bdige_it object and start all bridges. When bridges are initialized`,
        `;   they are done so in parallel, but whe function will not return until every bridge is idle again.`,
        `;`,
        `; :Returns: bridge_it`,
        `;`,
        `; :Arguments:`,
        `;   nbridges: in, required, Int`,
        `;     The number of bridges that you want to create`,
        `;`,
        `; :Keywords:`,
        `;   init: in, optional, strarr`,
        `;     Optional argument which allows you to pass in a string array of extra commands`,
        `;     to have each IDL_IDLBridge object execute upon creation.`,
        `;   logdir: in, optional, String`,
        `;     Specify the directory that the log file will be written to. The log file is just a text file with`,
        `;     all of the IDL Console output from each child process.`,
        `;   msg: in, optional, String`,
        `;     Optional argument to show the message prefix when a bridge process has completed for the TIME`,
        `;     keyword in bridge_it::run and bridge_it::run().`,
        `;   nrefresh: in, optional, Long`,
        `;     Specify the number of bridge processes to execute before closing and re-starting the`,
        `;     child process. Necessary for some ENVI routines so that we don't have memory fragmentation`,
        `;     regarding opening lots of small rasters.`,
        `;   prefix: in, optional, String`,
        `;     This optional keyword specifies the prefix which is used to differentiate between arguments and`,
        `;     keywords when it comes time to parse the arguments and keyword that will be passed into a routine.`,
        `;`,
        `; :Author:`,
        `;   Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)`,
        `;`,
        `;-`,
        `function bridge_it::Init, nbridges, init = init, msg = msg, logdir = logdir, nrefresh = nrefresh, prefix = prefix`,
        `  compile_opt idl2, hidden`,
        `  on_error, 2`,
        ``,
        `  return, 1`,
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
        code: 56,
        info: 'The last docs parameter is only allowed to be "private" or "public". If not specified, it will be considered public',
        start: [23, 41, 14],
        end: [23, 41, 14],
      },
      {
        code: 52,
        info: 'Expected a documentation tag for ":Returns:" since this is a function or function method',
        start: [0, 0, 2],
        end: [29, 0, 2],
      },
      {
        code: 104,
        info: 'Unused variable "init"',
        start: [33, 43, 4],
        end: [33, 43, 4],
      },
      {
        code: 104,
        info: 'Unused variable "msg"',
        start: [33, 55, 3],
        end: [33, 55, 3],
      },
      {
        code: 104,
        info: 'Unused variable "logdir"',
        start: [33, 69, 6],
        end: [33, 69, 6],
      },
      {
        code: 104,
        info: 'Unused variable "nrefresh"',
        start: [33, 88, 8],
        end: [33, 88, 8],
      },
      {
        code: 104,
        info: 'Unused variable "prefix"',
        start: [33, 107, 6],
        end: [33, 107, 6],
      },
      {
        code: 104,
        info: 'Unused variable "nbridges"',
        start: [33, 26, 8],
        end: [33, 26, 8],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
