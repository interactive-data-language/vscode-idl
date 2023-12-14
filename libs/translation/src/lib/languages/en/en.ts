import { ITranslation } from '../../translation.interface';
import { HOVER_HELP_EN } from './hover-help.en';

/**
 * English translation
 */
export const EN: ITranslation = {
  assembling: {
    config: {
      errors: {
        fileNotFound: 'Specified config file was not found',
        invalidJSON:
          'Config file is not valid JSON and may have JSON syntax errors',
        invalidConfigFile:
          'Invalid configuration file. Please open in VSCode or see logs for details',
        shouldUpdate: 'Config file should be updated to the latest version',
      },
    },
  },
  tasks: {
    parsing: {
      errors: {
        fileNotFound: 'Specified task file was not found',
        invalidJSON:
          'Task file is not valid JSON and may have JSON syntax errors',
        invalidTaskFile:
          'Invalid task file. Please open in VSCode or see logs for details',
        failedParse:
          'Unable to parse task file. Either JSON syntax error or the task file does not match our schema. Please open in VSCode or see logs for details',
      },
    },
  },
  client: {
    errors: {
      unhandled: 'An unknown error ocurred within the IDL Extension Client',
    },
  },
  commands: {
    idl: {
      client: {
        fileABug: 'IDL: File a Bug',
        viewLogs: 'IDL: View Extension Logs',
        viewSettings: 'IDL: View Extension Settings',
      },
      code: {
        initializeConfig: 'IDL: Initialize Config',
        addDocsToFile: 'IDL: Add/Update Docs for File',
        formatFile: 'IDL: Format File',
        generateTask: 'IDL: Generate ENVI or IDL Task',
      },
      config: {
        specifyIDLDirectory: 'IDL: Specify IDL Directory (User-level)',
        specifyIDLDirectoryWorkspace:
          'IDL: Specify IDL Directory (Workspace-level)',
      },
      debug: {
        startIDL: 'IDL: Start a Session of IDL',
        compileFile: 'IDL: Compile PRO File',
        runFile: 'IDL: Run PRO File',
        executeBatchFile: 'IDL: Execute Batch File',
        resetIDL: 'IDL: Reset Session',
        startProfiling: 'IDL: Start Profiling',
        stopProfiling: 'IDL: Stop Profiling',
      },
      notebooks: {
        convertToMarkdown: 'IDL: Convert IDL Notebook to Markdown',
        convertToPDF: 'IDL: Convert IDL Notebook to PDF',
        helpAsNotebook: 'IDL: Convert Help to Notebook',
        newNotebook: 'IDL: Create New IDL Notebook',
        notebookToProCode: 'IDL: Convert IDL Notebook to PRO Code',
        openIDLExample: 'IDL: Open IDL Example Notebook',
        openENVIExample: 'IDL: Open ENVI Example Notebook',
        // shorter because it shows in toolbar
        resetIDL: 'Reset IDL',
        resetNotebookExamples: 'IDL: Reset IDL and ENVI Example Notebooks',
        // shorter because it shows in toolbar
        stopIDL: 'Stop IDL',
      },
      terminal: {
        startIDL: 'IDL: Open an IDL Terminal Window',
        compileFile: 'IDL: Compile PRO File in Terminal',
        runFile: 'IDL: Run PRO File in Terminal',
        executeBatchFile: 'IDL: Execute Batch File in Terminal',
        resetIDL: 'IDL: Reset Session in Terminal',
        stopExecution: 'IDL: Stop Execution in Terminal',
        continueExecution: 'IDL: Continue Execution in Terminal',
        stepIn: 'IDL: Step In in Terminal',
        stepOver: 'IDL: Step Over in Terminal',
        stepOut: 'IDL: Step Out in Terminal',
      },
      webview: {
        start: 'IDL: Start Webview',
      },
      docs: {
        open: 'IDL: Open Extension Docs',
      },
    },
    errors: {
      client: {
        fileABug: 'Unable to open GitHub URL',
        viewLogs: "Error while viewing IDL's logs",
        viewSettings: "Error while viewing IDL's settings",
      },
      code: {
        initializeConfig: 'Error while initializing config for workspace',
        addDocsToFile: 'Error while adding/updating docs for file',
        formatFile: 'Error while formatting file',
        generateTask: 'Error while generating task',
      },
      config: {
        specifyIDLDirectory: 'Error while setting IDL directory (User)',
        specifyIDLDirectoryWorkspace:
          'Error while setting IDL directory (Workspace)',
      },
      debug: {
        startIDL: 'Error while starting IDL',
        compileFile: 'Error while compiling file for IDL',
        runFile: 'Error while running file for IDL',
        executeBatchFile: 'Error while executing batch file',
        resetIDL: 'Error while resetting IDL',
        startProfiling: 'Error while starting profiling',
        stopProfiling: 'Error while stopping profiling',
      },
      notebooks: {
        convertToMarkdown: 'Error while converting notebook to markdown',
        convertToPDF: 'Error while converting notebook to PDF',
        helpAsNotebook: 'Error while converting help to notebook',
        newNotebook: 'Error while creating new notebook',
        notebookToProCode: 'Error while converting notebook to PRO code',
        openIDLExample: 'Error while opening IDL example notebook',
        openENVIExample: 'Error while opening ENVI example notebook',
        resetIDL: 'Error while resetting IDL',
        resetNotebookExamples: 'Error while resetting example notebooks',
        stopIDL: 'Error while stopping IDL',
      },
      terminal: {
        startIDL: 'Error while opening IDL terminal indow',
        compileFile: 'Error while compiling PRO file in terminal',
        runFile: 'Error while running PRO file in terminal',
        executeBatchFile: 'Error while executing batch file in terminal',
        resetIDL: 'Error while resetting session in terminal',
        stopExecution: 'Error while stopping execution in terminal',
        continueExecution: 'Error while continuing execution in terminal',
        stepIn: 'Error while stepping in in terminal',
        stepOver: 'Error while stepping over in terminal',
        stepOut: 'Error while stepping out in terminal',
      },
      webview: {
        start: 'Error while starting webview',
      },
      docs: {
        open: 'Error while opening extension docs',
      },
    },
    notifications: {
      initConfig: {
        noWorkspaceOpen: 'No currently open workspaces',
        allWorkspacesHaveConfig:
          'All workspaces already have an "idl.json" file',
        configFileCreated: 'IDL config file created!',
        dialogTitle:
          'Specify the open workspace to create an "idl.json" file for',
        dontAsk: "Don't ask for folder",
        neverAsk: 'Never ask again',
      },
      initTask: {
        created: 'Task file created!',
        dialogTitle:
          'Specify which kind of task you want to generate (IDL or ENVI)',
      },
    },
  },
  configuration: {
    titles: {
      root: 'IDL for VSCode',
      general: 'General',
      idl: 'IDL',
      formatting: 'Formatting',
      problems: 'Problem Reporting',
      questions: 'Questions',
      developer: 'Developer',
      languageServer: 'Language Server',
      notebooks: 'Notebooks',
    },
    idlDir: {
      notFound: 'IDL directory not found or specified by user, configure?',
    },
    reloadWindow:
      'IDL configuration has changed, reload window for changes to take effect?',
    descriptions: {
      debugMode:
        'If set to true, the extension will become very chatty for the purposes of debugging.',

      IDL: 'Preferences for IDL',
      'IDL.directory':
        "Specify the folder with IDL's executable (bin directory with idl.exe or idl).",
      'IDL.path':
        "Specify additional directories to add to IDL's search path. Add a '+' before the folder to include subdirectories.\n\nAny folders added to the path are not watched for file changes unless you edit the files within the VSCode UI.",
      'IDL.addWorkspaceFoldersToPath':
        "Specify whether to automatically include the workspace folders to IDL's search path.",
      'IDL.appendOrPrependWorkspaceFolders':
        "If workspace folders are automatically added to IDL's search path, this indicates if they are added before (prepend) or after (append) the IDL Path setting.",
      'IDL.environment':
        "Specify any environment variables you want passed to the IDL process on startup.\n\nThese take precedence over your system environment, meaning: if your system environment variable for PATH is set, and you specify PATH here, then we use this value of PATH instead of the system's.\n\nAdditionally, the extension manages the following environment variables: IDL_PATH, IDL_DLM_PATH, IDL_DIR, and IDL_START_DIR. If you want to change IDL's search path, use the path preference for the extension instead.",
      'IDL.history':
        'Preferences that control the session history (input and output) when running IDL.',
      'IDL.preferences': 'Placeholder',

      'code.formatting': 'Top-level preferences for how code gets formatted.',
      'code.formattingStyle':
        'This controls how code is automatically formatted when using the buttons in the sidebar or formatting on save.',

      languageServer: 'Preferences that control the language server for IDL',
      'languageServer.fullParse':
        '**Experimental and not all features may work when disabled**\n\nWhen the language server starts up, do we fully parse the code in workspaces and on your path?\n\nA full parse checks for syntax and type errors to give more insights into your code without opening each file. However, for large code bases (>1 million lines of code), this uses about 3x more CPU RAM and is about 50% slower.\n\nIf more than one workspace is open, and this is enabled for any workspace, we apply it for all open workspaces.',

      problems: 'Preferences that control how problems are reported',
      'problems.includeProblemsFromIDLPackages':
        'Report problems for all files where we find "idl_packages" in the path. This permits problem reporting from external libraries. If this is set in any open workspace, it applies to all of them.',
      'problems.includeProblemsFromIDLPath':
        'Report problems for all files on IDL path. This permits problem reporting for any file that is found on the IDL Path preference. If this is set in any open workspace, it applies to all of them.',
      'problems.reportDocsProblems':
        'Do we report problems for user documentation? If disabled, no problems are reported regarding documentation. Alternatively, you can disable problems one-by-one using `ignoreProblems`.\n\nImportant note: If this is disabled for one open workspace, it is disabled for all.\n\nImportant note: VSCode may require a restart for changes to take effect.',
      'problems.ignoreProblems':
        'Specify the problem code to ignore and not report to Visual Studio Code',

      notebooks:
        'Preferences that control notebook user experience for IDL Notebooks',
      'notebooks.quietMode':
        'When enabled, automatically sets `!quiet` to a value of `1` to suppress too much output from IDL and keep notebook cell outputs cleaner.',
      'notebooks.embedGraphics':
        "Are graphics embedded as output within each cell?\n\nIf you have open notebooks, you'll need to stop IDL and then re-run cells for changes to take effect.",

      dontAsk:
        'Preferences that disable dialogs that appear and ask questions. These settings can also be disabled directly within the dialogs you see.',
      'dontAsk.forIDLDir':
        "Don't ask for IDL directory on extension startup if it is not set.",
      'dontAsk.forIconChange': "Don't ask to change icon font on startup.",
      'dontAsk.forFormatterChange':
        "Don't ask to set the extension as the default formatter for IDL code.",
      // 'dontAsk.toInitConfig':
      //   'Don\'t ever ask to create an "idl.json" file for any open workspaces',
      // 'dontAsk.toInitConfigForTheseFolders':
      //   'Don\'t ask to create an "idl.json" file at the root level for these folders',

      dontShow:
        'Preferences that disable dialogs/views from automatically appearing',
      'dontShow.welcomePage': "IDL's welcome page on startup",

      developer:
        'For ENVI and IDL developers, choose to disable loading global tokens from the documentation and rely on source code instead.\n\nNOTE: Changing this setting requires a reload to take effect.',
      'developer.IDL': "Disable loading IDL's global tokens.",
      'developer.ENVI': "Disable loading ENVI's global tokens.",
      'developer.ENVIDeepLearning':
        "Disable loading ENVI Deep Learning's global tokens.",
      'developer.ENVIMachineLearning':
        "Disable loading ENVI Machine Learning's global tokens.",
    },
    properties: {
      'code.formatting': {
        autoDoc:
          "Automatically creates and updates IDL Doc style comments for routines on each save. You can freely use this if you don't have docs for your code. If you have docs, and they don't follow IDL Doc style, they are preserved.",
        autoFix:
          'If a problem can be automatically fixed, fix it prior to formatting. This does not apply to all problems detected by IDL.',
        eol: 'Indicate whether we use the new line character ("lf", recommended) or Windows-style carriage-return-new-line ("crlf").',
        styleAndFormat:
          'When we process our code, do we apply our styles and format?\n\nIf this is set to `false` and `autoDoc` is enabled, then we add documentation to your code without changing anything else.',
        tabWidth: 'Number of spaces to use for indentation.',
      },
      'code.formattingStyle': {
        binary:
          'Indicates formatting for binary numbers (either defined with quotes or "0b")',
        control:
          'How are control statements, such as "for", "if", "pro", formatted',
        hex: 'Indicates formatting for hexadecimal (hex) numbers (either defined with quotes or "0x")',
        keywords: 'Formatting for keywords, includes binary keywords',
        localVariables:
          'If local variables match the case for the first instance that we find',
        methods: 'Do we use a dot or arrow for method invocation',
        numbers:
          'Controls accents to letters that set the data type and their case',
        octal:
          'Indicates formatting for octal numbers (either defined with quotes or "0o")',
        properties: 'Controls the case style of properties',
        quotes:
          'For string literals what type of quote we use. Includes numbers defined using quotes.',
        routines:
          'When we encounter a known routine (functions and procedures), how do we format it with respect to the definition',
        routineMethods:
          'When we encounter a known routine method (function methods and procedure methods), how do we format it with respect to the definition?',
        structureNames:
          'When we have a known named structure, how do we format the name?',
        systemVariables: 'Case formatting for system variables',
      },
      'IDL.history': {
        enabled: 'Do we track session history or not?',
        maxSize:
          'The maximum file size (MB) for the history file. On startup, if the log file is larger than this size, it is truncated. Otherwise we append.',
        truncateOnStartup:
          'When IDL starts, do we always clear our session history file and start fresh?',
        folder: 'The folder that we write our session history to',
        fileName:
          'The base name of the file that contains the session history. This file will be created in the folder specified above.',
      },
    },
    enumDescriptions: {
      workspace: {
        append:
          "(Recommended) Add workspace folders at the beginning of IDL's search path",
        prepend:
          "(NOT Recommended) Add workspace folders at the end of IDL's search path",
      },
      formatting: {
        eol: {
          lf: '(Recommended) Line feed character at line end',
          crlf: '(NOT Recommended) Windows-style carriage-return-new-line ("crlf")',
        },
        style: {
          arrow: 'Use "->" when invoking a function or procedure method',
          dot: 'Use "." when invoking a function or procedure method',
          single: 'Use single quotes for string expressions',
          double: 'Use double quotes for string expressions',
          upper: 'Use upper case (i.e. "UPPER")',
          lower: 'Use lower case (i.e. "LOWER")',
          camel: 'Use camel case (i.e. "camelCase")',
          pascal: 'Use pascal case (i.e. "PascalCase")',
          match: 'Match case of definition',
          none: 'Apply no formatting',
        },
      },
    },
  },
  debugger: {
    logs: {
      host: 'IDL: Extension Host',
      debugHistory: 'IDL: Session History',
      viewFile: 'View File',
      viewLogs: 'View Logs',
      specifyIDLLocation: 'Specify IDL Location',
      buttonCallbackError: 'Error responding to dialog button callback',
    },
    idl: {
      label: 'IDL: Launch',
      name: 'Launch IDL',
      pleaseStart: 'Please start a session of IDL',
      alreadyStarted: 'IDL has already been started in the debug console',
      existingSessionFound:
        'An existing session is running. Please close it before starting IDL',
      startProfiling: 'Starting profiling',
      stopProfiling: 'Stopped profiling',
      description:
        'Start a new, interactive session of IDL with the ability to compile + run files and reset the session, like the IDL Workbench.',
    },
    adapter: {
      start: 'Launching IDL!',
      restart: 'Restarting IDL!',
      stop: 'Stopping IDL session',
      failedStart: 'Failed to start IDL, message:',
      crashed: 'IDL crashed or was stopped by the user :(',
      noIDLDir: 'The IDL directory has not been configured, cannot start',
      breakpointSetFailed: 'Error setting breakpoints for file',
      scopeParseError: 'Error getting scope information from IDL output',
      promiseResolveError:
        'Error resolving promise for executing IDL statement',
      noRoutineFound:
        'No main level program or function/procedure with same name as file found',
      returning: 'File compiled while active, returning...',
      nothingToEdit: 'No matching file found',
      noPauseOnWindows: 'Pause is not currently supported on Windows platforms',
      syntaxError:
        'IDL detected a syntax error on this line when compiling your code',
      previewWarning:
        '\n-----------------------------\nRunning IDL from within VSCode is not fully implemented yet.\nMost things should work but you may encounter a few issues.\nIn particular, the "Pause" button does not work on Windows, and you may occasionally see some internal output in the debug console.\n-----------------------------\n',
    },
    errors: {
      configDone: 'Error while handling "configurationDone" request',
      launch: 'Error while handling "launch" request',
      setBreakpoint: 'Error while handling "setBreakpoint" request',
      breakpointLocations: 'Error while handling "breakpointLocations" request',
      threads: 'Error while handling "threads" request',
      scopes: 'Error while handling "scopes" request',
      variables: 'Error while handling "variables" request',
      stackTrace: 'Error while handling "stackTrace" request',
      continue: 'Error while handling "continue" request',
      next: 'Error while handling "next" request',
      stepIn: 'Error while handling "stepIn" request',
      stepOut: 'Error while handling "stepOut" request',
      pause: 'Error while handling "pause" request',
      terminate: 'Error while handling "terminate" request',
      cancel: 'Error while handling "cancel" request',
      evaluate: 'Error while handling "evaluate" request',
      idlDetails:
        'Error getting information about IDL (version, directory, etc.)',
      createHistory:
        'Error while creating or truncating history file. Does the folder have write permissions?',
      addHistory:
        'Error while adding content to IDL history file. Does the location have write permissions?',
    },
  },
  hoverHelp: HOVER_HELP_EN,
  envi: {
    openerTitle: 'ENVI File Opener',
    openerText:
      'ENVI should attempt to open the image shortly, please wait.\nTo disable this behavior, view the documentation for the extension "IDL for VSCode".',
    open: {
      commandError:
        'An unknown error ocurred while trying to open data in ENVI',
      defaultError:
        'An unknown error occurred, see the IDL console for more details',
      enviError:
        'Error while accessing ENVI, see the IDL console for more details',
      noUI: 'ENVI has started, but has no UI. Please restart ENVI with the UI to display data',
      openError: 'Unable to open dataset, see the IDL console for more details',
    },
  },
  icons: {
    label: 'IDL (Customized Visual Studio Code)',
  },
  idl: {
    tree: {
      name: 'Actions and Commands',
      selectionChangeError: 'Error while handling selection change in IDL tree',
      clickHandlerError: 'Error while handling IDL tree click event',
      parents: {
        quickAccess: 'Quick Access',
        codeActions: 'Code',
        notebooks: 'Notebooks',
        debugging: 'IDL',
        terminal: 'Terminal',
      },
      children: {
        quickAccess: {
          pickIDL: {
            name: 'Specify IDL directory',
            description: '(where "idl.exe" or "idl" lives)',
          },
          fileBug: {
            name: 'File',
            description: 'a bug report for the extension',
          },
          openWebview: {
            name: 'Open Welcome Page',
            description: '',
          },
          openDocs: {
            name: 'Open Extension Docs',
            description: '',
          },
          viewLogs: {
            name: 'View Extension Logs',
            description: '',
          },
          viewSettings: {
            name: 'Open Extension Settings',
            description: '',
          },
        },
        codeActions: {
          initializeConfig: {
            name: 'Initialize "idl.json"',
            description: 'for an open workspace',
          },
          addDocs: {
            name: 'Add/Update Routine Docs',
            description: 'for file',
          },
          formatFile: {
            name: 'Format PRO Code or Task File',
            description: '',
          },
          generateTask: {
            name: 'Generate ENVI or IDL Task',
            description: '',
          },
        },
        debugging: {
          start: {
            name: 'Start',
            description: 'a session of IDL',
          },
          compile: {
            name: 'Compile',
            description: 'PRO file',
          },
          run: {
            name: 'Run',
            description: 'PRO file',
          },
          execute: {
            name: 'Execute',
            description: 'PRO file as batch file',
          },
          reset: {
            name: 'Reset',
            description: 'the IDL session',
          },
          startProfiling: {
            name: 'Start Profiling',
            description: 'the IDL session',
          },
          stopProfiling: {
            name: 'Stop Profiling',
            description: 'the IDL session',
          },
        },
        notebooks: {
          formatNotebooks: {
            name: 'Format Notebook Cells',
            description: '',
          },
          newNotebook: {
            name: 'New IDL Notebook',
            description: '',
          },
          notebookToProCode: {
            name: 'Convert IDL Notebook to PRO Code',
            description: '',
          },
          notebookToPDF: {
            name: 'Convert IDL Notebook to PDF',
            description: '',
          },
          openENVIExample: {
            name: 'Open ENVI Notebook Example',
            description: '',
          },
          openIDLExample: {
            name: 'Open IDL Notebook Example',
            description: '',
          },
          resetExampleNotebooks: {
            name: 'Reset Example Notebooks',
            description: '',
          },
        },
        terminal: {
          openTerminal: {
            name: 'Open',
            description: 'IDL in a terminal window',
          },
          compileTerminal: {
            name: 'Compile',
            description: 'PRO file in terminal',
          },
          runTerminal: {
            name: 'Run',
            description: 'PRO file in terminal',
          },
          executeTerminal: {
            name: 'Execute',
            description: 'PRO file as batch file in terminal',
          },
          resetTerminal: {
            name: 'Reset',
            description: 'the IDL session in the terminal',
          },
          stopTerminal: {
            name: 'Stop',
            description: 'the IDL terminal process',
          },
          continueTerminal: {
            name: 'Continue',
            description: 'execution in terminal',
          },
          stepInTerminal: {
            name: 'Step Into',
            description: 'routine call in terminal',
          },
          stepOverTerminal: {
            name: 'Step Over',
            description: 'routine call in terminal',
          },
          stepOutTerminal: {
            name: 'Step Out',
            description: 'of routine call in terminal',
          },
        },
      },
    },
  },
  logger: {
    defaultErrorMessage:
      'The IDL extension had an error :( See output/debug console for details',
  },
  lsp: {
    config: {
      failedParse: 'Problem parsing IDL config file',
    },
    index: {
      failedParse: 'Failed to parse PRO file',
      failedParseNotebook: 'Failed to parse IDL notebook file',
      failedPostProcess: 'Failed to post-process PRO file (s)',
      failedIndexWorkspace: 'Failed to index workspace folder(s)',
      failedChangeDetection:
        'Failed to run change detection and post-process file(s)',
    },
    events: {
      onCompletion: 'Problem resolving auto complete',
      onDefinition: 'Problem finding token definition',
      onDocumentFormatting: 'Problem formatting file',
      onDocumentFormattingProblemCode:
        'Unable to format code due to syntax error or problem in file',
      onHover: 'Problem resolving hover help',
      onAddDocs: 'Problem adding/updating routine docs for file',
      onDidClose: 'Problem when closing file',
      unhandledWorkerMessage:
        "Unknown error from one of the the language server's worker threads",
      onDidOpen: 'Problem when opening file',
      onDidChangeWorkspaceFolders:
        'Problem responding to workspace folder change event',
      onDidChangeContent: 'Problem responding to content change event',
      onDocumentSymbol: 'Problem responding to document symbol event',
      onWorkspaceConfig: 'Problem responding to workspace config event',
      onDidRename: 'Problem responding to file rename event',
      onGenerateTask: 'Problem while creating task file',
      onInitWorkspaceConfig: 'Problem while initializing workspace config',
      onSemanticHighlighting: 'Problem resolving semantic tokens',
      onCodeAction: 'Error responding to code action event',
      onDidOpenNotebook: 'Error responding to notebook open event',
      onDidChangeNotebook: 'Error responding to notebook change event',
      onDidCloseNotebook: 'Error responding to notebook close event',
      onRetrieveDocs: 'Error responding to docs retrieval event',
      onNotebookToProCode: 'Error converting notebook to PRO code',
    },
    errors: {
      unhandled: 'An unknown error ocurred within the IDL Language Server',
      start: 'Failed to start the IDL Language Server',
      connection: 'Failed to send/receive message with the IDL Language Server',
      closed:
        'The IDL Language Server crashed. This is likely a memory issue, please see docs for more information and workarounds.',
    },
    types: {
      unknown: {
        function: 'Unknown function',
        functionMethod: 'Unknown function method',
        procedure: 'Unknown procedure',
        procedureMethod: 'Unknown procedure method',
        property: 'Unknown property',
        keyword: 'Unknown keyword',
        sysVar: 'Unknown system variable',
      },
      staticReference: 'A static reference to the class',
    },
  },
  notebooks: {
    title: 'IDL: Notebook',
    renderer: 'IDL: Notebook Renderer',
    controller: 'IDL',
    errors: {
      errorParsing: 'Unable to parse notebook file',
      errorLoadOutputs:
        'Error while loading outputs from notebook cells, please re-run cells to generate outputs',
      errorSaving: 'Unknown error while saving notebook file',
      failedStart: 'The notebook session of IDL failed to start',
      didntStartRight:
        "The notebook session of IDL didn't start or reset right. Not everything may function as expected.",
      failedExecute: 'Failed to execute notebook cells',
      crashed:
        'IDL crashed or was stopped by the user and needs to be restarted',
      checkingGraphics: 'Error while trying to retrieve any graphics to embed',
      handlingMessageFromRenderer:
        'Error while responding to message from notebook renderer',
    },
    notifications: {
      startingIDL: 'Starting IDL, please wait...',
      resettingIDL: 'Resetting IDL',
      stoppingIDL: 'Stopping IDL',
      idlNotStarted:
        'IDL has not started for notebooks. It automatically starts when you run a code cell.',
      noExamplesFoundInDocs:
        'No examples found in documentation to create notebook from',
      saveNotebookFirst:
        'You need to save your notebook to disk before converting',
      includeAllCells:
        'Include all cells when converting to PRO code? Non-IDL cells will turn into comments.',
      needMarkdownPDF:
        'Converting a notebook to a PDF requires the extension "Markdown PDF", install and proceed?',
      markdownPDFWaitForInstall:
        'Wait for Markdown PDF to install chromium and then try again',
    },
  },
  notifications: {
    noProCode: 'No active PRO file in VSCode',
    noProCodeOrTaskFile: 'No active PRO file or Task file in VSCode',
    noIDLNotebook: 'No active IDL Notebook in VSCode',
    noIDLDirFound: 'IDL directory not found or configured, cannot start IDL',
    yes: 'Yes',
    no: 'No',
    dontAsk: "Don't ask again",
    changeIcons: 'Switch to IDL file icons? Adds new icons for PRO code.',
    changeFormatter: 'Set extension as default formatter for IDL code?',
    formatOnSave:
      'Format PRO code automatically on file save? This will not affect other languages and will be limited to PRO files.',
    initIDLJSON:
      'No "idl.json" file found at root level of workspace folder, create? Workspace:',
    configure: 'Configure',
    start: 'Start?',
    viewDocs: 'View docs',
  },
  packageJSON: {
    displayName: 'IDL for VSCode',
    description:
      'IDL syntax highlighting, code snippets, running IDL programs, and much more!',
  },
  parsing: {
    errors: {
      '0': 'Statement is not closed as expected',
      '1': 'Unexpected closing statement',
      '2': 'unknown token',
      '3': 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
      '4': 'Well this is embarrassing, we encountered an unknown error when checking syntax here. If this issue persists, please file a bug report.',
      '5': 'Well this is embarrassing, we encountered an unknown problem when processing this file. If this issue persists, please file a bug report.',
      '6': 'TODO statement, visit location for details on what to do',
      '7': 'Unknown token encountered. Verify syntax and expression is allowed.',
      '8': 'Arrow functions must be followed by the method name or super::method name and cannot be split between lines',
      '9': 'Illegal comma',
      '10': 'Illegal colon. Colons are only allowed in braces for indexing and structures for property creation/setting',
      '11': 'Illegal include. Include statements are only allowed in the first level of a function, procedure, or main-level program',
      '12': `is a reserved name used for control statements. If you see this, make sure you don't have a syntax error in your code.`,
      '13': 'Unexpected conditional (ternary/elvis) operator',
      '14': 'Colon detected in function call. If indexing array, you should be using square brackets instead of parentheses. Using parentheses for array indexing is ambiguous and problematic when there is a function with the same name as the variable you are indexing.',
      '15': 'Colon detected in function method call. If indexing array, you should be using square brackets instead of parentheses. Using parentheses for array indexing is ambiguous and problematic when there is a function with the same name as the variable you are indexing.',
      '16': 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
      '17': 'Illegal structure declaration',
      '18': 'Illegal parentheses',
      '19': 'Illegal bracket',
      '20': 'In procedures and main level programs, the "return" procedure cannot have values',
      '21': 'In function definitions, the "return" procedure cannot have more than one value',
      '22': 'In function definitions, the "return" procedure must have one (and only one) value',
      '23': 'Duplicate procedure definition',
      '24': 'Duplicate function definition',
      '25': 'Duplicate procedure method definition',
      '26': 'Duplicate function method definition',
      '27': 'Duplicate structure definition',
      '28': 'Duplicate system variable definition',
      '29': 'Reserved procedure name (conflicts with core IDL procedure)',
      '30': 'Reserved function name (conflicts with core IDL function)',
      '31': 'In function definitions, the "return" procedure must be present and have one value that it returns',
      '32': 'Only procedure or function definitions are allowed before an existing procedure or function definition. Please use a main level program instead.',
      '33': 'Main level program is missing an "end" statement',
      '34': 'Main level programs cannot be empty. IDL expects statements besides comments and "end".',
      '35': 'Only comments are allowed after line continuations. This helps prevent accidental bugs.',
      '36': 'Reserved procedure method name (conflicts with core IDL procedure method)',
      '37': 'Reserved function method name (conflicts with core IDL function method)',
      '38': 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
      '39': '"idl2" was not found as a compile option and should always be one',
      '40': 'Illegal compile option',
      '41': '"compile_opt" should specify at least one compile option',
      '42': 'Use the "idl2" compile option instead. It is shorthand for "compile_opt defint32, strictarr".',
      '43': 'Comma expected after statement',
      '44': 'Comma not allowed immediately after statement',
      '45': 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
      '46': 'Quote/string is not closed. While not a syntax error, this can lead to bugs.',
      '47': 'Argument definitions should come before keyword definitions',
      '48': 'Argument(s) are missing from the documentation for the routine',
      '49': 'Documentation includes arguments, but none are present in routine definition',
      '50': 'Keywords(s) are missing from the documentation for the routine',
      '51': 'Documentation includes keywords, but none are present in routine definition',
      '52': 'Expected a documentation tag for ":Returns:" since this is a function or function method',
      '53': 'Parameter direction should be either "in", "out", or "bidirectional"',
      '54': 'Parameter requirements should be either "required" or "optional"',
      '55': 'The type documentation is invalid (placeholder)',
      '56': 'The last docs parameter is only allowed to be "private" or "public". If not specified, it will be considered public',
      '57': 'Not enough documentation arguments. Expected the pattern "parameterName: in/out, required/optional, dataType" at a minimum',
      '58': 'Too many documentation arguments. Expected the pattern "parameterName: in/out, required/optional, dataType, private/public" at most',
      '59': 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
      '60': 'The returns documentation should include the data type that is returned. For example: ":Returns: float"',
      '61': 'The returns documentation should only contain the data type that is returned. For example: ":Returns: float"',
      '62': 'For procedures, the ":Returns:" documentation tag is not needed because procedures cannot return values',
      '63': 'Documented argument, keyword, or property does not exist',
      '64': 'Parameter is missing from documentation',
      '65': 'String literals are only allowed to have up-to one comma to specify formatting',
      '66': '"continue" statements can only exist within a loop',
      '67': '"break" statements can only exist within a loop, case, or switch',
      '68': 'Expected IDL statement or expression after, but none was found',
      '69': 'Unfinished statement or invalid syntax for properties, methods, or numbers',
      '70': 'Illegal formatting for hex escape character. Should be of the form "\\xXX" and must start with "\\x"',
      '71': 'Illegal/unknown template escape. Supported escape characters are "\\", "\\b", "\\f", "\\n", "\\r", "\\t", "\\v", "\\$", "\\`", and "\\xXX" for hex characters',
      '72': 'More than one argument or keyword variable has the same name',
      '73': 'More than one keyword has the same name',
      '74': 'Property specified more than one time',
      '75': 'Keywords can only be used once in routine or method calls',
      '76': 'The "::init" method for object classes should be a function',
      '77': 'No matching structure/object/class definition for structure named',
      '78': 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
      '79': 'Structure definition is missing from docs',
      '80': 'Property is missing from documentation',
      '81': 'Class definitions should not have any arguments or keywords',
      '82': 'Not enough documentation arguments for property. Expected the pattern "propertyName: dataType"',
      '83': 'Too many documentation arguments for property. Expected the pattern "propertyName: dataType" at most',
      '84': 'Illegal subscript use. Subscripting using `:` is only valid for lists and arrays',
      '85': 'Illegal use of structures, operations like addition, subtraction, etc are not allowed.',
      '86': 'Illegal use of lists. When using operators with lists, all types must be list',
      '87': 'Illegal use of hashes. When using operators with hashes, all other arguments must be of type hash, of hash, or dictionaries',
      '88': 'Illegal use of ordered hashes. When using operators with ordered hashes, all other arguments must be of type hash, ordered hash, or dictionaries',
      '89': 'Illegal use of dictionaries. When using operators with dictionaries, all other arguments must be of type hash, ordered hash, or dictionaries',
      '90': 'Potential type incompatibility found. If non-standard IDL types have overloaded operator methods, you can ignore this warning',
      '91': 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
      '92': 'Potential type incompatibility found when attempting to resolve types of merged arrays',
      '93': 'Found pointer de-reference, but nothing to operate on',
      '94': 'Pointer de-referencing can only be used with pointer data types',
      '95': 'One or more data types found does not support indexing',
      '96': 'One or more data types found does not support pointer de-referencing',
      '97': 'Unknown keyword',
      '98': 'Incomplete ternary operator missing the "else" portion (no ": val" present)',
      '99': 'Undefined variable',
      '100': 'Potentially undefined variable',
      '101': 'Variable is used before definition',
      '102': 'Variable is potentially used before definition',
      '103': 'Ambiguous keyword usage. One or more keywords starts with',
      '104': 'Unused variable',
      '105':
        'Illegal use of parentheses for indexing variable, use brackets instead (function name matches local variable). If this is a function call, add `compile_opt idl2` to delineate between the variable and function call.',
      '106':
        'Circular include statement found. This means that the included file includes this file (directly or indirectly).',
    },
  },
  terminal: {
    pleaseStart: 'Please start a terminal session of IDL',
    alreadyStarted: 'IDL has already been started in the terminal',
  },
  statusBar: {
    startQuestion: 'Start?',
    startAgainQuestion: 'Start again?',
    crashed: 'Crashed',
    stopped: 'Stopped',
    starting: 'Starting...',
    ready: 'Ready!',
    running: 'Running...',
    problemStarting: 'Unable to start',
    indexing: 'Indexing code',
  },
  themes: {
    new: 'Novus IDL',
    magmatic: 'Magmatic IDL',
    neon: 'Neon IDL',
    retro: 'Retro IDL',
  },
  webview: {
    content: {
      notFound: 'IDL webview content not found',
    },
    title: 'IDL',
    home: {
      title: 'No content to show',
    },
    profiler: {
      title: 'IDL Profiler View',
      noShow: 'No profiling results to show.',
      filter: 'Routine name filter',
      table: {
        routine: 'Routine',
        hits: 'Hits',
        timeSelf: 'Time Self (ms)',
        timeTotal: 'Time Total (ms)',
        linesRun: 'Lines Run',
        linesTotal: 'Lines Total',
      },
    },
  },
  docs: {
    placeholder: {
      params: 'Placeholder docs for argument, keyword, or property',
    },
    hover: {
      params: {
        direction: 'Parameter direction',
        required: 'Parameter is required',
        true: 'true',
        false: 'false',
        typeParam: 'Parameter data type',
        typeProp: 'Property data type',
        self: 'A reference to our object class',
        private: 'Private',
      },
    },
  },
  autoComplete: {
    detail: {
      variable: 'Variable',
      systemVariable: 'System Variable',
      procedure: 'Procedure',
      function: 'Function',
      property: 'Property of',
      functionMethod: 'Function Method',
      procedureMethod: 'Procedure Method',
      keyword: 'Keyword',
      structure: 'Structure',
    },
  },
  generators: {
    errors: {
      tasks: {
        alreadyExists: 'Task file exists already, cannot overwrite.',
        noProcedure:
          'No procedure definition found with the base name of the PRO file (required to create a task)',
      },
    },
  },
  usageMetrics: {
    sendingUsageMetric: 'Sending usage metric',
    learnMore: 'Learn more',
  },
};
