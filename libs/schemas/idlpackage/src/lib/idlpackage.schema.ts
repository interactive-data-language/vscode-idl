import { z } from 'zod';

/**
 * Version range documentation for dependencies
 */
const VERSION_DOCS = `Basic Ranges

A basic range has the form ">1.2.3". This tells IDL to use the latest version that is after version "1.2.3".

Note: No spaces are allowed between the operator and the version number. Also, no spaces are allowed in the version string itself.

IPM supports the following operators:

- "=": equal (this is the default when no operator is supplied)
- ">": greater than
- "<": less than
- ">=": greater than or equal to
- "<=": less than or equal to

---

Combined Ranges

A space between two basic ranges means both ranges must be satisfied. To use range 1 OR range 2, use  "||" between two ranges.

- ">=1.2 <1.6" means any version greater than or equal to 1.2 but also less than 1.6.
- ">=1.5 || 1.3" means any version greater than or equal to 1.5, but also allow version 1.3

---

Major Ranges

The caret (^) comparison operator is for major level changes (i.e., the major version must be the same). This is useful when comparisons of versions as a major change is breaking.

- "^1.2.3" means any version greater than or equal to 1.2.3, but less than 2.0.0 (>=1.2.3 <2.0.0)

---

Minor Ranges

The tilde (~) comparison operator is for patch level ranges, i.e., both the major and minor versions must be the same.

- "~1.2.3" means any version greater than or equal to 1.2.3, but less than 1.3.0 (>=1.2.3 <1.3.0)`;

/**
 * Dependency of an IDL package
 */
export const IDLPackageDependencySchema = z
  .object({
    name: z
      .string()
      .meta({ title: 'Name' })
      .describe('Specify the name of the package to install as a dependency.')
      .default('MyAwesomeDependency'),
    version: z
      .string()
      .meta({ title: 'Version' })
      .describe(VERSION_DOCS)
      .default('1.0.0'),
    url: z
      .string()
      .meta({ title: 'URL' })
      .describe(
        'Specify the URL for the dependency. This should be the GitHub repository or ENVI and IDL Repository server that it can be found at',
      )
      .optional(),
  })
  .meta({ id: 'idlpackage-dependency' });

/**
 * Description of an IDL Package for the IDL Package Manager
 */
export const IDLPackageSchema = z
  .looseObject({
    name: z
      .string()
      .meta({ title: 'Name' })
      .describe('Specify the name of the package.')
      .default('MyAwesomePackage')
      .optional(),
    description: z
      .string()
      .meta({ title: 'Description' })
      .describe('A description of the package and what it does')
      .optional(),
    version: z
      .string()
      .meta({ title: 'Version' })
      .describe(
        'Specify the version of the package. Should be of the format "major.minor.patch" such as "1.0.0".',
      )
      .default('1.0.0')
      .optional(),
    author: z
      .string()
      .meta({ title: 'Author' })
      .describe('Specify the author of the package.')
      .optional(),
    date: z
      .string()
      .meta({ title: 'Date' })
      .describe(
        'Specify the date for package creation. Can be a specific date or a month. Human-readable is OK, no need for special formatting like ISO 8601.',
      )
      .optional(),
    tags: z
      .array(z.string())
      .meta({ title: 'Tags' })
      .describe('Specify any tags associated with the package.')
      .optional(),
    dependencies: z
      .array(IDLPackageDependencySchema)
      .meta({ title: 'Dependencies' })
      .describe('Dependencies of the IDL Package.')
      .optional(),
    declarations: z
      .object({
        agent_instructions: z
          .array(z.string())
          .describe('Relative paths to *.instructions.md files for agents')
          .optional(),
        agent_skills: z
          .array(z.string())
          .describe(
            'Relative paths to directories that include a SKILL.md file. Each folder should match the agentskills.io spec, with one change: everything needs to be in a single file right now',
          )
          .optional(),
        envi_extensions: z
          .array(z.string())
          .describe(
            'Relative paths to .pro files for ENVI Extensions. On publish, these are updated to be .sav files if code is compiled',
          )
          .optional(),
        envi_tasks: z
          .array(z.string())
          .describe('Relative paths to .task files for ENVI Tasks.')
          .optional(),
        envi_tool_workflows: z
          .array(z.string())
          .describe('Relative paths to .md files for ENVI Tool Workflows.')
          .optional(),
      })
      .optional(),
  })
  .describe('Description of an IDL Package for the IDL Package Manager.');

/**
 * Type for an IDL package file
 */
export type IIDLPackage = z.infer<typeof IDLPackageSchema>;
