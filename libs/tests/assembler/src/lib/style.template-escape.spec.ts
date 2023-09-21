import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify auto-fix/format of template escape characters`, () => {
  it(`[auto generated]  only changes the last line with modern`, async () => {
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
      `compile_opt idl2`,
      `a = \`\\\`\``,
      `a = \`\\$\``,
      `a = \`\\\\\``,
      `a = \`\\b\``,
      `a = \`\\f\``,
      `a = \`\\n\``,
      `a = \`\\r\``,
      `a = \`\\t\``,
      `a = \`\\v\``,
      `a = \`\\x00 \\XaF\``,
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
      style: { hex: 'lower' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `a = \`\\\`\``,
        `a = \`\\$\``,
        `a = \`\\\\\``,
        `a = \`\\b\``,
        `a = \`\\f\``,
        `a = \`\\n\``,
        `a = \`\\r\``,
        `a = \`\\t\``,
        `a = \`\\v\``,
        `a = \`\\x00 \\xaf\``,
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
        code: 70,
        info: 'Illegal formatting for hex escape character. Should be of the form "\\xXX" and must start with "\\x"',
        start: [10, 10, 4],
        end: [10, 10, 4],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated]  only changes the last line with dated`, async () => {
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
      `compile_opt idl2`,
      `a = \`\\\`\``,
      `a = \`\\$\``,
      `a = \`\\\\\``,
      `a = \`\\b\``,
      `a = \`\\f\``,
      `a = \`\\n\``,
      `a = \`\\r\``,
      `a = \`\\t\``,
      `a = \`\\v\``,
      `a = \`\\x00 \\XaF\``,
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
      style: { hex: 'upper' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `a = \`\\\`\``,
        `a = \`\\$\``,
        `a = \`\\\\\``,
        `a = \`\\b\``,
        `a = \`\\f\``,
        `a = \`\\n\``,
        `a = \`\\r\``,
        `a = \`\\t\``,
        `a = \`\\v\``,
        `a = \`\\x00 \\xAF\``,
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
        code: 70,
        info: 'Illegal formatting for hex escape character. Should be of the form "\\xXX" and must start with "\\x"',
        start: [10, 10, 4],
        end: [10, 10, 4],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated]  only changes the last line with none`, async () => {
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
      `compile_opt idl2`,
      `a = \`\\\`\``,
      `a = \`\\$\``,
      `a = \`\\\\\``,
      `a = \`\\b\``,
      `a = \`\\f\``,
      `a = \`\\n\``,
      `a = \`\\r\``,
      `a = \`\\t\``,
      `a = \`\\v\``,
      `a = \`\\x00 \\XaF\``,
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
      style: { hex: 'none' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `a = \`\\\`\``,
        `a = \`\\$\``,
        `a = \`\\\\\``,
        `a = \`\\b\``,
        `a = \`\\f\``,
        `a = \`\\n\``,
        `a = \`\\r\``,
        `a = \`\\t\``,
        `a = \`\\v\``,
        `a = \`\\x00 \\xaF\``,
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
        code: 70,
        info: 'Illegal formatting for hex escape character. Should be of the form "\\xXX" and must start with "\\x"',
        start: [10, 10, 4],
        end: [10, 10, 4],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
