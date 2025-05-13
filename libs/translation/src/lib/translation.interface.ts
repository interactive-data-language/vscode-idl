/* eslint-disable @nx/enforce-module-boundaries */
import { ICodeStyle, ITrueBaseAssemblerOptions } from '@idl/assembling/config';
import { ProblemCodeLookup } from '@idl/types/problem-codes';
import {
  IDLExtensionsConfigKeys,
  IDLHistoryConfig,
} from '@idl/vscode/extension-config';

/**
 * Translations for commands and paired errors for commands
 */
export interface ICommandTranslation {
  /** General commands for the client */
  client: {
    /** Text for filing a bug */
    fileABug: string;
    /** View output logs */
    viewLogs: string;
    /** View preferences */
    viewSettings: string;
  };
  /** Commands for working with code */
  code: {
    /** Add docs to file */
    addDocsToFile: string;
    /** Command to disable problem as setting */
    disableProblemSetting: string;
    /** problem we are fixing */
    fixProblem: string;
    /** Format file */
    formatFile: string;
    /** Format all code in a workspace */
    formatWorkspace: string;
    /** Generates a task file */
    generateTask: string;
    /** Initialize IDL config in workspace */
    initializeConfig: string;
    /** Migrate PRO code to the ENVI DL 3.0 API */
    migrateToDL30API: string;
  };
  /** Translations for configuration */
  config: {
    /** Global IDL directory */
    specifyIDLDirectory: string;
    /** Workspace IDL directory */
    specifyIDLDirectoryWorkspace: string;
  };
  /** Debug commands */
  debug: {
    compileFile: string;
    executeBatchFile: string;
    resetIDL: string;
    runFile: string;
    startIDL: string;
    startProfiling: string;
    stopProfiling: string;
  };
  /** Commands for opening docs */
  docs: {
    /** Opening the docs */
    open: string;
    /** Resolve link user clicked on from hover help */
    openLink: string;
  };
  /** Commands for notebooks */
  notebooks: {
    /** Convert notebook to markdown */
    convertToMarkdown: string;
    /** Convert notebook to PDF */
    convertToPDF: string;
    /** Convert help to notebook */
    helpAsNotebook: string;
    /** Create a new notebook */
    newNotebook: string;
    /** Convert a notebook to PRO code */
    notebookToProCode: string;
    /** Open ENVI example notebook */
    openENVIExample: string;
    /** Open IDL example notebook */
    openIDLExample: string;
    /** Reset notebook session */
    resetIDLKernel: string;
    /** Reset example notebooks */
    resetNotebookExamples: string;
    /** Stop all notebooks sessions */
    stopAllIDLKernels: string;
    /** Stop notebook session */
    stopIDLKernel: string;
  };
  /** Terminal commands */
  terminal: {
    compileFile: string;
    continueExecution: string;
    executeBatchFile: string;
    pauseExecution: string;
    resetIDL: string;
    runFile: string;
    startIDL: string;
    stepIn: string;
    stepOut: string;
    stepOver: string;
  };
  /** Commands for the webview */
  webview: {
    /** Open the webview */
    start: string;
  };
}

/**
 * Custom hover help for translations
 */
export interface IHoverHelpTranslations {
  /** Hover help for control statements */
  control: {
    break: string;
    case: string;
    continue: string;
    else: string;
    for: string;
    foreach: string;
    function: string;
    if: string;
    on_ioerror: string;
    pro: string;
    switch: string;
    while: string;
  };
}

/**
 * Data structure for translation of items in the sidebar tree view
 */
export interface ITreeInformation {
  /** Description of the tree item */
  description: string;
  /** Name of the item in the tree */
  name: string;
}

/**
 * Reverses key-values to strings
 */
type ReverseMapForStrings<T extends Record<keyof T, keyof any>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? string : never;
  }[keyof T];
};

/**
 * Map keys to strings
 */
type KeysOfToStrings<T> = {
  [P in keyof T]: string;
};

/**
 * Translations for our configuration
 */
