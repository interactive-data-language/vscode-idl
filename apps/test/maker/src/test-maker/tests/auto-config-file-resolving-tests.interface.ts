import type { IConfigTests } from '../tests.interface';

/**
 * Automated tests to make sure we can properly resolve our configuration
 * files within nested sub-folders.
 *
 * These config files are the "idlformat.json" files (or the legacy "idl.json")
 * with style and other controls
 * that are used in lieu of VSCode's settings.
 */
export const AUTO_CONFIG_FILE_RESOLVING: IConfigTests[] = [
  {
    suiteName: `Correctly identify parses and returns config files`,
    fileName: `resolution.spec.ts`,
    tests: [
      {
        name: 'based on their folders',
        workspace: 'apps/test/idl/configs',
        actions: [
          {
            action: 'add',
            file: 'subdir1/idlformat.json',
          },
          {
            action: 'add',
            file: 'subdir2/idlformat.json',
          },
          {
            action: 'add',
            file: 'subdir3/idl.json',
          },
          {
            action: 'get',
            file: 'subdir1/idl.pro',
          },
          {
            action: 'get',
            file: 'subdir2/idl.pro',
          },
          {
            action: 'get',
            file: 'subdir3/idl.pro',
          },
        ],
      },
    ],
  },
  {
    suiteName: `Prefer idlformat.json over legacy idl.json`,
    fileName: `precedence.spec.ts`,
    tests: [
      {
        name: 'when the legacy file is indexed first',
        workspace: 'apps/test/idl/configs',
        actions: [
          {
            action: 'add',
            file: 'subdir5/idl.json',
          },
          {
            action: 'add',
            file: 'subdir5/idlformat.json',
          },
          {
            action: 'get',
            file: 'subdir5/idl.pro',
          },
        ],
      },
      {
        name: 'when the legacy file is indexed last',
        workspace: 'apps/test/idl/configs',
        actions: [
          {
            action: 'add',
            file: 'subdir5/idlformat.json',
          },
          {
            action: 'add',
            file: 'subdir5/idl.json',
          },
          {
            action: 'get',
            file: 'subdir5/idl.pro',
          },
        ],
      },
    ],
  },
  {
    suiteName: `Parse invalid config files`,
    fileName: `bad-file.spec.ts`,
    tests: [
      {
        name: 'and load default config for bad file',
        workspace: 'apps/test/idl/configs',
        actions: [
          {
            action: 'add',
            file: 'subdir4/idlformat.json',
          },
          {
            action: 'get',
            file: 'subdir4/idl.pro',
          },
        ],
      },
    ],
  },
];
