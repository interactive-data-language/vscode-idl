import { z } from 'zod';

/**
 * Options for how code is formatted
 */
export const IDLConfigStyleSchema = z
  .strictObject({
    quotes: z
      .enum(['single', 'double', 'none'])
      .meta({
        title: 'Quote Formatting',
        description:
          'For string literals what type of quote we use. Includes numbers defined using quotes.',
        default: 'single',
      })
      .optional(),
    methods: z
      .enum(['dot', 'arrow', 'none'])
      .meta({
        title: 'Method Formatting',
        description: 'Do we use a dot or arrow for method invocation',
        default: 'dot',
      })
      .optional(),
    keywords: z
      .enum(['lower', 'upper', 'none'])
      .meta({
        title: 'Keyword Formatting',
        description: 'Formatting for keywords, includes binary keywords',
        default: 'lower',
      })
      .optional(),
    properties: z
      .enum(['lower', 'upper', 'match', 'camel', 'pascal', 'none'])
      .meta({
        title: 'Property Formatting',
        description: 'Controls the case style of properties',
        default: 'camel',
      })
      .optional(),
    control: z
      .enum(['lower', 'upper', 'none'])
      .meta({
        title: 'Control Formatting',
        description:
          'How are control statements, such as "for", "if", "pro", formatted',
        default: 'lower',
      })
      .optional(),
    numbers: z
      .enum(['lower', 'upper', 'none'])
      .meta({
        title: 'Number Formatting',
        description:
          'Controls accents to letters that set the data type and their case',
        default: 'lower',
      })
      .optional(),
    hex: z
      .enum(['lower', 'upper', 'none'])
      .meta({
        title: 'Hex Number Formatting',
        description:
          'Indicates formatting for hexadecimal (hex) numbers (either defined with quotes or "0x")',
        default: 'lower',
      })
      .optional(),
    octal: z
      .enum(['lower', 'upper', 'none'])
      .meta({
        title: 'Octal Number Formatting',
        description:
          'Indicates formatting for octal numbers (either defined with quotes or "0o")',
        default: 'lower',
      })
      .optional(),
    binary: z
      .enum(['lower', 'upper', 'none'])
      .meta({
        title: 'Binary Number Formatting',
        description:
          'Indicates formatting for binary numbers (either defined with quotes or "0b")',
        default: 'lower',
      })
      .optional(),
    routines: z
      .enum(['match', 'camel', 'pascal', 'none'])
      .meta({
        title: 'Routine Formatting',
        description:
          'When we encounter a known routine (functions and procedures), how do we format it with respect to the definition',
        default: 'match',
      })
      .optional(),
    routineMethods: z
      .enum(['match', 'camel', 'pascal', 'none'])
      .meta({
        title: 'Routine Method Formatting',
        description:
          'When we encounter a known routine method (function methods and procedure methods), how do we format it with respect to the definition?',
        default: 'camel',
      })
      .optional(),
    systemVariables: z
      .enum(['lower', 'upper', 'none'])
      .meta({
        title: 'System Variable Formatting',
        description: 'Case formatting for system variables',
        default: 'lower',
      })
      .optional(),
    structureNames: z
      .enum(['match', 'camel', 'pascal', 'none'])
      .meta({
        title: 'Structure Name Formatting',
        description:
          'When we have a known named structure, how do we format the name?',
        default: 'pascal',
      })
      .optional(),
    localVariables: z
      .enum(['match', 'none'])
      .meta({
        title: 'Local Variable Formatting',
        description:
          'If local variables match the case for the first instance that we find',
        default: 'match',
      })
      .optional(),
  })
  .describe(
    'This controls how code is automatically formatted when using the buttons in the sidebar or formatting on save.',
  )
  .meta({ id: '1.0.0-options' });

/**
 * Schema for the "idlformat.json" file that controls code formatting
 */
export const IDLConfigSchema = z
  .looseObject({
    formatter: z
      .enum(['fiddle'])
      .meta({
        title: 'Formatter',
        description: 'Specify the formatting ruleset for your code.',
        default: 'fiddle',
      })
      .optional(),
    eol: z
      .enum(['lf', 'crlf'])
      .meta({
        title: 'End-of-line',
        description:
          'Indicate whether we use the new line character ("lf", recommended) or Windows-style carriage-return-new-line ("crlf").',
        default: 'lf',
      })
      .optional(),
    tabWidth: z
      .number()
      .meta({
        title: 'Tab Width',
        description: 'Number of spaces to use for indentation.',
        default: 2,
      })
      .optional(),
    hangingIndent: z
      .boolean()
      .meta({
        title: 'Hanging Indent',
        description:
          'Do we use hanging indentation for multi-line statements?\n\nFor multi-line statements this means that the first line begins at the standard indentation level and all subsequent lines are indented further to align with a syntactic element (e.g., after an opening parenthesis), rather than using a uniform block indent.\n\nThis affect routine names, function calls, procedure calls, arrays, structures, and parentheses.',
        default: false,
      })
      .optional(),
    autoDoc: z
      .boolean()
      .meta({
        title: 'AutoDoc',
        description:
          "Automatically creates and updates IDL Doc style comments for routines on each save. You can freely use this if you don't have docs for your code. If you have docs, and they don't follow IDL Doc style, they are preserved.",
        default: false,
      })
      .optional(),
    autoFix: z
      .boolean()
      .meta({
        title: 'Auto-fix Problems',
        description:
          'If a problem can be automatically fixed, fix it prior to formatting. This does not apply to all problems detected by IDL.',
        default: true,
      })
      .optional(),
    styleAndFormat: z
      .boolean()
      .meta({
        title: 'No Style or Formatting',
        description:
          'When we process our code, do we apply our styles and format?\n\nIf this is set to `false` and `autoDoc` is enabled, then we add documentation to your code without changing anything else.',
        default: true,
      })
      .optional(),
    maxIndent: z
      .number()
      .meta({
        title: 'Max Indent',
        description:
          'Maximum indent size (number of spaces) that we will insert when auto-indenting your code during formatting',
        default: 30,
      })
      .optional(),
    style: IDLConfigStyleSchema.optional(),
  })
  .describe('Top-level preferences for how code gets formatted.');

/**
 * Type for the "idlformat.json" file
 */
export type IIDLConfig = z.infer<typeof IDLConfigSchema>;
