import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Basic checks for call_procedure hover help`, () => {
  it(`[auto generated] for function`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/call_procedure.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 7 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/PRINT.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22p%22,%22name%22:%22print%22%7D)',
      '',
      '```idl',
      'print, expressioni, $',
      '  am_pm = value, $',
      '  days_of_week = value, $',
      '  format = value, $',
      '  /implied_print, $',
      '  months = value, $',
      '  /stdio_non_finite, $',
      '  days_of_the_week = value',
      '```',
      '',
      'The two PRINT procedures perform formatted output. PRINT performs output to the standard output stream (IDL file unit -1), while PRINTF requires a file unit to be explicitly specified.',
      '',
      '_Note:_ IDL uses the standard I/O function `sprintf` to do its formatting. Different platforms implement this function in different ways, which may lead to slight inconsistencies in the appearance of the output. In most cases, specifying an explicit output format via the FORMAT keyword allows better control over the appearance than using the default formatting.',
      '',
      '### Format Compatibility',
      '',
      'If the FORMAT keyword is not present and PRINT is called with more than one argument, and the first argument is a scalar string starting with the characters “$(”, this initial argument is taken to be the format specification, just as if it had been specified via the FORMAT keyword. This feature is maintained for compatibility with version 1 of VMS IDL.',
      '',
      '',
      '#### Arguments',
      '',
      '- **expressioni**: in, optional, any',
      '',
      '  The expressions to be output.',
      '  ',
      '  _Note:_ Normally, providing an object reference as an argument to PRINT or PRINTF prints information about the object heap variable referred to by the object reference. If the argument is an instance of an object class that overloads the IDL\\_Object::\\_overloadPrint method, the value returned by that method will be printed. See [IDL\\_Object](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Object%20Classes/Miscellaneous/IDL%255FObject.htm%22%7D) for details.',
      '',
      '',
      '',
      '#### Keywords',
      '',
      '- **am_pm**: in, optional, Array<String>',
      '',
      '    Supplies a string array of 2 names to be used for the names of the AM and PM string when processing explicitly formatted dates (CAPA, CApA, and CapA format codes) with the FORMAT keyword.',
      '',
      '- **days_of_week**: bidirectional, optional, any',
      '',
      '    Supplies a string array of 7 names to be used for the names of the days of the week when processing explicitly formatted dates (CDWA, CDwA, and CdwA format codes) with the FORMAT keyword.',
      '',
      '- **format**: in, optional, String',
      '',
      '    If FORMAT is not specified, IDL uses its default rules for formatting the output. FORMAT allows the format of the output to be specified in precise detail, using a FORTRAN-style specification. See [Using Formatted Input/Output](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Creating%20IDL%20Programs/Components%20of%20the%20IDL%20Language/Using%255FExplicitly%255FFormatt.htm%22%7D).',
      '',
      '- **implied_print**: in, optional, Boolean',
      '',
      '    Set this keyword to format the output using the same formatting rules as [Implied Print](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Creating%20IDL%20Programs/Components%20of%20the%20IDL%20Language/ImpliedPrint.htm%22%7D).',
      '',
      '- **months**: in, optional, Array<String>',
      '',
      '    Supplies a string array of 12 names to be used for the names of the months when processing explicitly formatted dates (CMOA, CMoA, and CmoA format codes) with the FORMAT keyword.',
      '',
      '- **stdio_non_finite**: in, optional, Boolean',
      '',
      '    Set this keyword to allow the writing of data files readable by C or FORTRAN programs on a given platform; it is otherwise unnecessary.The various systems supported by IDL differ widely in the representation used for non-finite floating point values (i.e., NaN and Infinity). Consider that the following are all possible representations for NaN on at least one IDL platform:',
      '    ',
      '    ```idl',
      '      NaN, NanQ, ? .0000, nan0x2, nan0x7, 1. # QNAN, -1. # IND0.',
      '    ```',
      '    ',
      '    And the following are considered to be Infinity:',
      '    ',
      '    ```idl',
      '    Inf, Infinity, ++.0000, ----.0000, 1.#INF',
      '    ',
      '    ```',
      '    ',
      '    On input, IDL can recognize any of these, but on output, it uses the same standard representation on all platforms. This promotes cross-platform consistency. To cause IDL to use the system C library `sprintf()` function to format such values, yielding the native representation for that platform, set the STDIO\\_NON\\_FINITE keyword. ',
      '',
      '- **days_of_the_week**: in, optional, Array<String>',
      '',
      '    ',
      '',
      '',
      '',
      '### Examples',
      '',
      'To print the string “IDL is fun.” enter the command:',
      '',
      '```idl',
      "  print, 'IDL is fun.'",
      '```',
      '',
      'To print the same message to the open file associated with file unit number 2, use the command:',
      '',
      '```idl',
      "  printf, 2, 'IDL is fun.'",
      '```',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );
  });

  it(`[auto generated] for keywords`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/call_procedure.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 29 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type am_pm = Array<String>',
      '```',
      '',
      'Supplies a string array of 2 names to be used for the names of the AM and PM string when processing explicitly formatted dates (CAPA, CApA, and CapA format codes) with the FORMAT keyword.',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
