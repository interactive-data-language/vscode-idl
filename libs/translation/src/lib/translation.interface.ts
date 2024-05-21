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
    /** Initialize IDL config in workspace */
    initializeConfig: string;
    /** Add docs to file */
    addDocsToFile: string;
    /** Format file */
    formatFile: string;
    /** Format all code in a workspace */
    formatWorkspace: string;
    /** Generates a task file */
    generateTask: string;
    /** Migrate PRO code to the ENVI DL 3.0 API */
    migrateToDL30API: string;
    /** Command to disable problem as setting */
    disableProblemSetting: string;
    /** problem we are fixing */
    fixProblem: string;
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
    startIDL: string;
    compileFile: string;
    runFile: string;
    executeBatchFile: string;
    resetIDL: string;
    startProfiling: string;
    stopProfiling: string;
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
    /** Open IDL example notebook */
    openIDLExample: string;
    /** Open ENVI example notebook */
    openENVIExample: string;
    /** Reset notebook session */
    resetIDLKernel: string;
    /** Reset example notebooks */
    resetNotebookExamples: string;
    /** Stop notebook session */
    stopIDLKernel: string;
    /** Stop all notebooks sessions */
    stopAllIDLKernels: string;
  };
  /** Terminal commands */
  terminal: {
    startIDL: string;
    compileFile: string;
    runFile: string;
    executeBatchFile: string;
    resetIDL: string;
    pauseExecution: string;
    continueExecution: string;
    stepIn: string;
    stepOver: string;
    stepOut: string;
  };
  /** Commands for the webview */
  webview: {
    /** Open the webview */
    start: string;
  };
  /** Commands for opening docs */
  docs: {
    /** Opening the docs */
    open: string;
    /** Resolve link user clicked on from hover help */
    openLink: string;
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
    pro: string;
    switch: string;
    while: string;
    on_ioerror: string;
  };
}

/**
 * Data structure for translation of items in the sidebar tree view
 */