export interface IConfigTranslation {
  /** Descriptions for our config items */
  descriptions: ReverseMapForStrings<IDLExtensionsConfigKeys>;
  /** Descriptions for choice list items */
  enumDescriptions: {
    /** Formatting preference */
    formatting: {
      /** Line feed character */
      eol: {
        crlf: string;
        lf: string;
      };
      /** Styles */
      style: {
        /** Methods */
        arrow: string;
        /** Case */
        camel: string;
        /** Methods */
        dot: string;
        /** Quotes */
        double: string;
        /** Case */
        lower: string;
        /** Case */
        match: string;
        /** Do nothing */
        none: string;
        /** Case */
        pascal: string;
        /** Quotes */
        single: string;
        /** Case */
        upper: string;
      };
    };
    /** Workspace preference */
    workspace: {
      append: string;
      prepend: string;
    };
  };
  idlDir: {
    notFound: string;
  };
  // KeysOfToLiterals<IDLExtensionsConfigKeys>;
  properties: {
    /** Descriptions for history properties */
    'IDL.history': KeysOfToStrings<IDLHistoryConfig>;
    /** Top-level formatting descriptions */
    'code.formatting': KeysOfToStrings<ITrueBaseAssemblerOptions>;
    /** Descriptions for styles */
    'code.formattingStyle': KeysOfToStrings<ICodeStyle>;
  };
  /** When we need to ask about reloading the window */
  reloadWindow: string;
  /** Titles for configuration tabs */
  titles: {
    /** Internal developer settings */
    developer: string;
    /** Documentation settings */
    documentation: string;
    /** Code formatting */
    formatting: string;
    /** general preferences */
    general: string;
    /** IDL configuration */
    idl: string;
    /** Language server settings */
    languageServer: string;
    /** Model Context Protocol */
    mcp: string;
    /** Notebook settings */
    notebooks: string;
    /** problem reporting */
    problems: string;
    /** Questions asked to the user */
    questions: string;
    /** Root/first level */
    root: string;
  };
}

/**
 * Strictly typed translation information. Interface is used for the actual translations
 * which are constants in typescript and use this to make sure they are correct.
 */
