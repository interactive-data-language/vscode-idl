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
        invalidConfigFile:
          'Invalid configuration file. Please open in VSCode or see logs for details',
        invalidJSON:
          'Config file is not valid JSON and may have JSON syntax errors',
        shouldUpdate: 'Config file should be updated to the latest version',
      },
    },
  },
  autoComplete: {
    detail: {
      enviTask: 'ENVI Task',
      function: 'Function',
      functionMethod: 'Function Method',
      idltask: 'IDL Task',
      keyword: 'Keyword',
      procedure: 'Procedure',
      procedureMethod: 'Procedure Method',
      property: 'Property of',
      structure: 'Structure',
      systemVariable: 'System Variable',
      variable: 'Variable',
    },
  },
  client: {
    errors: {
      unhandled: 'An unknown error ocurred within the IDL Extension Client',
    },
  },
  commands: {
    errors: {
      client: {
        fileABug: 'Unable to open GitHub URL',
        viewLogs: "Error while viewing IDL's logs",
        viewSettings: "Error while viewing IDL's settings",
      },
      code: {
        addDocsToFile: 'Error while adding/updating docs for file',
        disableProblemSetting:
          'Error while disabling problem code via settings',
        fixProblem: 'Error while fixing problem from code action',
        formatFile: 'Error while formatting file',
        formatWorkspace: 'Error while formatting workspace',
        generateTask: 'Error while generating task',
        initializeConfig: 'Error while initializing config for workspace',
        migrateToDL30API: 'Error while migrating code',
      },
      config: {
        specifyIDLDirectory: 'Error while setting IDL directory (User)',
        specifyIDLDirectoryWorkspace:
          'Error while setting IDL directory (Workspace)',
      },
      debug: {
        compileFile: 'Error while compiling file for IDL',
        executeBatchFile: 'Error while executing batch file',
        resetIDL: 'Error while resetting IDL',
        runFile: 'Error while running file for IDL',
        startIDL: 'Error while starting IDL',
        startProfiling: 'Error while starting profiling',
        stopProfiling: 'Error while stopping profiling',
      },
      docs: {
        open: 'Error while opening extension docs',
        openLink: 'Error while opening docs link',
      },
      notebooks: {
        convertToMarkdown: 'Error while converting notebook to markdown',
        convertToPDF: 'Error while converting notebook to PDF',
        helpAsNotebook: 'Error while converting help to notebook',
        newNotebook: 'Error while creating new notebook',
        notebookToProCode: 'Error while converting notebook to PRO code',
        openENVIExample: 'Error while opening ENVI example notebook',
        openIDLExample: 'Error while opening IDL example notebook',
        resetIDLKernel: 'Error while resetting IDL Notebook Kernel',
        resetNotebookExamples: 'Error while resetting example notebooks',
        stopAllIDLKernels: 'Error while stopping all IDL Notebook Kernels',
        stopIDLKernel: 'Error while stopping IDL Notebook Kernel',
      },
      terminal: {
        compileFile: 'Error while compiling PRO file in terminal',
        continueExecution: 'Error while continuing execution in terminal',
        executeBatchFile: 'Error while executing batch file in terminal',
        pauseExecution: 'Error while stopping execution in terminal',
        resetIDL: 'Error while resetting session in terminal',
        runFile: 'Error while running PRO file in terminal',
        startIDL: 'Error while opening IDL terminal indow',
        stepIn: 'Error while stepping in in terminal',
        stepOut: 'Error while stepping out in terminal',
        stepOver: 'Error while stepping over in terminal',
      },
      webview: {
        start: 'Error while starting webview',
      },
    },
    idl: {
      client: {
        fileABug: 'IDL: File a Bug',
        viewLogs: 'IDL: View Extension Logs',
        viewSettings: 'IDL: View Extension Settings',
      },
      code: {
        addDocsToFile: 'IDL: Add/Update Docs for File',
        disableProblemSetting: 'IDL: Disable Problem Code via Setting',
        fixProblem: 'IDL: Fix Problem for Code Action',
        formatFile: 'IDL: Format File',
        formatWorkspace: 'IDL: Format Files in Workspace',
        generateTask: 'IDL: Generate ENVI or IDL Task',
        initializeConfig: 'IDL: Initialize Config',
        migrateToDL30API: 'IDL: Migrate Code to ENVI Deep Learning 3.0 API',
      },
      config: {
        specifyIDLDirectory: 'IDL: Specify IDL Directory (User-level)',
        specifyIDLDirectoryWorkspace:
          'IDL: Specify IDL Directory (Workspace-level)',
      },
      debug: {
        compileFile: 'IDL: Compile PRO File',
        executeBatchFile: 'IDL: Execute Batch File',
        resetIDL: 'IDL: Reset Session',
        runFile: 'IDL: Run PRO File',
        startIDL: 'IDL: Start a Session of IDL',
        startProfiling: 'IDL: Start Profiling',
        stopProfiling: 'IDL: Stop Profiling',
      },
      docs: {
        open: 'IDL: Open Extension Docs',
        openLink: 'IDL: Open Docs Link',
      },
      notebooks: {
        convertToMarkdown: 'IDL: Convert IDL Notebook to Markdown',
        convertToPDF: 'IDL: Convert IDL Notebook to PDF',
        helpAsNotebook: 'IDL: Convert Help to Notebook',
        newNotebook: 'IDL: Create New IDL Notebook',
        notebookToProCode: 'IDL: Convert IDL Notebook to PRO Code',
        openENVIExample: 'IDL: Open ENVI Example Notebook',
        openIDLExample: 'IDL: Open IDL Example Notebook',
        // shorter because it shows in toolbar
        resetIDLKernel: 'IDL: Reset IDL Notebook Kernel',
        resetNotebookExamples: 'IDL: Reset IDL and ENVI Example Notebooks',
        stopAllIDLKernels: 'IDL: Stop All IDL Notebook Kernels',
        // shorter because it shows in toolbar
        stopIDLKernel: 'IDL: Stop IDL Notebook Kernel',
      },
      terminal: {
        compileFile: 'IDL: Compile PRO File in Terminal',
        continueExecution: 'IDL: Continue Execution in Terminal',
        executeBatchFile: 'IDL: Execute Batch File in Terminal',
        pauseExecution: 'IDL: Stop Execution in Terminal',
        resetIDL: 'IDL: Reset Session in Terminal',
        runFile: 'IDL: Run PRO File in Terminal',
        startIDL: 'IDL: Open an IDL Terminal Window',
        stepIn: 'IDL: Step In in Terminal',
        stepOut: 'IDL: Step Out in Terminal',
        stepOver: 'IDL: Step Over in Terminal',
      },
      webview: {
        start: 'IDL: Start Webview',
      },
    },
    notifications: {
      formatWorkspace: {
        notAllFilesFormatted:
          'Some files were not formatted, see logs for more details',
        pickWorkspace:
          'Specify the open workspace to format all PRO files in workspace',
      },
      initConfig: {
        allWorkspacesHaveConfig:
          'All workspaces already have an "idl.json" file',
        configFileCreated: 'IDL config file created!',
        dialogTitle:
          'Specify the open workspace to create an "idl.json" file for',
        dontAsk: "Don't ask for folder",
        neverAsk: 'Never ask again',
        noWorkspaceOpen: 'No currently open workspaces',
      },
      initTask: {
        created: 'Task file created!',
        dialogTitle:
          'Specify which kind of task you want to generate (IDL or ENVI)',
      },
    },
  },
  configuration: {
    descriptions: {
      code: 'code',

      'code.formatting': 'Top-level preferences for how code gets formatted.',
      'code.formattingStyle':
        'This controls how code is automatically formatted when using the buttons in the sidebar or formatting on save.',
      debugMode:
        'If set to true, the extension will become very chatty for the purposes of debugging.',
      developer:
        'For ENVI and IDL developers, choose to disable loading global tokens from the documentation and rely on source code instead.\n\nNOTE: Changing this setting requires a reload to take effect.',
      'developer.ENVI': "Disable loading ENVI's global tokens.",
      'developer.ENVIDeepLearning':
        "Disable loading ENVI Deep Learning's global tokens.",
      'developer.ENVIMachineLearning':
        "Disable loading ENVI Machine Learning's global tokens.",
      'developer.IDL': "Disable loading IDL's global tokens.",

      documentation: 'documentation',
      'documentation.localPort':
        'When using local extension docs, what port do we serve them from?',
      'documentation.useOnline':
        'For extension documentation, do we use the online (hosted) version, or the local version packaged with the extension?',

      dontAsk:
        'Preferences that disable dialogs that appear and ask questions. These settings can also be disabled directly within the dialogs you see.',
      'dontAsk.forFormatterChange':
        "Don't ask to set the extension as the default formatter for IDL code.",
      'dontAsk.forIconChange': "Don't ask to change icon font on startup.",
      'dontAsk.forIDLDir':
        "Don't ask for IDL directory on extension startup if it is not set.",
      'dontAsk.forMCPConfig':
        "Don't ask to automatically configure the MCP server for use with the GitHub Copilot Agent embedded within VSCode.",
      'dontAsk.toOpenDocs': `Don't ask to open the documentation on extension startup`,

      dontShow:
        'Preferences that disable dialogs/views from automatically appearing',
      'dontShow.welcomePage': "IDL's welcome page on startup",
      IDL: 'Preferences for IDL',
      'IDL.addWorkspaceFoldersToPath':
        "Specify whether to automatically include the workspace folders to IDL's search path.",
      'IDL.appendOrPrependWorkspaceFolders':
        "If workspace folders are automatically added to IDL's search path, this indicates if they are added before (prepend) or after (append) the IDL Path setting.",
      'IDL.directory':
        "Specify the folder with IDL's executable (bin directory with idl.exe or idl).",
      'IDL.environment':
        "Specify any environment variables you want passed to the IDL process on startup.\n\nThese take precedence over your system environment, meaning: if your system environment variable for PATH is set, and you specify PATH here, then we use this value of PATH instead of the system's.\n\nAdditionally, the extension manages the following environment variables: IDL_PATH, IDL_DLM_PATH, IDL_DIR, and IDL_START_DIR. If you want to change IDL's search path, use the path preference for the extension instead.",

      'IDL.history':
        'Preferences that control the session history (input and output) when running IDL.',
      'IDL.path':
        "Specify additional directories to add to IDL's search path. Add a '+' before the folder to include subdirectories.\n\nAny folders added to the path are not watched for file changes unless you edit the files within the VSCode UI.",
      'IDL.preferences': 'Placeholder',

      languageServer: 'Preferences that control the language server for IDL',
      'languageServer.fullParse':
        'When the language server starts up, do we fully parse the code in workspaces and on your path?\n\nA full parse checks for syntax and type errors to give more insights into your code without opening each file. However, for large code bases (>1 million lines of code), this uses about 3x more CPU RAM and is about 50% slower.\n\nIf more than one workspace is open, and this is enabled for any workspace, we apply it for all open workspaces.',

      mcp: 'Preferences that control the built-in MCP server',
      'mcp.enabled':
        'Do we automatically launch the MCP server on language server startup? If enabled in one workspace, enabled for all.',
      'mcp.port':
        'What port does the MCP server start on? Requires a VSCode restart to take effect. If there is more than one configured port across open workspaces, we use the first value we find. This is printed to the logs when the extension starts.\n\nIf you change this value, make sure that your MCP server configuration in VSCode is also updated to match.',

      notebooks:
        'Preferences that control notebook user experience for IDL Notebooks',
      'notebooks.embedGraphics':
        "Are graphics embedded as output within each cell?\n\nIf you have open notebooks, you'll need to stop IDL and then re-run cells for changes to take effect.",
      'notebooks.quietMode':
        'When enabled, automatically sets `!quiet` to a value of `1` to suppress too much output from IDL and keep notebook cell outputs cleaner.',
      // 'dontAsk.toInitConfig':
      //   'Don\'t ever ask to create an "idl.json" file for any open workspaces',
      // 'dontAsk.toInitConfigForTheseFolders':
      //   'Don\'t ask to create an "idl.json" file at the root level for these folders',

      problems: 'Preferences that control how problems are reported',
      'problems.excludeProblemsForPath':
        "Specify folders that you don't want to report problems for.  Add a '+' before the folder to also exclude subdirectories from problem reporting.",

      'problems.ignoreProblems':
        'Specify the problem code to ignore and not report to Visual Studio Code',
      'problems.includeProblemsFromIDLPackages':
        'Report problems for all files where we find "idl_packages" in the path. This permits problem reporting from external libraries. If this is set in any open workspace, it applies to all of them.\n\nImportant note: VSCode may require a restart for changes to take effect.',
      'problems.includeProblemsFromIDLPath':
        "Report problems for all files on IDL's path. This permits problem reporting for any file that is found on the IDL Path preference. If this is set in any open workspace, it applies to all of them.\n\nImportant note: VSCode may require a restart for changes to take effect.",
      'problems.reportDocsProblems':
        'Do we report problems for user documentation? If disabled, no problems are reported regarding documentation. Alternatively, you can disable problems one-by-one using `ignoreProblems`.\n\nImportant note: If this is disabled for one open workspace, it is disabled for all.\n\nImportant note: VSCode may require a restart for changes to take effect.',
      'problems.reportProblems':
        'Do we report problems found when analyzing your code? If disabled in one workspace, applies to all.',
    },
    enumDescriptions: {
      formatting: {
        eol: {
          crlf: '(NOT Recommended) Windows-style carriage-return-new-line ("crlf")',
          lf: '(Recommended) Line feed character at line end',
        },
        style: {
          arrow: 'Use "->" when invoking a function or procedure method',
          camel: 'Use camel case (i.e. "camelCase")',
          dot: 'Use "." when invoking a function or procedure method',
          double: 'Use double quotes for string expressions',
          lower: 'Use lower case (i.e. "LOWER")',
          match: 'Match case of definition',
          none: 'Apply no formatting',
          pascal: 'Use pascal case (i.e. "PascalCase")',
          single: 'Use single quotes for string expressions',
          upper: 'Use upper case (i.e. "UPPER")',
        },
      },
      workspace: {
        append:
          "(Recommended) Add workspace folders at the beginning of IDL's search path",
        prepend:
          "(NOT Recommended) Add workspace folders at the end of IDL's search path",
      },
    },
    idlDir: {
      notFound: 'IDL directory not found or specified by user, configure?',
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
        hangingIndent:
          'Do we use hanging indentation for multi-line statements?\n\nFor multi-line statements this means that the first line begins at the standard indentation level and all subsequent lines are indented further to align with a syntactic element (e.g., after an opening parenthesis), rather than using a uniform block indent.\n\nThis affect routine names, function calls, procedure calls, arrays, structures, and parentheses.',
        maxIndent:
          'Maximum indent size (number of spaces) that we will insert when auto-indenting your code during formatting',
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
        routineMethods:
          'When we encounter a known routine method (function methods and procedure methods), how do we format it with respect to the definition?',
        routines:
          'When we encounter a known routine (functions and procedures), how do we format it with respect to the definition',
        structureNames:
          'When we have a known named structure, how do we format the name?',
        systemVariables: 'Case formatting for system variables',
      },
      'IDL.history': {
        enabled: 'Do we track session history or not?',
        fileName:
          'The base name of the file that contains the session history. This file will be created in the folder specified above.',
        folder: 'The folder that we write our session history to',
        maxSize:
          'The maximum file size (MB) for the history file. On startup, if the log file is larger than this size, it is truncated. Otherwise we append.',
        truncateOnStartup:
          'When IDL starts, do we always clear our session history file and start fresh?',
      },
    },
    reloadWindow:
      'IDL configuration has changed, reload window for changes to take effect?',
    titles: {
      developer: 'Developer',
      documentation: 'Documentation',
      formatting: 'Formatting',
      general: 'General',
      idl: 'IDL',
      languageServer: 'Language Server',
      mcp: 'MCP Server',
      notebooks: 'Notebooks',
      problems: 'Problem Reporting',
      questions: 'Questions',
      root: 'IDL for VSCode',
    },
  },
  debugger: {
    adapter: {
      breakpointSetFailed: 'Error setting breakpoints for file',
      crashed: 'IDL crashed or was stopped by the user :(',
      failedStart: 'Failed to start IDL, message:',
      noIDLDir: 'The IDL directory has not been configured, cannot start',
      noPauseOnWindows: 'Pause is not currently supported on Windows platforms',
      noRoutineFound:
        'No main level program, function, or procedure found to run',
      nothingToEdit: 'No matching file found',
      previewWarning:
        '\n-----------------------------\nRunning IDL from within VSCode is not fully implemented yet.\nMost things should work but you may encounter a few issues.\nIn particular, the "Pause" button does not work on Windows, and you may occasionally see some internal output in the debug console.\n-----------------------------\n',
      promiseResolveError:
        'Error resolving promise for executing IDL statement',
      restart: 'Restarting IDL!',
      returning: 'File compiled while active, returning...',
      scopeParseError: 'Error getting scope information from IDL output',
      start: 'Launching IDL!',
      stop: 'Stopping IDL session',
      syntaxError:
        'IDL detected a syntax error on this line when compiling your code',
      syntaxErrorsFound:
        'Syntax errors detected in your code, see above for more details',
    },
    commandErrors: {
      compileFile: 'Error compiling file. Likely syntax errors in the code.',
      idlHasNotStarted: 'IDL has not started yet',
      idlStopped:
        'The IDL process ran, but likely stopped somewhere, meaning that the code did not finish executing and may have runtime errors that need to be fixed',
      noProFile: 'No PRO file in VSCode to run or compile',
      noRoutineFound: 'No routine in file to run',
      runFile: '',
      syntaxErrors: 'Syntax errors detected in file',
    },
    errors: {
      addHistory:
        'Error while adding content to IDL history file. Does the location have write permissions?',
      breakpointLocations: 'Error while handling "breakpointLocations" request',
      cancel: 'Error while handling "cancel" request',
      configDone: 'Error while handling "configurationDone" request',
      continue: 'Error while handling "continue" request',
      createHistory:
        'Error while creating or truncating history file. Does the folder have write permissions?',
      evaluate: 'Error while handling "evaluate" request',
      idlDetails:
        'Error getting information about IDL (version, directory, etc.)',
      launch: 'Error while handling "launch" request',
      next: 'Error while handling "next" request',
      pause: 'Error while handling "pause" request',
      scopes: 'Error while handling "scopes" request',
      setBreakpoint: 'Error while handling "setBreakpoint" request',
      stackTrace: 'Error while handling "stackTrace" request',
      stepIn: 'Error while handling "stepIn" request',
      stepOut: 'Error while handling "stepOut" request',
      terminate: 'Error while handling "terminate" request',
      threads: 'Error while handling "threads" request',
      unableToLicenseIDL:
        'Unable to license IDL, check the License Manager and try again',
      variables: 'Error while handling "variables" request',
    },
    idl: {
      alreadyStarted: 'IDL has already been started in the debug console',
      description:
        'Start a new, interactive session of IDL with the ability to compile + run files and reset the session, like the IDL Workbench.',
      existingSessionFound:
        'An existing debug session is running that is not IDL. Please stop it before starting IDL',
      idlNotConfigured:
        'IDL has not been properly configured. Please make sure to set the IDL directory in the IDL for VSCode settings. If IDL is installed, it is not in one of the default locations and needs to be specified.',
      label: 'IDL: Launch',
      name: 'Launch IDL',
      pleaseStart: 'Please start a session of IDL',
      startProfiling: 'Starting profiling',
      stopProfiling: 'Stopped profiling',
    },
    logs: {
      buttonCallbackError: 'Error responding to dialog button callback',
      debugHistory: 'IDL: Session History',
      host: 'IDL: Extension Host',
      specifyIDLLocation: 'Specify IDL Location',
      viewFile: 'View File',
      viewLogs: 'View Logs',
    },
  },
  docs: {
    hover: {
      params: {
        direction: 'Parameter direction',
        false: 'false',
        private: 'Private',
        required: 'Parameter is required',
        self: 'A reference to our object class',
        true: 'true',
        typeParam: 'Parameter data type',
        typeProp: 'Property data type',
      },
    },
    placeholder: {
      params: 'Placeholder docs for argument, keyword, or property',
    },
  },
  envi: {
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
    openerText: 'ENVI should attempt to open the image shortly, please wait.',
    openerTitle: 'ENVI File Opener',
    task: {
      enviNotStarted: 'ENVI has not been started yet or is in a bad state.',
      executeError:
        'Error while running the task, see the IDL console for more details',
      unknownParam:
        'Unknown ENVI Task parameter detected. Are the input parameters right? The extension uses parameters from the latest ENVI version, so there may be a mismatch if you are not on the latest version.',
      unknownTask:
        'Unknown ENVI Task (or we cannot find the code for a task). See debug console for more details.',
    },
    taskText: 'Attempting to run task in ENVI',
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
  hoverHelp: HOVER_HELP_EN,
  icons: {
    label: 'IDL (Customized Visual Studio Code)',
  },
  idl: {
    tree: {
      children: {
        codeActions: {
          addDocs: {
            description: 'for file',
            name: 'Add/Update Routine Docs',
          },
          formatFile: {
            description: '',
            name: 'Format PRO Code or Task File',
          },
          generateTask: {
            description: '',
            name: 'Generate ENVI or IDL Task',
          },
          initializeConfig: {
            description: 'for an open workspace',
            name: 'Initialize "idl.json"',
          },
        },
        debugging: {
          compile: {
            description: 'PRO file',
            name: 'Compile',
          },
          execute: {
            description: 'PRO file as batch file',
            name: 'Execute',
          },
          reset: {
            description: 'the IDL session',
            name: 'Reset',
          },
          run: {
            description: 'PRO file',
            name: 'Run',
          },
          start: {
            description: 'a session of IDL',
            name: 'Start',
          },
          startProfiling: {
            description: 'the IDL session',
            name: 'Start Profiling',
          },
          stopProfiling: {
            description: 'the IDL session',
            name: 'Stop Profiling',
          },
        },
        notebooks: {
          formatNotebooks: {
            description: '',
            name: 'Format Notebook Cells',
          },
          newNotebook: {
            description: '',
            name: 'New IDL Notebook',
          },
          notebookToPDF: {
            description: '',
            name: 'Convert IDL Notebook to PDF',
          },
          notebookToProCode: {
            description: '',
            name: 'Convert IDL Notebook to PRO Code',
          },
          openENVIExample: {
            description: '',
            name: 'Open ENVI Notebook Example',
          },
          openIDLExample: {
            description: '',
            name: 'Open IDL Notebook Example',
          },
          resetExampleNotebooks: {
            description: '',
            name: 'Reset Example Notebooks',
          },
          stopAllNotebookKernels: {
            description: '',
            name: 'Stop all IDL Notebook Kernels',
          },
        },
        quickAccess: {
          fileBug: {
            description: 'a bug report for the extension',
            name: 'File',
          },
          openDocs: {
            description: '',
            name: 'Open Extension Docs',
          },
          openWebview: {
            description: '',
            name: 'Open Welcome Page',
          },
          pickIDL: {
            description: '(where "idl.exe" or "idl" lives)',
            name: 'Specify IDL directory',
          },
          viewLogs: {
            description: '',
            name: 'View Extension Logs',
          },
          viewSettings: {
            description: '',
            name: 'Open Extension Settings',
          },
        },
        terminal: {
          compileTerminal: {
            description: 'PRO file in terminal',
            name: 'Compile',
          },
          continueTerminal: {
            description: 'execution in terminal',
            name: 'Continue',
          },
          executeTerminal: {
            description: 'PRO file as batch file in terminal',
            name: 'Execute',
          },
          pauseTerminal: {
            description: 'the IDL terminal process',
            name: 'Pause',
          },
          resetTerminal: {
            description: 'the IDL session in the terminal',
            name: 'Reset',
          },
          runTerminal: {
            description: 'PRO file in terminal',
            name: 'Run',
          },
          startTerminal: {
            description: 'IDL in a terminal window',
            name: 'Start',
          },
          stepInTerminal: {
            description: 'routine call in terminal',
            name: 'Step Into',
          },
          stepOutTerminal: {
            description: 'of routine call in terminal',
            name: 'Step Out',
          },
          stepOverTerminal: {
            description: 'routine call in terminal',
            name: 'Step Over',
          },
        },
      },
      clickHandlerError: 'Error while handling IDL tree click event',
      name: 'Actions and Commands',
      parents: {
        codeActions: 'Code',
        debugging: 'IDL',
        notebooks: 'Notebooks',
        quickAccess: 'Quick Access',
        terminal: 'Terminal',
      },
      selectionChangeError: 'Error while handling selection change in IDL tree',
    },
  },
  languages: {
    idl: 'IDL',
    idlLog: 'IDL Log File',
    idlMdInject: 'IDL Markdown Code Blocks',
    idlNotebook: 'IDL Notebook',
  },
  logger: {
    defaultErrorMessage:
      'The IDL extension had an error :( See output/debug console for details',
  },
  lsp: {
    codeActions: {
      disableFile: 'Disable "PROBLEM" for file or cell',
      disableLine: 'Disable "PROBLEM" for line',
      disableUser: 'Disable "PROBLEM" in user settings',
      disableWorkspace: 'Disable "PROBLEM" for workspace',
      viewProblemCodeDocs: 'Learn more about "PROBLEM"',
      viewProblemConfigDocs: 'Learn how to configure reported problems',
    },
    config: {
      failedParse: 'Problem parsing IDL config file',
    },
    errors: {
      closed:
        'The IDL Language Server crashed. This is likely a memory issue, please see docs for more information and workarounds.',
      connection: 'Failed to send/receive message with the IDL Language Server',
      mcpStartup:
        'Error reported while starting the MCP server and registering tools',
      start: 'Failed to start the IDL Language Server',
      startingServer:
        'Error while starting local server (MCP or documentation), is the port already in use? See logs for more details.',
      unhandled: 'An unknown error ocurred within the IDL Language Server',
    },
    events: {
      onAddDocs: 'Problem adding/updating routine docs for file',
      onCodeAction: 'Error responding to code action event',
      onCompletion: 'Problem resolving auto complete',
      onDefinition: 'Problem finding token definition',
      onDidChangeContent: 'Problem responding to content change event',
      onDidChangeNotebook: 'Error responding to notebook change event',
      onDidChangeWorkspaceFolders:
        'Problem responding to workspace folder change event',
      onDidClose: 'Problem when closing file',
      onDidCloseNotebook: 'Error responding to notebook close event',
      onDidOpen: 'Problem when opening file',
      onDidOpenNotebook: 'Error responding to notebook open event',
      onDidRename: 'Problem responding to file rename event',
      onDocumentFormatting: 'Problem formatting file',
      onDocumentFormattingProblemCode:
        'Unable to format code due to syntax error or problem in file',
      onDocumentSymbol: 'Problem responding to document symbol event',
      onGenerateTask: 'Problem while creating task file',
      onHover: 'Problem resolving hover help',
      onInitWorkspaceConfig: 'Problem while initializing workspace config',
      onMigrateCode: 'Error while migrating code',
      onMigrateCodeProblemCode:
        'Unable to format code due to syntax error or problem in file',
      onNotebookToProCode: 'Error converting notebook to PRO code',
      onPrepareIDLCode: 'Error while preparing IDL code for execution',
      onPrepareNotebookCell: 'Error while preparing notebook cell to run',
      onRetrieveDocs: 'Error responding to docs retrieval event',
      onSemanticHighlighting: 'Problem resolving semantic tokens',
      onWorkspaceConfig: 'Problem responding to workspace config event',
      onWorkspaceFormatting: 'Error while formatting files in workspace',
      unhandledWorkerMessage:
        "Unknown error from one of the the language server's worker threads",
    },
    index: {
      failedChangeDetection:
        'Failed to run change detection and post-process file(s)',
      failedIndexWorkspace: 'Failed to index workspace folder(s)',
      failedParse: 'Failed to parse PRO file',
      failedParseNotebook: 'Failed to parse IDL notebook file',
      failedPostProcess: 'Failed to post-process PRO file (s)',
    },
    progress: {
      formatWorkspace: 'Formatting workspace...',
    },
    types: {
      staticReference: 'A static reference to the class',
      unknown: {
        function: 'Unknown function',
        functionMethod: 'Unknown function method',
        keyword: 'Unknown keyword',
        procedure: 'Unknown procedure',
        procedureMethod: 'Unknown procedure method',
        property: 'Unknown property',
        sysVar: 'Unknown system variable',
      },
    },
  },
  mcp: {
    errors: {
      failedCodePrepare:
        'Failed to prepare IDL code to run, see IDL logs for more details',
      failedStart:
        'Failed to start MCP server. Is the port available? If not, this can be changed in the extension settings.',
      failedProgress: 'Failed to handle progress message to MCP server',
    },
  },
  notebooks: {
    controller: 'IDL',
    errors: {
      checkingGraphics: 'Error while trying to retrieve any graphics to embed',
      crashed:
        'IDL crashed or was stopped by the user and needs to be restarted',
      didntStartRight:
        "The notebook session of IDL didn't start or reset right. Not everything may function as expected.",
      errorLoadOutputs:
        'Error while loading outputs from notebook cells, please re-run cells to generate outputs',
      errorParsing: 'Unable to parse notebook file',
      errorSaving: 'Unknown error while saving notebook file',
      failedCodePrepare:
        'Unknown problem while preparing a notebook cell to run. Please save notebooks to disk, or file a bug if this persists.',
      failedExecute: 'Failed to execute notebook cells',
      failedStart: 'The notebook session of IDL failed to start',
      failedToHandleProgress:
        'Unknown problem trying to embed progress messages in a notebook cell',
      handlingMessageFromRenderer:
        'Error while responding to message from notebook renderer',
      onDidCloseNotebookDocument:
        'Error while cleaning up after closed IDL Notebook',
    },
    notifications: {
      enviCellDetected: [
        'ENVI startup detected in notebook cell which disables the embedding of graphics for this cell.',
        '',
        'If you have graphics to embed, you should make a dedicated cell to start ENVI and embed graphics afterwards.',
        '',
      ].join('\n'),
      idlNotStarted:
        'IDL has not started for notebooks. It automatically starts when you run a code cell.',
      includeAllCells:
        'Include all cells when converting to PRO code? Non-IDL cells will turn into comments.',
      markdownPDFWaitForInstall:
        'Wait for Markdown PDF to install chromium and then try again',
      needMarkdownPDF:
        'Converting a notebook to a PDF requires the extension "Markdown PDF", install and proceed?',
      noExamplesFoundInDocs:
        'No examples found in documentation to create notebook from',
      notValidIDLVersion:
        'IDL Notebooks require IDL 8.8.0 or newer in order to run',
      resettingIDL: 'Resetting IDL',
      saveNotebookFirst:
        'You need to save your notebook to disk before converting',
      startedIDLKernel: 'Started IDL {VERSION} for notebook!',
      startingIDL: 'Starting IDL, please wait...',
      stoppingIDL: 'Stopping IDL',
    },
    renderer: 'IDL: Notebook Renderer',
    title: 'IDL: Notebook',
  },
  notifications: {
    changeFormatter: 'Set extension as default formatter for IDL code?',
    changeIcons: 'Switch to IDL file icons? Adds new icons for PRO code.',
    configure: 'Configure',
    configureMCP:
      'Configure GitHub Copilot to use the IDL for VSCode MCP server?',
    dontAsk: "Don't ask again",
    formatOnSave:
      'Format PRO code automatically on file save? This will not affect other languages and will be limited to PRO files.',
    initIDLJSON:
      'No "idl.json" file found at root level of workspace folder, create? Workspace:',
    lostIDLConnection: 'Lost connection to IDL',
    no: 'No',
    noIDLDirFound: 'IDL directory not found or configured, cannot start IDL',
    noIDLNotebook: 'No active IDL Notebook in VSCode',
    noProCode: 'No active PRO file in VSCode',
    noProCodeOrTaskFile: 'No active PRO file or Task file in VSCode',
    openDocs: 'Open official docs for IDL for VSCode?',
    reportBug: 'Report Bug',
    start: 'Start?',
    viewDocs: 'View docs',
    yes: 'Yes',
  },
  packageJSON: {
    description:
      'IDL syntax highlighting, code snippets, running IDL programs, notebooks, and much more!',
    displayName: 'IDL for VSCode',
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
      '77': 'No matching structure/object/class definition for structure named #SNAME. If this is a structure definition, please place it in a procedure that ends in "__define" to be properly detected and follow IDL standards.',
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
      '107': 'Attempting to disable unknown problem',
      '108':
        'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
      '109':
        'Expression will automatically be printed during notebook cell execution',
    },
  },
  statusBar: {
    crashed: 'Crashed',
    indexing: 'Indexing code',
    problemStarting: 'Unable to start',
    ready: 'Ready!',
    running: 'Running...',
    startAgainQuestion: 'Start again?',
    starting: 'Starting...',
    startQuestion: 'Start?',
    stopped: 'Stopped',
  },
  tasks: {
    parsing: {
      errors: {
        failedParse:
          'Unable to parse task file. Either JSON syntax error or the task file does not match our schema. Please open in VSCode or see logs for details',
        fileNotFound: 'Specified task file was not found',
        invalidJSON:
          'Task file is not valid JSON and may have JSON syntax errors',
        invalidTaskFile:
          'Invalid task file. Please open in VSCode or see logs for details',
      },
    },
  },
  terminal: {
    alreadyStarted: 'IDL has already been started in the terminal',
    pleaseStart: 'Please start a terminal session of IDL',
  },
  themes: {
    magmatic: 'Magmatic IDL',
    neon: 'Neon IDL',
    new: 'Novus IDL',
    retro: 'Retro IDL',
    stellar: 'Stellar IDL',
  },
  usageMetrics: {
    learnMore: 'Learn more',
    sendingUsageMetric: 'Sending usage metric',
  },
  webview: {
    content: {
      notFound: 'IDL webview content not found',
    },
    error: {
      unhandledError: 'Unhandled error from IDL Webview',
    },
    home: {
      title: 'No content to show',
    },
    profiler: {
      filter: 'Routine name filter',
      noShow: 'No profiling results to show.',
      table: {
        hits: 'Hits',
        linesRun: 'Lines Run',
        linesTotal: 'Lines Total',
        routine: 'Routine',
        timeSelf: 'Time Self (ms)',
        timeTotal: 'Time Total (ms)',
      },
      title: 'IDL Profiler View',
    },
    title: 'IDL',
  },
};
