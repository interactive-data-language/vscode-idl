import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly exclude keywords`, () => {
  it(`[auto generated] for these cases`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/auto-complete/keywords.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 22, character: 12 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'dim',
        insertText: 'dim',
        kind: 5,
        sortText: '30',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An array giving the dimensions (0 for scalars).',
        },
      },
      {
        label: 'length',
        insertText: 'length',
        kind: 5,
        sortText: '30',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'The number of elements in the variable.',
        },
      },
      {
        label: 'ndim',
        insertText: 'ndim',
        kind: 5,
        sortText: '30',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An integer giving the number of dimensions (0 for scalars).',
        },
      },
      {
        label: 'tname',
        insertText: 'tname',
        kind: 5,
        sortText: '30',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value:
            'A string giving the raw IDL type name. For structures this returns "STRUCT", while for objects this returns "OBJREF".',
        },
      },
      {
        label: 'typecode',
        insertText: 'typecode',
        kind: 5,
        sortText: '30',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An integer giving the IDL type code.',
        },
      },
      {
        label: 'typename',
        insertText: 'typename',
        kind: 5,
        sortText: '30',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value:
            'A string giving the IDL type name. For structures and objects this returns the actual structure or class name.',
        },
      },
      {
        label: 'IDL_Integer::bitGet()',
        insertText: 'bitGet()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Integer::bitLength()',
        insertText: 'bitLength()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Integer::bitSet()',
        insertText: 'bitSet()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Integer::bitShift()',
        insertText: 'bitShift()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Integer::toASCII()',
        insertText: 'toAscii()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Integer::toBinary()',
        insertText: 'toBinary()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Integer::toHex()',
        insertText: 'toHex()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Integer::toOctal()',
        insertText: 'toOctal()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::ceil()',
        insertText: 'ceil()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::floor()',
        insertText: 'floor()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::imaginary()',
        insertText: 'imaginary()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::max()',
        insertText: 'max()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::mean()',
        insertText: 'mean()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::median()',
        insertText: 'median()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::min()',
        insertText: 'min()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::product()',
        insertText: 'product()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::real()',
        insertText: 'real()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::round()',
        insertText: 'round()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::signum()',
        insertText: 'signum()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::total()',
        insertText: 'total()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::compare()',
        insertText: 'compare()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::convert()',
        insertText: 'convert()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::diff()',
        insertText: 'diff()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::dup()',
        insertText: 'dup()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::equals()',
        insertText: 'equals()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::filter()',
        insertText: 'filter()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::finite()',
        insertText: 'finite()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::fromBits()',
        insertText: 'fromBits()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::hashcode()',
        insertText: 'hashcode()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::hasValue()',
        insertText: 'hasValue()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isFinite()',
        insertText: 'isFinite()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isInfinite()',
        insertText: 'isInfinite()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isNaN()',
        insertText: 'isNaN()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isReal()',
        insertText: 'isReal()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::map()',
        insertText: 'map()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::nestedMap()',
        insertText: 'nestedMap()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::ptrValid()',
        insertText: 'ptrValid()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::reduce()',
        insertText: 'reduce()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::reform()',
        insertText: 'reform()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::shift()',
        insertText: 'shift()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::sort()',
        insertText: 'sort()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::toBits()',
        insertText: 'toBits()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::toDouble()',
        insertText: 'toDouble()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::toInteger()',
        insertText: 'toInteger()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0,
        )
      ).slice(0, 50),
    );
    // define position
    const position_1: Position = { line: 23, character: 11 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: '_extra = ',
        insertText: '_extra = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'Support for additional keywords',
        },
      },
      {
        label: 'breakpoints = ',
        insertText: '/breakpoints',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display the breakpoint table which shows the program module and location for each breakpoint.',
        },
      },
      {
        label: 'brief = ',
        insertText: 'brief = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'If set in conjunction with one of the following keywords, BRIEF produces very terse summary style output instead of the output normally displayed by those keywords:\n\n| DLM HEAP\\_VARIABLES LAMBDA MESSAGES OBJECTS | PREFERENCES ROUTINES SOURCE\\_FILES STRUCTURES SYSTEM\\_VARIABLES |\n| ------------------------------------------- | --------------------------------------------------------------- |',
        },
      },
      {
        label: 'device = ',
        insertText: '/device',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to show information about the currently selected graphics device. This information is dependent on the abilities of the current device, but the name of the device is always given. Arguments to HELP are ignored when DEVICE is specified.',
        },
      },
      {
        label: 'dlm = ',
        insertText: '/dlm',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display all known dynamically loadable modules and their state (loaded or not loaded).',
        },
      },
      {
        label: 'files = ',
        insertText: '/files',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display information about file units. If no arguments are supplied in the call to HELP, information on all open file units (except the special units 0, -1, and -2) is displayed. If arguments are provided, they are taken to be integer file unit numbers, and information on the specified file units is given.\n\nFor example, the command:\n\n```idl\n  help, /files, -2, -1, 0\n```\n\ngives information below about the default file units:\n\n```idl\nUnit Attributes Name\n-2   Write, Truncate, Tty, Reserved   \n-1   Write, Truncate, Tty, Reserved   \n0   Read, Tty, Reserved              \n\n```\n\nThe attributes column tells about the characteristics of the file. For instance, the file connected to logical file unit 2 is called “stderr” and is the standard error file. It is opened for write access (Write), is a new file (Truncate), is a terminal (Tty), and cannot be closed by the CLOSE command (Reserved).',
        },
      },
      {
        label: 'full = ',
        insertText: 'full = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'By default, HELP filters its output in an attempt to display only the information likely to be of use to the IDL user. The filtering applied depends on the type of information being requested. By default:\n\n* **Function Keys:** Under UNIX, undefined function keys are not displayed. Under Windows, all function keys are displayed.\n* **Structure Definitions and Objects:** Built-in IDL structure definitions (widget event structures, for example) are not displayed if they have not yet been used in the current IDL session. Structures and objects that have had their definition hidden using the STRUCT\\_HIDE procedure are not displayed.\n* **Pointers and Object References:** The reference count for heap variables is displayed.\n* **Functions and Procedures:** Functions and procedures compiled with the `COMPILE_OPT HIDDEN` directive are not displayed.\n* **Floating-point Values:** By default, for floating-point inputs (FLOAT, DOUBLE, COMPLEX, DOUBLE COMPLEX), HELP truncates the output to six digits for single precision and eight digits for double precision. If the FULL keyword is specified, HELP outputs the value with its full precision (eight digits for single precision and 17 digits for double precision).\n\nSpecify the FULL keyword to see all available information on a given topic without any filtering.',
        },
      },
      {
        label: 'functions = ',
        insertText: 'functions = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Normally, the ROUTINES or SOURCE\\_FILES keywords produce information on both functions and procedures. If FUNCTIONS is specified, only output on functions is produced. If FUNCTIONS is used without either ROUTINES or SOURCE\\_FILES, ROUTINES is assumed.',
        },
      },
      {
        label: 'heap_variables = ',
        insertText: '/heap_variables',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display help information for all the current heap variables.',
        },
      },
      {
        label: 'keys = ',
        insertText: '/keys',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to show current function key definitions as set by DEFINE\\_ KEY. Under UNIX, definitions for those function keys that are currently programmed to perform a function are displayed. Under Windows, definitions for all function keys are displayed. (Under UNIX, use the FULL keyword to display every available key, whether or not it is currently defined.) \n\nIf no arguments are supplied, information on all function keys is displayed. If arguments are provided, they must be scalar strings containing the names of function keys, and information on the specified keys is given. ',
        },
      },
      {
        label: 'lambda = ',
        insertText: '/lambda',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display the list of currently-defined [Lambda](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/L/LAMBDA.htm%22%7D) routines.',
        },
      },
      {
        label: 'last_message = ',
        insertText: '/last_message',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display the last error message issued by IDL.',
        },
      },
      {
        label: 'level = ',
        insertText: 'level = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'By default, HELP displays information for variables in the scope of the currently executing routine. To change this behavior, set this keyword to a scalar integer indicating the scope in which the variables for displaying help should be found. The level value can be either absolute or relative to the current scope, as shown in the following table:\n\n| Value | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                |\n| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| 0     | Level 0 always refers to the frame for the currently executing routine                                                                                                                                                                                                                                                                                                                                                 |\n| < 0   | Negative levels are a relative specification and refer to the frames of active routines relative to the currently executing routine. Level -1 is the direct caller of the current routine, -2 is the caller of the caller of the current routine, and so forth. If you specify a level that is deeper than the current call stack, [SCOPE\\_VARFETCH](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/S/SCOPE%255FVARFETCH.htm%22%7D) clips the value not to go past $MAIN$. |\n| \\> 0  | Positive levels are an absolute specification and refer directly to the specified frame. Level 1 is $MAIN$, level 2 is the routine called from $MAIN$, and so forth. If you specify a level that is past the currently executing routine, [SCOPE\\_VARFETCH](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/S/SCOPE%255FVARFETCH.htm%22%7D) clips the value to the level of the current routine.                                                                            |\n\nFor more information on scope level, see [SCOPE\\_VARFETCH](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/S/SCOPE%255FVARFETCH.htm%22%7D).',
        },
      },
      {
        label: 'memory = ',
        insertText: '/memory',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to see a report on the amount of dynamic memory (in bytes) currently in use by the IDL session; the maximum amount of dynamic memory allocated since the last call to HELP, /MEMORY; and the number of times dynamic memory has been allocated and deallocated. Arguments to HELP are ignored when MEMORY is specified.',
        },
      },
      {
        label: 'messages = ',
        insertText: '/messages',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display all known message blocks and the error space range into which they are loaded.',
        },
      },
      {
        label: 'names = ',
        insertText: 'names = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "A string used to determine the names of the variables whose values are to be printed. A string match (equivalent to the STRMATCH function with the FOLD\\_CASE keyword set) is used to decide if a given variable will be displayed. The match string can contain any wildcard expression supported by STRMATCH, including “\\*” and “?”.\n\nFor example, to print only the values of variables beginning with “A”, use the command `HELP, NAMES='a*'`. Similarly, `HELP, NAMES='?'` prints the values of all variables with a single-character name.\n\nNAMES also works with the output from the following keywords: \n\n| DLM HEAP\\_VARIABLES LAMBDA MESSAGES OBJECTS | PREFERENCES ROUTINES SOURCE\\_FILES STRUCTURES SYSTEM\\_VARIABLES |\n| ------------------------------------------- | --------------------------------------------------------------- |",
        },
      },
      {
        label: 'objects = ',
        insertText: '/objects',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display information on defined object classes. If no arguments are provided, all currently-defined object classes are shown. If no arguments are provided, and the information you are looking for is not displayed, use the FULL keyword to prevent HELP from filtering the output. If arguments are provided, the definition of the object class for the heap variables referred to is displayed.\n\nInformation is provided on inherited superclasses and all _known methods_. A method is known to IDL only if it has been compiled in the current IDL session and called by its own class or a subclass. Methods that have not been compiled yet will not be shown. Thus, the list of methods displayed by HELP is not necessarily a complete list of all possible method for the object class.\n\nIf called within a class’ method, the OBJECTS keyword also displays the instance data of the object on which it was called.',
        },
      },
      {
        label: 'output = ',
        insertText: 'output = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword equal to a named variable that will contain a string array containing the formatted output of the HELP command. Each line of formatted output becomes a single element in the string array.\n\n_Note:_ The OUTPUT keyword is primarily for use in capturing HELP output in order to display it someplace else, such as in a text widget. This keyword is _not_ intended to be used in obtaining programmatic information about the IDL session, and is formatted to be human readable. The format and content of this text is not guaranteed to remain static from release to release and may change _at any time, without warning_. If you find yourself using OUTPUT for a non-display purpose, consider using the STRUCTURE keyword to the [SIZE](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/S/SIZE.htm#S%255F820040301%255F678885%22%7D) function.',
        },
      },
      {
        label: 'path_cache = ',
        insertText: '/path_cache',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display a list of directories currently included in the IDL path cache, along with the number of `.pro` or `.sav` files found in those directories. See [PATH\\_CACHE](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/P/PATH%255FCACHE.htm#P%255F817877613%255F1092955%22%7D) for details.',
        },
      },
      {
        label: 'preferences = ',
        insertText: 'preferences = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to display information about the current status of IDL’s preferences. IDL preferences are internal values used to configure certain aspects of the IDL environment. They serve as the initial values for many IDL system variables, as well as controlling other aspects of the user's environment.\n\nUsed by itself, the PREFERENCES keyword provides the following information:\n\n* The path of the command-line preference file, if any.\n* The path of the distribution preference file.\n* The path of the user preference file.\n* The number of preferences that are currently in a pending state. A preference is said to be pending if a new value has been set for it ([PREF\\_SET](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/P/PREF%255FSET.htm#P%255F817877613%255F1141288%22%7D)) but not yet committed ([PREF\\_COMMIT](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/P/PREF%255FCOMMIT.htm#P%255F817877613%255F1140982%22%7D)).\n* The name and effective value of each preference and the source from which it is derived. In descending order of priority, the sources are command line, environment variable, user preference file, distribution preference file, and IDL default value.\n\nUse PREFERENCES in conjunction with BRIEF for a terse display of the above. Use it with the FULL keyword in order to see the full information for each preference. In FULL mode, HELP displays the information above, as well as:\n\n* A description of its purpose.\n* Its category.\n* If the preference serves as the initial value of a system variable, the name of the variable associated with the preference.\n* When changes to the preference take effect.\n* Values other than the effective value that are known for the preference. Because IDL preferences can have values from more than one source, the source with the highest priority is used as the effective value.",
        },
      },
      {
        label: 'procedures = ',
        insertText: 'procedures = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Normally, the ROUTINES or SOURCE\\_FILES keywords produce information on both functions and procedures. If PROCEDURES is specified, only output on procedures is produced. If PROCEDURES is used without either ROUTINES or SOURCE\\_FILES, ROUTINES is assumed.',
        },
      },
      {
        label: 'recall_commands = ',
        insertText: 'recall_commands = ',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display the saved commands in the command input buffer. By default, IDL saves the last 20 lines of input in a buffer from which they can be recalled for command line editing. Arguments to HELP are ignored when RECALL is specified.\n\nThe number of lines saved can be changed by assigning the desired number of lines to the IDL\\_RBUF\\_SIZE preference. For more information, see [IDL\\_RBUF\\_SIZE](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Creating%20IDL%20Programs/Appendices/prefs%255Fgeneral.htm#preferences%255F2247882535%255F1024816%22%7D).',
        },
      },
      {
        label: 'routines = ',
        insertText: '/routines',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to show a list of all compiled procedures and functions with their parameter names. Keyword parameters accepted by each module are shown to the right of the routine name. If no arguments are provided, and the information you are looking for is not displayed, use the FULL keyword to prevent HELP from filtering the output.',
        },
      },
      {
        label: 'shared_memory = ',
        insertText: '/shared_memory',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display information about all current shared memory and memory mapped file segments mapped into the current IDL process via the [SHMMAP](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Reference%20Material/S/SHMMAP.htm%22%7D) procedure. ',
        },
      },
      {
        label: 'source_files = ',
        insertText: '/source_files',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display information on procedures and functions written in the IDL language that have been compiled during the current IDL session. Full path names (relative to the current directory) of compiled `.pro` files are displayed. If no arguments are provided, and the information you are looking for is not displayed, use the FULL keyword to prevent HELP from filtering the output.',
        },
      },
      {
        label: 'structures = ',
        insertText: '/structures',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display information on structures or object references. If no arguments are provided, all currently-defined structures are shown (use the FULL keyword to display all built-in structure definitions as well). If arguments are provided, the structure definition for those expressions is displayed. It is often more convenient to use `HELP, /STRUCTURES` instead of `PRINT` to look at the contents of a structure variable because it shows the names of the fields as well as the data.\n\n_Tip:_ If a single argument is provided to HELP, and it is a structure, then HELP will automatically display the structure information without having to set the STRUCTURES keyword.',
        },
      },
      {
        label: 'system_variables = ',
        insertText: '/system_variables',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display information on all system variables. Arguments are ignored.',
        },
      },
      {
        label: 'traceback = ',
        insertText: '/traceback',
        kind: 20,
        sortText: '10',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to display the current nesting of procedures and functions.',
        },
      },
      {
        label: 'a',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'b',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'p',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'e',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'var',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1,
        )
      ).slice(0, 50),
    );
    // define position
    const position_2: Position = { line: 24, character: 9 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [];

    // verify results
    expect(expectedFound_2).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_2,
        )
      ).slice(0, 50),
    );
  });
});
