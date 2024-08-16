import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Format def files correctly`, () => {
  it(`[auto generated] procedures`, async () => {
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
      `;   Returns information from IDL about a specific scope level which`,
      `;   contains information about the call stack, variables, and IDL's prompt.`,
      `;`,
      `; :Arguments:`,
      `;   level: in, optional, Number`,
      `;     Specify the scope level to extract information for. The default`,
      `;     level is 0.`,
      `;`,
      `; :Keywords:`,
      `;   output: out, optional, String`,
      `;     Contains the results from querying a specific scope level`,
      `;`,
      `;-`,
      `pro vscode_getScopeInfo, level, output = output`,
      `  compile_opt idl2, hidden`,
      `  on_error, 2`,
      ``,
      `  ;+ is it though?`,
      `  meaningOfLife = 42`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true, type: 'def' }
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
        `;   Returns information from IDL about a specific scope level which`,
        `;   contains information about the call stack, variables, and IDL's prompt.`,
        `;`,
        `; :Arguments:`,
        `;   level: in, optional, Number`,
        `;     Specify the scope level to extract information for. The default`,
        `;     level is 0.`,
        `;`,
        `; :Keywords:`,
        `;   output: out, optional, String`,
        `;     Contains the results from querying a specific scope level`,
        `;`,
        `;-`,
        `pro vscode_getScopeInfo, level, output = output`,
        `  ; + is it though?`,
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

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] functions`, async () => {
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
      `;   Creates our message interceptor and registers it with ENVI (requires that ENVI is launched)`,
      `;`,
      `; :Returns: VsCodeENVIMessageInterceptor`,
      `;`,
      `; :Keywords:`,
      `;   verbose: in, optional, Boolean`,
      `;     If set, we print out all progress messages, otherwise we only print`,
      `;     the first one and not any child task messages.`,
      `;`,
      `;-`,
      `function VSCodeENVIMessageInterceptor::Init, verbose = verbose`,
      `  compile_opt idl2, hidden`,
      `  on_error, 2`,
      ``,
      `  ; get the current ENVI session`,
      `  e = envi(/current)`,
      ``,
      `  ; validate ENVI has started stop`,
      `  if (e eq !null) then message, 'ENVI has not started yet, required!', level = -1`,
      ``,
      `  ; init super`,
      `  if (~self.enviMessageHandler::init()) then begin`,
      `    return, 0`,
      `  endif`,
      ``,
      `  ; init properties`,
      `  self.stack = 0`,
      `  self.verbose = keyword_set(verbose)`,
      `  self.lastStart = list()`,
      `  self.lastProgress = list()`,
      ``,
      `  ; get the channel and subscribe`,
      `  oChannel = e.getBroadcastChannel()`,
      `  oChannel.subscribe, self`,
      ``,
      `  ; return 1 as valid object`,
      `  return, 1`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true, type: 'def' }
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
        `;   Creates our message interceptor and registers it with ENVI (requires that ENVI is launched)`,
        `;`,
        `; :Returns: VSCodeENVIMessageInterceptor`,
        `;`,
        `; :Keywords:`,
        `;   verbose: in, optional, Boolean`,
        `;     If set, we print out all progress messages, otherwise we only print`,
        `;     the first one and not any child task messages.`,
        `;`,
        `;-`,
        `function VSCodeENVIMessageInterceptor::Init, verbose = verbose`,
        `  ; get the current ENVI session`,
        ``,
        `  ; validate ENVI has started stop`,
        ``,
        `  ; init super`,
        ``,
        `  ; init properties`,
        ``,
        `  ; get the channel and subscribe`,
        ``,
        `  ; return 1 as valid object`,
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

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] structures`, async () => {
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
      `; :IDLNotebookImage_Base:`,
      `;   xSize: Number`,
      `;     The width of the PNG for display`,
      `;   ySize: Number`,
      `;     The height of the PNG for display`,
      `;`,
      `; :IDLNotebookImage_Png:`,
      `;   data: String`,
      `;     Base64 encoded PNG as a string`,
      `;`,
      `;-`,
      `pro IDLNotebookImage__define`,
      `  compile_opt idl2, hidden`,
      `  on_error, 2`,
      ``,
      `  ;+`,
      `  ; Base data structure for image`,
      `  ;-`,
      `  !null = {IDLNotebookImage_Base, $`,
      `    xSize: 0l, $`,
      `    ySize: 0l}`,
      ``,
      `  ;+`,
      `  ; Data structure for embedding an image`,
      `  ;-`,
      `  !null = {IDLNotebookImage_Png, $`,
      `    inherits IDLNotebookImage_Base, $`,
      `    data: 'base64'}`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true, type: 'def' }
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
        `; :IDLNotebookImage_Base:`,
        `;   xSize: Number`,
        `;     The width of the PNG for display`,
        `;   ySize: Number`,
        `;     The height of the PNG for display`,
        `;`,
        `; :IDLNotebookImage_Png:`,
        `;   data: String`,
        `;     Base64 encoded PNG as a string`,
        `;`,
        `;-`,
        `pro IDLNotebookImage__define`,
        `  ;+`,
        `  ; Base data structure for image`,
        `  ;-`,
        `  !null = {IDLNotebookImage_Base, $`,
        `    xSize: !null, $`,
        `    ySize: !null}`,
        ``,
        `  ;+`,
        `  ; Data structure for embedding an image`,
        `  ;-`,
        `  !null = {IDLNotebookImage_Png, $`,
        `    inherits IDLNotebookImage_Base, $`,
        `    data: !null}`,
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

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
