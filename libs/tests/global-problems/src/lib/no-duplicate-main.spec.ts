import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { SanitizeAllProblems } from '@idl/tests/helpers';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly ignore main level programs as duplicates`, () => {
  it(`[auto generated] with multiple files in the same workspace`, async () => {
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
      'idl/test/global-main-problems/file1.pro'
    );

    // add file to index
    await index.indexFile(filepath_0);

    // define expected problems
    const problems_0: { [key: string]: SyntaxProblems } = {};

    // verify results
    expect(problems_0).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-main-problems'
      )
    );

    // specify filepath
    const filepath_1 = GetExtensionPath(
      'idl/test/global-main-problems/file2.pro'
    );

    // add file to index
    await index.indexFile(filepath_1);

    // define expected problems
    const problems_1: { [key: string]: SyntaxProblems } = {};

    // verify results
    expect(problems_1).toEqual(
      SanitizeAllProblems(
        index.getGlobalTokenSyntaxProblems(),
        'idl/test/global-main-problems'
      )
    );
  });
});
