import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Generate structure docs`, () => {
  it(`[auto generated] to automatically add them`, async () => {
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
      `pro pro4__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1, prop2: 4}`,
      ``,
      `  !null = {mystruct2, inherits IDL_object, prop: 1, prop2: 4}`,
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
        `; :MyStruct:`,
        `;   prop: any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   prop2: any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `; :mystruct2:`,
        `;   prop: any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   prop2: any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `pro pro4__define`,
        `  compile_opt idl2`,
        ``,
        `  !null = {MyStruct, inherits IDL_Object, prop: 1, prop2: 4}`,
        ``,
        `  !null = {Mystruct2, inherits IDL_Object, prop: 1, prop2: 4}`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] to do nothing without a class/structure definition routine`, async () => {
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
      `pro pro4`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1, prop2: 4}`,
      ``,
      `  !null = {mystruct2, inherits IDL_object, prop: 1, prop2: 4}`,
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
        `;-`,
        `pro pro4`,
        `  compile_opt idl2`,
        ``,
        `  !null = {MyStruct, inherits IDL_Object, prop: 1, prop2: 4}`,
        ``,
        `  !null = {Mystruct2, inherits IDL_Object, prop: 1, prop2: 4}`,
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
        code: 77,
        info: 'No matching structure/object/class definition for structure named "MyStruct"',
        start: [5, 11, 8],
        end: [5, 11, 8],
      },
      {
        code: 77,
        info: 'No matching structure/object/class definition for structure named "mystruct2"',
        start: [7, 11, 9],
        end: [7, 11, 9],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] add missing properties and sort alphabetically with bad at the end`, async () => {
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
      `;   propFake: any`,
      `;     Placeholder docs for argument or keyword`,
      `;   prop2: any`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro pro4__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1, prop2: 4}`,
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
        `; :MyStruct:`,
        `;   prop: any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   prop2: any`,
        `;     Placeholder docs for argument or keyword`,
        `;   propFake: any`,
        `;     Placeholder docs for argument or keyword`,
        `;`,
        `;-`,
        `pro pro4__define`,
        `  compile_opt idl2`,
        ``,
        `  !null = {MyStruct, inherits IDL_Object, prop: 1, prop2: 4}`,
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
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "propfake"',
        start: [2, 0, 17],
        end: [2, 0, 17],
      },
      {
        code: 80,
        info: 'Property is missing from documentation: "prop"',
        start: [13, 42, 5],
        end: [13, 42, 5],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] with no properties`, async () => {
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
      `pro pro4__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct}`,
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
        `; :MyStruct:`,
        `;`,
        `;-`,
        `pro pro4__define`,
        `  compile_opt idl2`,
        ``,
        `  !null = {MyStruct}`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
