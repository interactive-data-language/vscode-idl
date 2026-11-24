import { z } from 'zod';

/**
 * Which source files are measured by code coverage
 */
export const IDLTestSourceSchema = z
  .object({
    include: z
      .array(z.string())
      .meta({ title: 'Include' })
      .describe(
        'Glob patterns for source files that are measured by code coverage',
      )
      .default(['src/**/*.pro'])
      .optional(),
    exclude: z
      .array(z.string())
      .meta({ title: 'Exclude' })
      .describe(
        'Glob patterns for files to exclude from the source files used for code coverage',
      )
      .default(['**/*.spec.pro'])
      .optional(),
  })
  .meta({ id: 'idltest-source' });

/**
 * Controls how tests are run
 */
export const IDLTestRunSchema = z
  .object({
    isolation: z
      .enum(['process', 'shared'])
      .meta({ title: 'Isolation' })
      .describe(
        'How tests are isolated from each other. "process" runs tests in separate IDL processes and "shared" runs all tests in the same IDL session.',
      )
      .default('process')
      .optional(),
    stopOnFailure: z
      .boolean()
      .meta({ title: 'Stop on failure' })
      .describe('Stop running tests after the first failure')
      .default(false)
      .optional(),
  })
  .meta({ id: 'idltest-run' });

/**
 * Controls code coverage
 */
export const IDLTestCoverageSchema = z
  .object({
    enabled: z
      .boolean()
      .meta({ title: 'Enabled' })
      .describe('Collect code coverage while running tests')
      .default(true)
      .optional(),
    profile: z
      .boolean()
      .meta({ title: 'Profile' })
      .describe('Profile code while running tests')
      .default(false)
      .optional(),
  })
  .meta({ id: 'idltest-coverage' });

/**
 * Controls test output
 */
export const IDLTestOutputSchema = z
  .object({
    level: z
      .enum(['quiet', 'normal', 'verbose'])
      .meta({ title: 'Level' })
      .describe('How much information is reported while running tests')
      .default('normal')
      .optional(),
    log: z
      .string()
      .meta({ title: 'Log' })
      .describe('Path to the log file for test output')
      .default('idltest.log')
      .optional(),
  })
  .meta({ id: 'idltest-output' });

/**
 * Configuration for running tests for an IDL project
 */
export const IDLTestSchema = z
  .looseObject({
    include: z
      .array(z.string())
      .meta({ title: 'Include' })
      .describe('Glob patterns for the test files to run')
      .default(['src/**/*.spec.pro'])
      .optional(),
    exclude: z
      .array(z.string())
      .meta({ title: 'Exclude' })
      .describe('Glob patterns for test files to skip')
      .default([])
      .optional(),
    source: IDLTestSourceSchema.optional(),
    run: IDLTestRunSchema.optional(),
    coverage: IDLTestCoverageSchema.optional(),
    output: IDLTestOutputSchema.optional(),
    debug: z
      .boolean()
      .meta({ title: 'Debug' })
      .describe('Enable debug output from the test runner')
      .default(false)
      .optional(),
  })
  .meta({ id: 'idltest', title: 'IDL Test Configuration' });

/**
 * Type for an `idltest.json` file
 */
export type IIDLTest = z.input<typeof IDLTestSchema>;

/**
 * Default `idltest.json` contents
 */
export const DEFAULT_IDL_TEST: IIDLTest = {
  include: ['src/**/*.spec.pro'],
  exclude: [],
  source: { include: ['src/**/*.pro'], exclude: ['**/*.spec.pro'] },
  run: { isolation: 'process', stopOnFailure: false },
  coverage: { enabled: true, profile: false },
  output: { level: 'normal', log: 'idltest.log' },
  debug: false,
};
