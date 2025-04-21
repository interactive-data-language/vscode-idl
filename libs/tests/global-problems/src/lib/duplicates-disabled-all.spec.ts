import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SanitizeAllProblems } from '@idl/tests/helpers';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] track that global problems should not be reported`, () => {
  it(`[auto generated] while adding files`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath_0 = GetExtensionPath(
      'idl/test/global-problems/disabled/file1_all.pro'
    );

    // add file to index
    await index.indexFile(filepath_0);

    // define expected problems
    const problems_0: { [key: string]: SyntaxProblems } = {};

    // verify results
    expect(problems_0).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-problems/disabled'
      )
    );

    // specify filepath
    const filepath_1 = GetExtensionPath(
      'idl/test/global-problems/disabled/file2_all.pro'
    );

    // add file to index
    await index.indexFile(filepath_1);

    // define expected problems
    const problems_1: { [key: string]: SyntaxProblems } = {
      'idl/test/global-problems/disabled/file1_all.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [21, 4, 15],
          end: [21, 4, 15],
          canReport: false,
          file: 'idl/test/global-problems/disabled/file1_all.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [16, 9, 16],
          end: [16, 9, 16],
          canReport: false,
          file: 'idl/test/global-problems/disabled/file1_all.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [11, 4, 16],
          end: [11, 4, 16],
          canReport: false,
          file: 'idl/test/global-problems/disabled/file1_all.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [6, 9, 6],
          end: [6, 9, 6],
          canReport: false,
          file: 'idl/test/global-problems/disabled/file1_all.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [2, 4, 5],
          end: [2, 4, 5],
          canReport: false,
          file: 'idl/test/global-problems/disabled/file1_all.pro',
        },
      ],
      'idl/test/global-problems/disabled/file2_all.pro': [
        {
          code: 23,
          info: 'Duplicate procedure definition: "myclass__define"',
          start: [19, 4, 15],
          end: [19, 4, 15],
          canReport: true,
          file: 'idl/test/global-problems/disabled/file2_all.pro',
        },
        {
          code: 26,
          info: 'Duplicate function method definition: "myclass::method1"',
          start: [14, 9, 16],
          end: [14, 9, 16],
          canReport: true,
          file: 'idl/test/global-problems/disabled/file2_all.pro',
        },
        {
          code: 25,
          info: 'Duplicate procedure method definition: "myclass::method1"',
          start: [9, 4, 16],
          end: [9, 4, 16],
          canReport: true,
          file: 'idl/test/global-problems/disabled/file2_all.pro',
        },
        {
          code: 24,
          info: 'Duplicate function definition: "myfunc"',
          start: [4, 9, 6],
          end: [4, 9, 6],
          canReport: true,
          file: 'idl/test/global-problems/disabled/file2_all.pro',
        },
        {
          code: 23,
          info: 'Duplicate procedure definition: "mypro"',
          start: [0, 4, 5],
          end: [0, 4, 5],
          canReport: true,
          file: 'idl/test/global-problems/disabled/file2_all.pro',
        },
      ],
    };

    // verify results
    expect(problems_1).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-problems/disabled'
      )
    );
  });
});