export interface ITreeInformation {
  /** Name of the item in the tree */
  name: string;
  /** Description of the tree item */
  description: string;
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
    /** Notebook settings */
    notebooks: string;
    /** problem reporting */
    problems: string;
    /** Questions asked to the user */
    questions: string;
    /** Root/first level */
    root: string;
  };
  idlDir: {
    notFound: string;
  };
  /** When we need to ask about reloading the window */
  reloadWindow: string;
  /** Descriptions for our config items */
  descriptions: ReverseMapForStrings<IDLExtensionsConfigKeys>; // KeysOfToLiterals<IDLExtensionsConfigKeys>;
  properties: {
    /** Top-level formatting descriptions */
    'code.formatting': KeysOfToStrings<ITrueBaseAssemblerOptions>;
    /** Descriptions for styles */
    'code.formattingStyle': KeysOfToStrings<ICodeStyle>;
    /** Descriptions for history properties */
    'IDL.history': KeysOfToStrings<IDLHistoryConfig>;
  };
  /** Descriptions for choice list items */
  enumDescriptions: {
    /** Workspace preference */
    workspace: {
      prepend: string;
      append: string;
    };
    /** Formatting preference */
    formatting: {
      /** Line feed character */
      eol: {
        lf: string;
        crlf: string;
      };
      /** Styles */
      style: {
        /** Case */
        lower: string;
        /** Case */
        upper: string;
        /** Case */
        camel: string;
        /** Case */
        pascal: string;
        /** Quotes */
        single: string;
        /** Quotes */
        double: string;
        /** Methods */
        dot: string;
        /** Methods */
        arrow: string;
        /** Case */
        match: string;
        /** Do nothing */
        none: string;
      };
    };
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
        /** Config file is not valid JSON */
        invalidJSON: string;
        /** When config file does not match our schema */
        invalidConfigFile: string;
        /** When the config file should be updated to the latest version */
        shouldUpdate: string;
      };
    };
  };
  /** Translations for working with tasks */
  tasks: {
    /** Task file parsing */
    parsing: {
      /** Errors related to parsing */
      errors: {
        /** Specified task file does not exist */
        fileNotFound: string;
        /** Task file is not valid JSON */
        invalidJSON: string;
        /** When task file does not match our schema */
        invalidTaskFile: string;
        /** Problem parsing task file */
        failedParse: string;
      };
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
    /** Translations for the IDL commands, show in the UI of VSCode */
    idl: ICommandTranslation;
    /** Errors we display when commands have problems */
    errors: ICommandTranslation;
    /**
     * Notifications related to running commands for dialogs that appear
     *
     * This is because some commands have extra levels of user interaction and we
     * need a place for that text information to live
     */
    notifications: {
      initConfig: {
        /** Message when no workspace folders are open */
        noWorkspaceOpen: string;
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
      };
      /** Alerts for task file initializations */
      initTask: {
        /** When we create a task */
        created: string;
        /** Title of the dialog for picking workspace folders to initialize config files for */
        dialogTitle: string;
      };
      /** Messages when formatting the workspace */
      formatWorkspace: {
        /** Title of the dialog for picking workspace to format files in */
        pickWorkspace: string;
        /** When there are files we failed to format */
        notAllFilesFormatted: string;
      };
    };
  };
  /** Translations related to configuring the extension */
  configuration: IConfigTranslation;
  /** Translations related to the debugger */
  debugger: {
    logs: {
      /** IDl extension log */
      host: string;
      /** IDl extension debug log */
      debugHistory: string;
      /** File to view button */
      viewFile: string;
      /** Logs to view button */
      viewLogs: string;
      /** Button to configure IDL location */
      specifyIDLLocation: string;
      /** If we have an error, text we show */
      buttonCallbackError: string;
    };
    idl: {
      label: string;
      name: string;
      pleaseStart: string;
      alreadyStarted: string;
      existingSessionFound: string;
      startProfiling: string;
      stopProfiling: string;
      description: string;
    };
    adapter: {
      start: string;
      restart: string;
      stop: string;
      failedStart: string;
      crashed: string;
      noIDLDir: string;
      breakpointSetFailed: string;
      scopeParseError: string;
      promiseResolveError: string;
      /** Message when we try to run a file, but dont find anything */
      noRoutineFound: string;
      /** When we detect syntax errors trying to run code */
      syntaxErrorsFound: string;
      returning: string;
      /** Message to display when users try to pause IDL on windows */
      noPauseOnWindows: string;
      /** Syntax error */
      syntaxError: string;
      /** Warning text for the debug console to let users know it is a preview feature */
      previewWarning: string;
      /** When no file is found from .edit */
      nothingToEdit: string;
    };
    /** Error translations */
    errors: {
      configDone: string;
      launch: string;
      setBreakpoint: string;
      breakpointLocations: string;
      threads: string;
      scopes: string;
      variables: string;
      stackTrace: string;
      continue: string;
      next: string;
      stepIn: string;
      stepOut: string;
      pause: string;
      terminate: string;
      cancel: string;
      evaluate: string;
      idlDetails: string;
      /** Problem creating history file */
      createHistory: string;
      /** Problem adding history */
      addHistory: string;
    };
  };
  /** translations for hover help */
  hoverHelp: IHoverHelpTranslations;
  /** Translations for ENVI helpers/routines/view */
  envi: {
    /** Title for our custom editor window */
    openerTitle: string;
    /** Test to be displayed in the webview for opening files in ENVI */
    openerText: string;
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
  };
  /**
   * Language server messages
   */
  lsp: {
    /** Code action translations */
    codeActions: {
      disableUser: string;
      disableWorkspace: string;
      disableLine: string;
      disableFile: string;
      viewProblemCodeDocs: string;
      viewProblemConfigDocs: string;
    };
    /** Messages for config file */
    config: {
      /** When we fail to parse IDL's config file */
      failedParse: string;
    };
    /** Messages for indexing files */
    index: {
      /** When we fail to parse PRO code */
      failedParse: string;
      /** Message when we fail to parse a notebook */
      failedParseNotebook: string;
      /** When we fail to post process a parsed file */
      failedPostProcess: string;
      /** When change detection fails */
      failedChangeDetection: string;
      /** When we fail to index a workspace */
      failedIndexWorkspace: string;
    };
    /** Error messages when we fail to respond to these events */
    events: {
      /** Hover help */
      onHover: string;
      /** Go-to definition */
      onDefinition: string;
      /** Error formatting */
      onDocumentFormatting: string;
      /** Error formatting workspace */
      onWorkspaceFormatting: string;
      /** Unable to format because of syntax error */
      onDocumentFormattingProblemCode: string;
      /** Auto-complete */
      onCompletion: string;
      /** Custom event to add docs to open file */
      onAddDocs: string;
      /** Error handling close of documents */
      onDidClose: string;
      /** Unhandled exception within worker thread */
      unhandledWorkerMessage: string;
      /** When we open a new file */
      onDidOpen: string;
      /** when workspace folders change */
      onDidChangeWorkspaceFolders: string;
      /** when workspace folders change */
      onDidChangeContent: string;
      /** When we ask for outline */
      onDocumentSymbol: string;
      /** Config from client */
      onWorkspaceConfig: string;
      /** File rename event */
      onDidRename: string;
      /** Workspace config init */
      onInitWorkspaceConfig: string;
      /** Generate/update task */
      onGenerateTask: string;
      /** Error for semantic tokens */
      onSemanticHighlighting: string;
      /** Responding to code actions */
      onCodeAction: string;
      /** Opening notebook */
      onDidOpenNotebook: string;
      /** notebook changed */
      onDidChangeNotebook: string;
      /** Notebook closed */
      onDidCloseNotebook: string;
      /** Retrieving docs */
      onRetrieveDocs: string;
      /** Problem migrating code */
      onMigrateCode: string;
      /** Unable to migrate code because of error */
      onMigrateCodeProblemCode: string;
      /** Convert notebook to PRO code */
      onNotebookToProCode: string;
      /** Convert notebook cell to code we can execute */
      onPrepareNotebookCell: string;
    };
    /** Misc error reports */
    errors: {
      /** Unknown error ocurred and was reported via console.error */
      unhandled: string;
      /** When we cant start, or the server gets closed */
      connection: string;
      /** When server connection gets closed */
      closed: string;
      /** Failed to start the language server */
      start: string;
      /** Error when starting the docs server because of a port conflict */
      startDocsServer: string;
    };
    /** Titles for progress messages */
    progress: {
      /** Progress for formatting workspace */
      formatWorkspace: string;
    };
    /** Messages for types */
    types: {
      /** When we encounter unknown things */
      unknown: {
        property: string;
        procedure: string;
        procedureMethod: string;
        function: string;
        functionMethod: string;
        keyword: string;
        sysVar: string;
      };
      staticReference: string;
    };
  };
  /** Icon theme related translations */
  icons: {
    /** Label for the icon theme */
    label: string;
  };
  /** Translations related to the IDL tree view */
  idl: {
    tree: {
      name: string;
      selectionChangeError: string;
      clickHandlerError: string;
      /** Parent tabs/sections in the sidebar */
      parents: {
        quickAccess: string;
        debugging: string;
        codeActions: string;
        notebooks: string;
        terminal: string;
      };
      /** Children of any of the sidebars, should have the command as the key name */
      children: {
        /** Additional actions */
        quickAccess: {
          pickIDL: ITreeInformation;
          fileBug: ITreeInformation;
          openWebview: ITreeInformation;
          openDocs: ITreeInformation;
          viewSettings: ITreeInformation;
          viewLogs: ITreeInformation;
        };
        codeActions: {
          /** Init config for workspace */
          initializeConfig: ITreeInformation;
          /** Only add docs to file */
          addDocs: ITreeInformation;
          /** Format without docs */
          formatFile: ITreeInformation;
          /** Generate task */
          generateTask: ITreeInformation;
        };
        /** Commands for running IDL */
        debugging: {
          start: ITreeInformation;
          compile: ITreeInformation;
          run: ITreeInformation;
          execute: ITreeInformation;
          reset: ITreeInformation;
          startProfiling: ITreeInformation;
          stopProfiling: ITreeInformation;
        };
        notebooks: {
          /** Format notebook */
          formatNotebooks: ITreeInformation;
          /** Make a new notebook document */
          newNotebook: ITreeInformation;
          /** Format notebook */
          openENVIExample: ITreeInformation;
          /** Format notebook */
          openIDLExample: ITreeInformation;
          /** Reset example notebooks */
          resetExampleNotebooks: ITreeInformation;
          /** Convert notebook to PRO code */
          notebookToProCode: ITreeInformation;
          /** Convert notebook to PDF */
          notebookToPDF: ITreeInformation;
          /** Stop all notebook kernels */
          stopAllNotebookKernels: ITreeInformation;
        };
        /** Deprecated, but tree entries for IDL terminals */
        terminal: {
          startTerminal: ITreeInformation;
          compileTerminal: ITreeInformation;
          runTerminal: ITreeInformation;
          executeTerminal: ITreeInformation;
          resetTerminal: ITreeInformation;
          pauseTerminal: ITreeInformation;
          continueTerminal: ITreeInformation;
          stepInTerminal: ITreeInformation;
          stepOverTerminal: ITreeInformation;
          stepOutTerminal: ITreeInformation;
        };
      };
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
  /** Translations for notebooks */
  notebooks: {
    /** Title of notebooks */
    title: string;
    /** Title of notebook renderer */
    renderer: string;
    /** Name of the notebook controller */
    controller: string;
    /** Errors from notebooks */
    errors: {
      /** Bad notebook file */
      errorParsing: string;
      /** When we fail to load outputs */
      errorLoadOutputs: string;
      /** Error while saving notebook file */
      errorSaving: string;
      /** IDL doesn't start in the notebook */
      failedStart: string;
      /** if we failed to execute one or more cells */
      failedExecute: string;
      /** if we failed to prepare code to run */
      failedCodePrepare: string;
      /** Alert users that IDL for notebooks didn't quite start or reset right */
      didntStartRight: string;
      /** IDL crashes while running something in the notebook */
      crashed: string;
      /** Error while trying to get graphics */
      checkingGraphics: string;
      /** Problem with message from renderer being handled */
      handlingMessageFromRenderer: string;
      /** When we close a notebooks */
      onDidCloseNotebookDocument: string;
    };
    /** Notifications for working with notebooks */
    notifications: {
      /** Message that we are starting IDL */
      startingIDL: string;
      /** When we reset IDL */
      resettingIDL: string;
      /** When we ask to stop IDL */
      stoppingIDL: string;
      /** When IDL hasnt started */
      idlNotStarted: string;
      /** No examples when opening notebook */
      noExamplesFoundInDocs: string;
      /** When a notebook needs to be saved to disk before we process it */
      saveNotebookFirst: string;
      /** When converting to PRO file, include all cells? */
      includeAllCells: string;
      /** When we need Markdown PDF to create PDFs */
      needMarkdownPDF: string;
      /** When we need to wait for install before continuing  */
      markdownPDFWaitForInstall: string;
      /** Notification for user when we start the IDL session for a notebook */
      startedIDLKernel: string;
      /** Notification for when IDL doesnt have the right version */
      notValidIDLVersion: string;
      /** ENVI notebook cell detected */
      enviCellDetected: string;
    };
  };
  /** Translations related to notifications in dialogs that pop up in VSCode */
  notifications: {
    /** When no PRO code if found in the editor */
    noProCode: string;
    /** When we have no IDL notebook in the editor */
    noIDLNotebook: string;
    /** No pro code or task file */
    noProCodeOrTaskFile: string;
    /** When the IDL directory is not found */
    noIDLDirFound: string;
    /** Translation for yes */
    yes: string;
    /** Translation for no */
    no: string;
    /** Translation to not ask again */
    dontAsk: string;
    /** Text that shows to ask if a user wants to change their icon theme */
    changeIcons: string;
    /** Text that shows to ask if a user wants to change the default formatter for IDL */
    changeFormatter: string;
    /** Text that, after a user changes the default formatter to IDL, asks if they want to format on save */
    formatOnSave: string;
    /** Init "idl.json" question */
    initIDLJSON: string;
    /** Do we ask to open docs on startup */
    openDocs: string;
    /** Configure something */
    configure: string;
    /** Start IDL */
    start: string;
    /** Question to ask if want to view docs file */
    viewDocs: string;
  };
  /** Translations for our main package.json file */
  packageJSON: {
    /** Display name for the package, shown in VSCode when you search for extensions */
    displayName: string;
    /** Description for the extension, shown in VSCode when you search for extensions */
    description: string;
  };
  /** Translations related parsing */
  parsing: {
    /** Text to show users when we have an error appear in their IDL code */
    errors: ProblemCodeLookup;
  };
  /** Translations related to the terminal */
  terminal: {
    pleaseStart: string;
    alreadyStarted: string;
  };
  /** Translations related to the status bar */
  statusBar: {
    /** After a user has stopped IDL */
    stopped: string;
    /** On first load, prompt user to start IDL */
    startQuestion: string;
    /** To start IDL after we have started it */
    startAgainQuestion: string;
    /** When IDL crashes */
    crashed: string;
    /** Message when IDL is starting */
    starting: string;
    /** Message when IDL is ready for input */
    ready: string;
    /** When IDL is running a command */
    running: string;
    /** If there is a problems tarting IDL */
    problemStarting: string;
    /** When we index code */
    indexing: string;
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
  /** Translations related to the webview */
  webview: {
    content: {
      notFound: string;
    };
    title: string;
    home: {
      title: string;
    };
    profiler: {
      title: string;
      noShow: string;
      filter: string;
      table: {
        routine: string;
        hits: string;
        timeSelf: string;
        timeTotal: string;
        linesRun: string;
        linesTotal: string;
      };
    };
  };
  /** Translations for docs */
  docs: {
    /** For non-existent docs, text that should be used as a placeholder with AutoDoc */
    placeholder: {
      /** Placeholder docs when we don't have any for parameters */
      params: string;
    };
    /** Hover help related */
    hover: {
      /** hover help parameters */
      params: {
        /** Direction string */
        direction: string;
        /** Required string */
        required: string;
        /** Text for true */
        true: string;
        /** Text for false */
        false: string;
        /** Data type string for parameter */
        typeParam: string;
        /** Data type string for property */
        typeProp: string;
        /** Text for the reference to our object class */
        self: string;
        /** Text for private part of docs */
        private: string;
      };
    };
  };
  /** Auto-complete text */
  autoComplete: {
    /** Details that we show for tokens */
    detail: {
      /** user variables */
      variable: string;
      /** System variables */
      systemVariable: string;
      /** User routine */
      procedure: string;
      /** Internal routine */
      function: string;
      /** Structure properties */
      property: string;
      /** Function methods */
      functionMethod: string;
      /** Procedure methods */
      procedureMethod: string;
      /** Keywords */
      keyword: string;
      /** Structure name */
      structure: string;
      /** ENVI Tasks */
      enviTask: string;
      /** IDL Tasks */
      idltask: string;
    };
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
  /**
   * Usage metrics
   */
  usageMetrics: {
    /** Logging info about our session */
    sendingUsageMetric: string;
    /** File to learn more about */
    learnMore: string;
  };
}
