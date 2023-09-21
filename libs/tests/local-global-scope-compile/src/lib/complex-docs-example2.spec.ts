import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Complex real world test`, () => {
  it(`[auto generated] with past failure in complex docs`, async () => {
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
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {
        'bridge_it::init': {
          init: {
            type: 'v',
            name: 'init',
            pos: [30, 43, 4],
            meta: {
              display: 'init',
              isDefined: true,
              usage: [[30, 43, 4]],
              docs: 'Optional argument which allows you to pass in a string array of extra commands\nto have each IDL_IDLBridge object execute upon creation.',
              source: 'user',
              type: [{ name: 'strarr', display: 'strarr', args: [], meta: {} }],
            },
          },
          msg: {
            type: 'v',
            name: 'msg',
            pos: [30, 55, 3],
            meta: {
              display: 'msg',
              isDefined: true,
              usage: [[30, 55, 3]],
              docs: 'Optional argument to show the message prefix when a bridge process has completed for the TIME\nkeyword in bridge_it::run and bridge_it::run().',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          logdir: {
            type: 'v',
            name: 'logdir',
            pos: [30, 69, 6],
            meta: {
              display: 'logdir',
              isDefined: true,
              usage: [[30, 69, 6]],
              docs: 'Specify the directory that the log file will be written to. The log file is just a text file with\nall of the IDL Console output from each child process.',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          nrefresh: {
            type: 'v',
            name: 'nrefresh',
            pos: [30, 88, 8],
            meta: {
              display: 'nrefresh',
              isDefined: true,
              usage: [[30, 88, 8]],
              docs: "Specify the number of bridge processes to execute before closing and re-starting the\nchild process. Necessary for some ENVI routines so that we don't have memory fragmentation\nregarding opening lots of small rasters.",
              source: 'user',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
            },
          },
          prefix: {
            type: 'v',
            name: 'prefix',
            pos: [30, 107, 6],
            meta: {
              display: 'prefix',
              isDefined: true,
              usage: [[30, 107, 6]],
              docs: 'This optional keyword specifies the prefix which is used to differentiate between arguments and\nkeywords when it comes time to parse the arguments and keyword that will be passed into a routine.',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          nbridges: {
            type: 'v',
            name: 'nbridges',
            pos: [30, 26, 8],
            meta: {
              display: 'nbridges',
              isDefined: true,
              usage: [[30, 26, 8]],
              docs: 'The number of bridges that you want to create',
              source: 'user',
              type: [{ name: 'Int', display: 'Int', args: [], meta: {} }],
            },
          },
          self: {
            type: 'v',
            name: 'self',
            pos: [30, 9, 15],
            meta: {
              display: 'self',
              isDefined: true,
              docs: 'A reference to our object class',
              source: 'user',
              type: [
                { name: 'bridge_it', display: 'bridge_it', args: [], meta: {} },
              ],
              usage: [],
            },
          },
        },
      },
      pro: {},
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'fm',
        name: 'bridge_it::init',
        pos: [30, 9, 15],
        meta: {
          className: 'bridge_it',
          method: 'init',
          source: 'user',
          args: {
            nbridges: {
              docs: 'The number of bridges that you want to create',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Int', display: 'Int', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'nbridges',
              code: true,
              pos: [30, 26, 8],
            },
          },
          docs: "\n```idl\nresult = bridge_it.Init( nbridges, $\n [ INIT = strarr ], $\n [ MSG = String ], $\n [ LOGDIR = String ], $\n [ NREFRESH = Long ], $\n [ PREFIX = String ])\n```\n\nFunction which will initialize the bdige_it object and start all bridges. When bridges are initialized\nthey are done so in parallel, but whe function will not return until every bridge is idle again.\n\n#### Arguments\n\n- **nbridges**: in, required, Int\n\n  The number of bridges that you want to create\n\n\n#### Keywords\n\n- **INIT**: in, optional, strarr\n\n    Optional argument which allows you to pass in a string array of extra commands\n    to have each IDL_IDLBridge object execute upon creation.\n\n- **MSG**: in, optional, String\n\n    Optional argument to show the message prefix when a bridge process has completed for the TIME\n    keyword in bridge_it::run and bridge_it::run().\n\n- **LOGDIR**: in, optional, String\n\n    Specify the directory that the log file will be written to. The log file is just a text file with\n    all of the IDL Console output from each child process.\n\n- **NREFRESH**: in, optional, Long\n\n    Specify the number of bridge processes to execute before closing and re-starting the\n    child process. Necessary for some ENVI routines so that we don't have memory fragmentation\n    regarding opening lots of small rasters.\n\n- **PREFIX**: in, optional, String\n\n    This optional keyword specifies the prefix which is used to differentiate between arguments and\n    keywords when it comes time to parse the arguments and keyword that will be passed into a routine.\n\n\n### Author\n\nZachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)",
          docsLookup: {
            default:
              'Function which will initialize the bdige_it object and start all bridges. When bridges are initialized\nthey are done so in parallel, but whe function will not return until every bridge is idle again.',
            author:
              'Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)',
          },
          display: 'bridge_it::Init',
          kws: {
            init: {
              docs: 'Optional argument which allows you to pass in a string array of extra commands\nto have each IDL_IDLBridge object execute upon creation.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'strarr', display: 'strarr', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'INIT',
              code: true,
              pos: [30, 36, 4],
            },
            msg: {
              docs: 'Optional argument to show the message prefix when a bridge process has completed for the TIME\nkeyword in bridge_it::run and bridge_it::run().',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'MSG',
              code: true,
              pos: [30, 49, 3],
            },
            logdir: {
              docs: 'Specify the directory that the log file will be written to. The log file is just a text file with\nall of the IDL Console output from each child process.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'LOGDIR',
              code: true,
              pos: [30, 60, 6],
            },
            nrefresh: {
              docs: "Specify the number of bridge processes to execute before closing and re-starting the\nchild process. Necessary for some ENVI routines so that we don't have memory fragmentation\nregarding opening lots of small rasters.",
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'NREFRESH',
              code: true,
              pos: [30, 77, 8],
            },
            prefix: {
              docs: 'This optional keyword specifies the prefix which is used to differentiate between arguments and\nkeywords when it comes time to parse the arguments and keyword that will be passed into a routine.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'PREFIX',
              code: true,
              pos: [30, 98, 6],
            },
          },
          private: false,
          returns: [
            { name: 'bridge_it', display: 'bridge_it', args: [], meta: {} },
          ],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'bridge_it',
        pos: [30, 9, 15],
        meta: {
          source: 'user',
          args: {
            nbridges: {
              docs: 'The number of bridges that you want to create',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Int', display: 'Int', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'nbridges',
              code: true,
              pos: [30, 26, 8],
            },
          },
          docs: "\n```idl\nresult = bridge_it.Init( nbridges, $\n [ INIT = strarr ], $\n [ MSG = String ], $\n [ LOGDIR = String ], $\n [ NREFRESH = Long ], $\n [ PREFIX = String ])\n```\n\nFunction which will initialize the bdige_it object and start all bridges. When bridges are initialized\nthey are done so in parallel, but whe function will not return until every bridge is idle again.\n\n#### Arguments\n\n- **nbridges**: in, required, Int\n\n  The number of bridges that you want to create\n\n\n#### Keywords\n\n- **INIT**: in, optional, strarr\n\n    Optional argument which allows you to pass in a string array of extra commands\n    to have each IDL_IDLBridge object execute upon creation.\n\n- **MSG**: in, optional, String\n\n    Optional argument to show the message prefix when a bridge process has completed for the TIME\n    keyword in bridge_it::run and bridge_it::run().\n\n- **LOGDIR**: in, optional, String\n\n    Specify the directory that the log file will be written to. The log file is just a text file with\n    all of the IDL Console output from each child process.\n\n- **NREFRESH**: in, optional, Long\n\n    Specify the number of bridge processes to execute before closing and re-starting the\n    child process. Necessary for some ENVI routines so that we don't have memory fragmentation\n    regarding opening lots of small rasters.\n\n- **PREFIX**: in, optional, String\n\n    This optional keyword specifies the prefix which is used to differentiate between arguments and\n    keywords when it comes time to parse the arguments and keyword that will be passed into a routine.\n\n\n### Author\n\nZachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)",
          docsLookup: {
            default:
              'Function which will initialize the bdige_it object and start all bridges. When bridges are initialized\nthey are done so in parallel, but whe function will not return until every bridge is idle again.',
            author:
              'Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)',
          },
          display: 'bridge_it',
          kws: {
            init: {
              docs: 'Optional argument which allows you to pass in a string array of extra commands\nto have each IDL_IDLBridge object execute upon creation.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'strarr', display: 'strarr', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'INIT',
              code: true,
              pos: [30, 36, 4],
            },
            msg: {
              docs: 'Optional argument to show the message prefix when a bridge process has completed for the TIME\nkeyword in bridge_it::run and bridge_it::run().',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'MSG',
              code: true,
              pos: [30, 49, 3],
            },
            logdir: {
              docs: 'Specify the directory that the log file will be written to. The log file is just a text file with\nall of the IDL Console output from each child process.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'LOGDIR',
              code: true,
              pos: [30, 60, 6],
            },
            nrefresh: {
              docs: "Specify the number of bridge processes to execute before closing and re-starting the\nchild process. Necessary for some ENVI routines so that we don't have memory fragmentation\nregarding opening lots of small rasters.",
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'NREFRESH',
              code: true,
              pos: [30, 77, 8],
            },
            prefix: {
              docs: 'This optional keyword specifies the prefix which is used to differentiate between arguments and\nkeywords when it comes time to parse the arguments and keyword that will be passed into a routine.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'PREFIX',
              code: true,
              pos: [30, 98, 6],
            },
          },
          private: false,
          returns: [
            { name: 'bridge_it', display: 'bridge_it', args: [], meta: {} },
          ],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { 'bridge_it::init': ['idl2', 'hidden'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