export interface ITranslation {
  /** Translations for text from the assembler */
  assembling: {
    /** Config file for assembler */
    config: {
      /** Errors related to the assembler config file */
      errors: {
        /** Specified config file does not exist */
        fileNotFound: string;
        /** When config file does not match our schema */
        invalidConfigFile: string;
        /** Config file is not valid JSON */
        invalidJSON: string;
        /** When the config file should be updated to the latest version */
        shouldUpdate: string;
      };
    };
  };
  /** Auto-complete text */
  autoComplete: {
    /** Details that we show for tokens */
    detail: {
      /** ENVI Tasks */
      enviTask: string;
      /** Internal routine */
      function: string;
      /** Function methods */
      functionMethod: string;
      /** IDL Tasks */
      idltask: string;
      /** Keywords */
      keyword: string;
      /** User routine */
      procedure: string;
      /** Procedure methods */
      procedureMethod: string;
      /** Structure properties */
      property: string;
      /** Structure name */
      structure: string;
      /** System variables */
      systemVariable: string;
      /** user variables */
      variable: string;
    };
  };
  /** Misc translations for the VSCode client */
  client: {
    /** Misc error reports */
    errors: {
      /** Unknown error ocurred and was reported via console.error */
      unhandled: string;
    };
  };
  /** Translations related to commands */
  commands: {
    /** Errors we display when commands have problems */
    errors: ICommandTranslation;
    /** Translations for the IDL commands, show in the UI of VSCode */
    idl: ICommandTranslation;
    /**
     * Notifications related to running commands for dialogs that appear
     *
     * This is because some commands have extra levels of user interaction and we
     * need a place for that text information to live
     */
    notifications: {
      /** Messages when formatting the workspace */
      formatWorkspace: {
        /** When there are files we failed to format */
        notAllFilesFormatted: string;
        /** Title of the dialog for picking workspace to format files in */
        pickWorkspace: string;
      };
      initConfig: {
        /** Message when no workspace folders are open */
        allWorkspacesHaveConfig: string;
        /** Message when a config file has been created */
        configFileCreated: string;
        /** Title of the dialog for picking workspace folders to initialize config files for */
        dialogTitle: string;
        /** Don't ask again for folder */
        dontAsk: string;
        /** Never ask */
        neverAsk: string;
        /** Message when no workspace folders are open */
        noWorkspaceOpen: string;
      };
      /** Alerts for task file initializations */
      initTask: {
        /** When we create a task */
        created: string;
        /** Title of the dialog for picking workspace folders to initialize config files for */
        dialogTitle: string;
      };
    };
  };
  /** Translations related to configuring the extension */
  configuration: IConfigTranslation;
  /** Translations related to the debugger */
  debugger: {
    adapter: {
      breakpointSetFailed: string;
      crashed: string;
      failedStart: string;
      noIDLDir: string;
      /** Message to display when users try to pause IDL on windows */
      noPauseOnWindows: string;
      /** Message when we try to run a file, but dont find anything */
      noRoutineFound: string;
      /** When no file is found from .edit */
      nothingToEdit: string;
      /** Warning text for the debug console to let users know it is a preview feature */
      previewWarning: string;
      promiseResolveError: string;
      restart: string;
      returning: string;
      scopeParseError: string;
      start: string;
      stop: string;
      /** Syntax error */
      syntaxError: string;
      /** When we detect syntax errors trying to run code */
      syntaxErrorsFound: string;
    };
    /** Text descriptions of debugging commands that add context to why something failed */
    commandErrors: {
      compileFile: string;
      noProFile: string;
      noRoutineFound: string;
      idlHasNotStarted: string;
      idlStopped: string;
      runFile: string;
      syntaxErrors: string;
    };
    /** Error translations */
    errors: {
      /** Problem adding history */
      addHistory: string;
      breakpointLocations: string;
      cancel: string;
      configDone: string;
      continue: string;
      /** Problem creating history file */
      createHistory: string;
      evaluate: string;
      idlDetails: string;
      launch: string;
      next: string;
      pause: string;
      scopes: string;
      setBreakpoint: string;
      stackTrace: string;
      stepIn: string;
      stepOut: string;
      terminate: string;
      threads: string;
      unableToLicenseIDL: string;
      variables: string;
    };
    idl: {
      alreadyStarted: string;
      description: string;
      existingSessionFound: string;
      label: string;
      name: string;
      idlNotConfigured: string;
      pleaseStart: string;
      startProfiling: string;
      stopProfiling: string;
    };
    logs: {
      /** If we have an error, text we show */
      buttonCallbackError: string;
      /** IDl extension debug log */
      debugHistory: string;
      /** IDl extension log */
      host: string;
      /** Button to configure IDL location */
      specifyIDLLocation: string;
      /** File to view button */
      viewFile: string;
      /** Logs to view button */
      viewLogs: string;
    };
  };
  /** Translations for docs */
  docs: {
    /** Hover help related */
    hover: {
      /** hover help parameters */
      params: {
        /** Direction string */
        direction: string;
        /** Text for false */
        false: string;
        /** Text for private part of docs */
        private: string;
        /** Required string */
        required: string;
        /** Text for the reference to our object class */
        self: string;
        /** Text for true */
        true: string;
        /** Data type string for parameter */
        typeParam: string;
        /** Data type string for property */
        typeProp: string;
      };
    };
    /** For non-existent docs, text that should be used as a placeholder with AutoDoc */
    placeholder: {
      /** Placeholder docs when we don't have any for parameters */
      params: string;
    };
  };
  /** Translations for ENVI helpers/routines/view */
  envi: {
    open: {
      /** Error if we have trouble running our command */
      commandError: string;
      /** If there is a problem, default error message if we have no case information */
      defaultError: string;
      /** Error accessing ENVI */
      enviError: string;
      /** ENVI is running already, but no UI */
      noUI: string;
      /** Error when executing ENVI::OpenRaster */
      openError: string;
    };
    /** Test to be displayed in the webview for opening files in ENVI */
    openerText: string;
    /** Title for our custom editor window */
    openerTitle: string;
  };
  /** Messages from generators */
  generators: {
    /** errors from generators */
    errors: {
      /** Errors from task generation */
      tasks: {
        alreadyExists: string;
        noProcedure: string;
      };
    };
  };
  /** translations for hover help */
  hoverHelp: IHoverHelpTranslations;
  /** Icon theme related translations */
  icons: {
    /** Label for the icon theme */
    label: string;
  };
  /** Translations related to the IDL tree view */
  idl: {
    tree: {
      /** Children of any of the sidebars, should have the command as the key name */
      children: {
        codeActions: {
          /** Only add docs to file */
          addDocs: ITreeInformation;
          /** Format without docs */
          formatFile: ITreeInformation;
          /** Generate task */
          generateTask: ITreeInformation;
          /** Init config for workspace */
          initializeConfig: ITreeInformation;
        };
        /** Commands for running IDL */
        debugging: {
          compile: ITreeInformation;
          execute: ITreeInformation;
          reset: ITreeInformation;
          run: ITreeInformation;
          start: ITreeInformation;
          startProfiling: ITreeInformation;
          stopProfiling: ITreeInformation;
        };
        notebooks: {
          /** Format notebook */
          formatNotebooks: ITreeInformation;
          /** Make a new notebook document */
          newNotebook: ITreeInformation;
          /** Convert notebook to PDF */
          notebookToPDF: ITreeInformation;
          /** Convert notebook to PRO code */
          notebookToProCode: ITreeInformation;
          /** Format notebook */
          openENVIExample: ITreeInformation;
          /** Format notebook */
          openIDLExample: ITreeInformation;
          /** Reset example notebooks */
          resetExampleNotebooks: ITreeInformation;
          /** Stop all notebook kernels */
          stopAllNotebookKernels: ITreeInformation;
        };
        /** Additional actions */
        quickAccess: {
          fileBug: ITreeInformation;
          openDocs: ITreeInformation;
          openWebview: ITreeInformation;
          pickIDL: ITreeInformation;
          viewLogs: ITreeInformation;
          viewSettings: ITreeInformation;
        };
        /** Deprecated, but tree entries for IDL terminals */
        terminal: {
          compileTerminal: ITreeInformation;
          continueTerminal: ITreeInformation;
          executeTerminal: ITreeInformation;
          pauseTerminal: ITreeInformation;
          resetTerminal: ITreeInformation;
          runTerminal: ITreeInformation;
          startTerminal: ITreeInformation;
          stepInTerminal: ITreeInformation;
          stepOutTerminal: ITreeInformation;
          stepOverTerminal: ITreeInformation;
        };
      };
      clickHandlerError: string;
      name: string;
      /** Parent tabs/sections in the sidebar */
      parents: {
        codeActions: string;
        debugging: string;
        notebooks: string;
        quickAccess: string;
        terminal: string;
      };
      selectionChangeError: string;
    };
  };
  /** Aliases for language names so they appear nice */
  languages: {
    idl: string;
    idlLog: string;
    idlMdInject: string;
    idlNotebook: string;
  };
  /** Translations related to the logger */
  logger: {
    defaultErrorMessage: string;
  };
  /**
   * Language server messages
   */
  lsp: {
    /** Code action translations */
    codeActions: {
      disableFile: string;
      disableLine: string;
      disableUser: string;
      disableWorkspace: string;
      viewProblemCodeDocs: string;
      viewProblemConfigDocs: string;
    };
    /** Messages for config file */
    config: {
      /** When we fail to parse IDL's config file */
      failedParse: string;
    };
    /** Misc error reports */
    errors: {
      /** When server connection gets closed */
      closed: string;
      /** When we cant start, or the server gets closed */
      connection: string;
      /** Error when starting a server that has a port conflict */
      mcpStartup: string;
      /** Failed to start the language server */
      start: string;
      /** Error when starting a server that has a port conflict */
      startingServer: string;
      /** Unknown error ocurred and was reported via console.error */
      unhandled: string;
    };
    /** Error messages when we fail to respond to these events */
    events: {
      /** Custom event to add docs to open file */
      onAddDocs: string;
      /** Responding to code actions */
      onCodeAction: string;
      /** Auto-complete */
      onCompletion: string;
      /** Go-to definition */
      onDefinition: string;
      /** when workspace folders change */
      onDidChangeContent: string;
      /** notebook changed */
      onDidChangeNotebook: string;
      /** when workspace folders change */
      onDidChangeWorkspaceFolders: string;
      /** Error handling close of documents */
      onDidClose: string;
      /** Notebook closed */
      onDidCloseNotebook: string;
      /** When we open a new file */
      onDidOpen: string;
      /** Opening notebook */
      onDidOpenNotebook: string;
      /** File rename event */
      onDidRename: string;
      /** Error formatting */
      onDocumentFormatting: string;
      /** Unable to format because of syntax error */
      onDocumentFormattingProblemCode: string;
      /** When we ask for outline */
      onDocumentSymbol: string;
      /** Generate/update task */
      onGenerateTask: string;
      /** Hover help */
      onHover: string;
      /** Workspace config init */
      onInitWorkspaceConfig: string;
      /** Problem migrating code */
      onMigrateCode: string;
      /** Unable to migrate code because of error */
      onMigrateCodeProblemCode: string;
      /** Convert notebook to PRO code */
      onNotebookToProCode: string;
      /** Error while preparing IDL code */
      onPrepareIDLCode: string;
      /** Convert notebook cell to code we can execute */
      onPrepareNotebookCell: string;
      /** Retrieving docs */
      onRetrieveDocs: string;
      /** Error for semantic tokens */
      onSemanticHighlighting: string;
      /** Config from client */
      onWorkspaceConfig: string;
      /** Error formatting workspace */
      onWorkspaceFormatting: string;
      /** Unhandled exception within worker thread */
      unhandledWorkerMessage: string;
    };
    /** Messages for indexing files */
    index: {
      /** When change detection fails */
      failedChangeDetection: string;
      /** When we fail to index a workspace */
      failedIndexWorkspace: string;
      /** When we fail to parse PRO code */
      failedParse: string;
      /** Message when we fail to parse a notebook */
      failedParseNotebook: string;
      /** When we fail to post process a parsed file */
      failedPostProcess: string;
    };
    /** Titles for progress messages */
    progress: {
      /** Progress for formatting workspace */
      formatWorkspace: string;
    };
    /** Messages for types */
    types: {
      staticReference: string;
      /** When we encounter unknown things */
      unknown: {
        function: string;
        functionMethod: string;
        keyword: string;
        procedure: string;
        procedureMethod: string;
        property: string;
        sysVar: string;
      };
    };
  };
  /** Translations for MXP */
  mcp: {
    /** MCP error messages */
    errors: {
      /** if we failed to prepare code to run */
      failedCodePrepare: string;
      /** Failed to start the MCP server */
      failedStart: string;
      /** Failed to handle progress messages */
      failedProgress: string;
    };
  };
  /** Translations for notebooks */
  notebooks: {
    /** Name of the notebook controller */
    controller: string;
    /** Errors from notebooks */
    errors: {
      /** Error while trying to get graphics */
      checkingGraphics: string;
      /** IDL crashes while running something in the notebook */
      crashed: string;
      /** Alert users that IDL for notebooks didn't quite start or reset right */
      didntStartRight: string;
      /** When we fail to load outputs */
      errorLoadOutputs: string;
      /** Bad notebook file */
      errorParsing: string;
      /** Error while saving notebook file */
      errorSaving: string;
      /** if we failed to prepare code to run */
      failedCodePrepare: string;
      /** if we failed to execute one or more cells */
      failedExecute: string;
      /** IDL doesn't start in the notebook */
      failedStart: string;
      /** Problem with message from renderer being handled */
      handlingMessageFromRenderer: string;
      /** When we close a notebooks */
      onDidCloseNotebookDocument: string;
    };
    /** Notifications for working with notebooks */
    notifications: {
      /** ENVI notebook cell detected */
      enviCellDetected: string;
      /** When IDL hasnt started */
      idlNotStarted: string;
      /** When converting to PRO file, include all cells? */
      includeAllCells: string;
      /** When we need to wait for install before continuing  */
      markdownPDFWaitForInstall: string;
      /** When we need Markdown PDF to create PDFs */
      needMarkdownPDF: string;
      /** No examples when opening notebook */
      noExamplesFoundInDocs: string;
      /** Notification for when IDL doesnt have the right version */
      notValidIDLVersion: string;
      /** When we reset IDL */
      resettingIDL: string;
      /** When a notebook needs to be saved to disk before we process it */
      saveNotebookFirst: string;
      /** Notification for user when we start the IDL session for a notebook */
      startedIDLKernel: string;
      /** Message that we are starting IDL */
      startingIDL: string;
      /** When we ask to stop IDL */
      stoppingIDL: string;
    };
    /** Title of notebook renderer */
    renderer: string;
    /** Title of notebooks */
    title: string;
  };
  /** Translations related to notifications in dialogs that pop up in VSCode */
  notifications: {
    /** Text that shows to ask if a user wants to change the default formatter for IDL */
    changeFormatter: string;
    /** Text that shows to ask if a user wants to change their icon theme */
    changeIcons: string;
    /** Configure something */
    configure: string;
    /** Text that shows to ask if a user wants to add MCP configuration for GitHUb Copilot */
    configureMCP: string;
    /** Translation to not ask again */
    dontAsk: string;
    /** Text that, after a user changes the default formatter to IDL, asks if they want to format on save */
    formatOnSave: string;
    /** Init "idl.json" question */
    initIDLJSON: string;
    /** When we lose our connection to IDL via websocket */
    lostIDLConnection: string;
    /** Translation for no */
    no: string;
    /** When the IDL directory is not found */
    noIDLDirFound: string;
    /** When we have no IDL notebook in the editor */
    noIDLNotebook: string;
    /** When no PRO code if found in the editor */
    noProCode: string;
    /** No pro code or task file */
    noProCodeOrTaskFile: string;
    /** Do we ask to open docs on startup */
    openDocs: string;
    /** Question to ask if want to report a bug */
    reportBug: string;
    /** Start IDL */
    start: string;
    /** Question to ask if want to view docs file */
    viewDocs: string;
    /** Translation for yes */
    yes: string;
  };
  /** Translations for our main package.json file */
  packageJSON: {
    /** Description for the extension, shown in VSCode when you search for extensions */
    description: string;
    /** Display name for the package, shown in VSCode when you search for extensions */
    displayName: string;
  };
  /** Translations related parsing */
  parsing: {
    /** Text to show users when we have an error appear in their IDL code */
    errors: ProblemCodeLookup;
  };
  /** Translations related to the status bar */
  statusBar: {
    /** When IDL crashes */
    crashed: string;
    /** When we index code */
    indexing: string;
    /** If there is a problems tarting IDL */
    problemStarting: string;
    /** Message when IDL is ready for input */
    ready: string;
    /** When IDL is running a command */
    running: string;
    /** To start IDL after we have started it */
    startAgainQuestion: string;
    /** On first load, prompt user to start IDL */
    startQuestion: string;
    /** Message when IDL is starting */
    starting: string;
    /** After a user has stopped IDL */
    stopped: string;
  };
  /** Translations for working with tasks */
  tasks: {
    /** Task file parsing */
    parsing: {
      /** Errors related to parsing */
      errors: {
        /** Problem parsing task file */
        failedParse: string;
        /** Specified task file does not exist */
        fileNotFound: string;
        /** Task file is not valid JSON */
        invalidJSON: string;
        /** When task file does not match our schema */
        invalidTaskFile: string;
      };
    };
  };
  /** Translations related to the terminal */
  terminal: {
    alreadyStarted: string;
    pleaseStart: string;
  };
  /** Translations related to the theme names */
  themes: {
    /** Magmatic IDL */
    magmatic: string;
    /** Neon IDL */
    neon: string;
    /** Novus (New) IDL */
    new: string;
    /** Retro IDL */
    retro: string;
    /** Stellar IDL theme */
    stellar: string;
  };
  /**
   * Usage metrics
   */
  usageMetrics: {
    /** File to learn more about */
    learnMore: string;
    /** Logging info about our session */
    sendingUsageMetric: string;
  };
  /** Translations related to the webview */
  webview: {
    content: {
      notFound: string;
    };
    error: {
      unhandledError: string;
    };
    home: {
      title: string;
    };
    profiler: {
      filter: string;
      noShow: string;
      table: {
        hits: string;
        linesRun: string;
        linesTotal: string;
        routine: string;
        timeSelf: string;
        timeTotal: string;
      };
      title: string;
    };
    title: string;
  };
}
