import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Method styling`, () => {
  it(`[auto generated] match`, async () => {
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
      `function myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `!null = self.myMethod()`,
      ``,
      `return, 1`,
      `end`,
      ``,
      `pro myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `self.myMethod`,
      `end`,
      ``,
      `pro auto_doc_example`,
      `compile_opt idl2`,
      ``,
      `p = IDLgrSurface()`,
      `!null = p.getFullIdentifier()`,
      `p.SETVERTEXATTRIBUTEDATA`,
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
      formatter: 'fiddle',
      style: { routineMethods: 'match' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  !null = self.MYMETHOD()`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  self.MYMETHOD`,
        `end`,
        ``,
        `pro auto_doc_example`,
        `  compile_opt idl2`,
        ``,
        `  p = IDLgrSurface()`,
        `  !null = p.getFullIdentifier()`,
        `  p.setVertexAttributeData`,
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

  it(`[auto generated] pascal`, async () => {
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
      `function myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `!null = self.myMethod()`,
      ``,
      `return, 1`,
      `end`,
      ``,
      `pro myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `self.myMethod`,
      `end`,
      ``,
      `pro auto_doc_example`,
      `compile_opt idl2`,
      ``,
      `p = IDLgrSurface()`,
      `!null = p.getFullIdentifier()`,
      `p.SETVERTEXATTRIBUTEDATA`,
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
      formatter: 'fiddle',
      style: { routineMethods: 'pascal' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  !null = self.Mymethod()`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  self.Mymethod`,
        `end`,
        ``,
        `pro auto_doc_example`,
        `  compile_opt idl2`,
        ``,
        `  p = IDLgrSurface()`,
        `  !null = p.GetFullIdentifier()`,
        `  p.SetVertexAttributeData`,
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

  it(`[auto generated] camel`, async () => {
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
      `function myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `!null = self.myMethod()`,
      ``,
      `return, 1`,
      `end`,
      ``,
      `pro myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `self.myMethod`,
      `end`,
      ``,
      `pro auto_doc_example`,
      `compile_opt idl2`,
      ``,
      `p = IDLgrSurface()`,
      `!null = p.getFullIdentifier()`,
      `p.SETVERTEXATTRIBUTEDATA`,
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
      formatter: 'fiddle',
      style: { routineMethods: 'camel' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  !null = self.mymethod()`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  self.mymethod`,
        `end`,
        ``,
        `pro auto_doc_example`,
        `  compile_opt idl2`,
        ``,
        `  p = IDLgrSurface()`,
        `  !null = p.getFullIdentifier()`,
        `  p.setVertexAttributeData`,
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

  it(`[auto generated] upper`, async () => {
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
      `function myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `!null = self.myMethod()`,
      ``,
      `return, 1`,
      `end`,
      ``,
      `pro myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `self.myMethod`,
      `end`,
      ``,
      `pro auto_doc_example`,
      `compile_opt idl2`,
      ``,
      `p = IDLgrSurface()`,
      `!null = p.getFullIdentifier()`,
      `p.SETVERTEXATTRIBUTEDATA`,
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
      formatter: 'fiddle',
      style: { routineMethods: 'upper' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  !null = self.MYMETHOD()`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  self.MYMETHOD`,
        `end`,
        ``,
        `pro auto_doc_example`,
        `  compile_opt idl2`,
        ``,
        `  p = IDLgrSurface()`,
        `  !null = p.GETFULLIDENTIFIER()`,
        `  p.SETVERTEXATTRIBUTEDATA`,
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

  it(`[auto generated] lower`, async () => {
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
      `function myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `!null = self.myMethod()`,
      ``,
      `return, 1`,
      `end`,
      ``,
      `pro myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `self.myMethod`,
      `end`,
      ``,
      `pro auto_doc_example`,
      `compile_opt idl2`,
      ``,
      `p = IDLgrSurface()`,
      `!null = p.getFullIdentifier()`,
      `p.SETVERTEXATTRIBUTEDATA`,
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
      formatter: 'fiddle',
      style: { routineMethods: 'lower' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  !null = self.mymethod()`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  self.mymethod`,
        `end`,
        ``,
        `pro auto_doc_example`,
        `  compile_opt idl2`,
        ``,
        `  p = IDLgrSurface()`,
        `  !null = p.getfullidentifier()`,
        `  p.setvertexattributedata`,
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

  it(`[auto generated] none`, async () => {
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
      `function myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `!null = self.myMethod()`,
      ``,
      `return, 1`,
      `end`,
      ``,
      `pro myclass::MYMETHOD`,
      `compile_opt idl2`,
      ``,
      `self.myMethod`,
      `end`,
      ``,
      `pro auto_doc_example`,
      `compile_opt idl2`,
      ``,
      `p = IDLgrSurface()`,
      `!null = p.getFullIdentifier()`,
      `p.SETVERTEXATTRIBUTEDATA`,
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
      formatter: 'fiddle',
      style: { routineMethods: 'none' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  !null = self.myMethod()`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro myclass::MYMETHOD`,
        `  compile_opt idl2`,
        ``,
        `  self.myMethod`,
        `end`,
        ``,
        `pro auto_doc_example`,
        `  compile_opt idl2`,
        ``,
        `  p = IDLgrSurface()`,
        `  !null = p.getFullIdentifier()`,
        `  p.SETVERTEXATTRIBUTEDATA`,
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
