import {
  DEFAULT_ASSEMBLER_OPTIONS,
  DEFAULT_CODE_STYLE,
  ICodeStyle,
  ITrueBaseAssemblerOptions,
} from '@idl/assembling/config';
import copy from 'fast-copy';

/**
 * Data structure to show the paths to elements in IDL's config
 *
 * ONLY for use in the VSCode client.
 *
 * When adding, please use keys that can be accessed with the dot notation so that
 * validation can be performed before compiling to catch errors
 */
export interface IDLExtensionsConfigKeys {
  /** Full debug logs for everything */
  readonly debugMode: 'debugMode';

  /** Root level IDL preferences */
  IDL: 'IDL';
  /** Folder the IDL executable  lives in (i.e. the bin directory with idl.exe) */
  readonly IDLDirectory: 'IDL.directory';
  /** User configured IDL path */
  readonly IDLPath: 'IDL.path';
  /** When we have workspace folders open, do we add them to IDL's search oath */
  readonly IDLAddWorkspaceFoldersToPath: 'IDL.addWorkspaceFoldersToPath';
  /** how do we add folders to IDL's search path */
  readonly IDLAppendOrPrependWorkspaceFolders: 'IDL.appendOrPrependWorkspaceFolders';
  /** Top-level formatting options, excluding style */
  readonly IDLPreferences: 'IDL.preferences';
  /** Top-level formatting options, excluding style */
  readonly IDLenvironment: 'IDL.environment';
  /** History for your IDL sessions */
  readonly IDLhistory: 'IDL.history';

  /** Top-level formatting options, excluding style */
  readonly codeFormatting: 'code.formatting';
  /** Code-formatting style */
  readonly codeFormattingStyle: 'code.formattingStyle';

  /** Key for language server preferences */
  readonly languageServer: 'languageServer';
  /** Do we do a full parse or not */
  readonly languageServerFullParse: 'languageServer.fullParse';

  /** Key for notebook preferences */
  readonly notebooks: 'notebooks';
  /** Do we make IDL quiet? */
  readonly notebooksQuietMode: 'notebooks.quietMode';
  /** Do we embed graphics or not */
  readonly notebooksEmbedGraphics: 'notebooks.embedGraphics';

  /** Key for problem preferences */
  readonly problems: 'problems';
  /** Do we report docs problems or not */
  readonly problemsReportDocsProblems: 'problems.reportDocsProblems';
  /** User configured problem codes to ignore */
  readonly problemsIgnoreProblems: 'problems.ignoreProblems';
  /** If we include problems to files that live in an open workspace */
  readonly problemsIncludeProblemsFromIDLPath: 'problems.includeProblemsFromIDLPath';
  /** If we include problems to files that live in an "idl_packages" folder" */
  readonly problemsIncludeProblemsFromIDLPackages: 'problems.includeProblemsFromIDLPackages';

  /** Top-level don't ask key */
  readonly dontAsk: 'dontAsk';

  /** On startup, if we dont have IDL configured, should we ask for it or not */
  readonly dontAskForIDLDir: 'dontAsk.forIDLDir';
  /** On startup, if we dont have our icon theme as default, should we ask for it or not */
  readonly dontAskForIconChange: 'dontAsk.forIconChange';
  /** On startup, if we dont have a formatter configured for IDL code, should we ask for it or not */
  readonly dontAskForFormatterChange: 'dontAsk.forFormatterChange';
  /** Controls if we ask to init config for folders or not */
  // readonly dontAskToInitConfig: 'dontAsk.toInitConfig';
  /** Folders that we don't ask to initialize config for */
  // readonly dontAskToInitConfigForTheseFolders: 'dontAsk.toInitConfigForTheseFolders';

  /** Top-level don't show key */
  readonly dontShow: 'dontShow';
  /** Don't show the welcome page */
  readonly dontShowWelcomePage: 'dontShow.welcomePage';

  /** Top-level developer key */
  readonly developer: 'developer';
  /** ENVI Developer */
  readonly developerENVI: 'developer.ENVI';
  /** IDL developer */
  readonly developerIDL: 'developer.IDL';
  /** ENVI Deep Learning */
  readonly developerENVIDeepLearning: 'developer.ENVIDeepLearning';
  /** ENVI Machine Learning */
  readonly developerENVIMachineLearning: 'developer.ENVIMachineLearning';
}

export interface IDLHistoryConfig {
  /** Do we save history or not? */
  readonly enabled: boolean;
  /** The maximum file size in MB */
  readonly maxSize: number;
  /** Always reset the contents of the log file */
  readonly truncateOnStartup: boolean;
  /** The folder we write to */
  readonly folder: string;
  /** The name of the file we generate */
  readonly fileName: string;
}

export interface IDLConfig {
  /** Folder the IDL executable  lives in (i.e. the bin directory with idl.exe) */
  readonly directory: string;
  /** User configured IDL path */
  readonly path: string[];
  /** When we have workspace folders open, do we add them to IDL's search oath */
  readonly addWorkspaceFoldersToPath: boolean;
  /** how do we add folders to IDL's search path */
  readonly appendOrPrependWorkspaceFolders: 'append' | 'prepend';
  /** Environment variables when launching IDL (NOT INCLUDED IN PACKAGE.JSON) */
  readonly environment: { [key: string]: string };
  /** How we track history for IDL */
  readonly history: IDLHistoryConfig;
}

export interface ICodeConfig {
  /** Top-level formatting options, excluding style */
  readonly formatting: ITrueBaseAssemblerOptions;
  /** Code-formatting style */
  readonly formattingStyle: ICodeStyle;
}

export interface ILanguageServerConfig {
  /** Does the language server do a full parse of your code */
  fullParse: boolean;
}

export interface INotebookConfig {
  /** Do we make IDL quiet? */
  quietMode: boolean;
  /** Do we embed graphics into notebooks? */
  embedGraphics: boolean;
}

export interface IProblemConfig {
  /** Do we report docs problems or not? */
  readonly reportDocsProblems: boolean;
  /** User configured problem codes to ignore (problem codes or aliases) */
  readonly ignoreProblems: (number | string)[];
  /** If we include problems to files that live in an open workspace */
  readonly includeProblemsFromIDLPath: boolean;
  /** If we include problems to files that live in an "idl_packages" folder" */
  readonly includeProblemsFromIDLPackages: boolean;
}

export interface IDontAskConfig {
  /** On startup, if we dont have IDL configured, should we ask for it or not */
  readonly forIDLDir: boolean;
  /** On startup, if we dont have our icon theme as default, should we ask for it or not */
  readonly forIconChange: boolean;
  /** On startup, if we dont have a formatter configured for IDL code, should we ask for it or not */
  readonly forFormatterChange: boolean;
  // /** Controls if we ask to init config for folders or not */
  // readonly toInitConfig: boolean;
  // /** Folders that we don't ask to initialize config for */
  // readonly toInitConfigForTheseFolders: string[];
}

export interface IDontShowConfig {
  /** On startup, do we show the welcome page */
  readonly welcomePage: boolean;
}

export interface IDeveloperConfig {
  /** IDL developer */
  readonly IDL: boolean;
  /** ENVI Developer */
  readonly ENVI: boolean;
  /** ENVI Deep Learning */
  readonly ENVIDeepLearning: boolean;
  /** ENVI Machine Learning */
  readonly ENVIMachineLearning: boolean;
}

/**
 * Extension configuration for VSCode. This comes from user-settings in
 * VSCode and is separate from the "idl.json"
 */
export interface IDLExtensionConfig {
  /** Full debug logs for everything */
  readonly debugMode: boolean;

  /** Preferences related to IDL sessions */
  readonly IDL: IDLConfig;

  /**
   * Preferences related to code formatting.
   *
   * We use two entries, instead of just one, so that users can edit these
   * directly within the VSCode UI
   */
  readonly code: ICodeConfig;

  /**
   * Configuration for the language server
   */
  readonly languageServer: ILanguageServerConfig;

  /**
   * Configuration for notebooks
   */
  readonly notebooks: INotebookConfig;

  /**
   * Preferences for problem reporting
   */
  readonly problems: IProblemConfig;

  /**
   * Questions that we don't ask the user
   */
  readonly dontAsk: IDontAskConfig;

  /**
   * Questions that we don't ask the user
   */
  readonly dontShow: IDontShowConfig;

  /** Preferences related to developers */
  readonly developer: IDeveloperConfig;
}

/**
 * Constant with the string representation of the IDL config keys so that
 * we can manage them within the VSCode client
 *
 * We need these to set/get values
 */
export const IDL_EXTENSION_CONFIG_KEYS: IDLExtensionsConfigKeys = {
  debugMode: 'debugMode',

  IDL: 'IDL',
  IDLDirectory: 'IDL.directory',
  IDLPath: 'IDL.path',
  IDLAddWorkspaceFoldersToPath: 'IDL.addWorkspaceFoldersToPath',
  IDLAppendOrPrependWorkspaceFolders: 'IDL.appendOrPrependWorkspaceFolders',
  IDLPreferences: 'IDL.preferences',
  IDLenvironment: 'IDL.environment',
  IDLhistory: 'IDL.history',

  codeFormatting: 'code.formatting',
  codeFormattingStyle: 'code.formattingStyle',

  languageServer: 'languageServer',
  languageServerFullParse: 'languageServer.fullParse',

  notebooks: 'notebooks',
  notebooksQuietMode: 'notebooks.quietMode',
  notebooksEmbedGraphics: 'notebooks.embedGraphics',

  problems: 'problems',
  problemsReportDocsProblems: 'problems.reportDocsProblems',
  problemsIgnoreProblems: 'problems.ignoreProblems',
  problemsIncludeProblemsFromIDLPath: 'problems.includeProblemsFromIDLPath',
  problemsIncludeProblemsFromIDLPackages:
    'problems.includeProblemsFromIDLPackages',

  dontAsk: 'dontAsk',
  dontAskForIDLDir: 'dontAsk.forIDLDir',
  dontAskForIconChange: 'dontAsk.forIconChange',
  dontAskForFormatterChange: 'dontAsk.forFormatterChange',
  // dontAskToInitConfig: 'dontAsk.toInitConfig',
  // dontAskToInitConfigForTheseFolders: 'dontAsk.toInitConfigForTheseFolders',

  dontShow: 'dontShow',
  dontShowWelcomePage: 'dontShow.welcomePage',

  developer: 'developer',
  developerIDL: 'developer.IDL',
  developerENVI: 'developer.ENVI',
  developerENVIDeepLearning: 'developer.ENVIDeepLearning',
  developerENVIMachineLearning: 'developer.ENVIMachineLearning',
};

/**
 * Default configuration for the IDL extension in VSCOde
 *
 * This is NOT the same thing from our "idl.json" file
 */
export const DEFAULT_IDL_EXTENSION_CONFIG: IDLExtensionConfig = {
  debugMode: false,
  IDL: {
    directory: '',
    path: [],
    addWorkspaceFoldersToPath: true,
    appendOrPrependWorkspaceFolders: 'prepend',
    environment: {},
    history: {
      enabled: true,
      maxSize: 2,
      truncateOnStartup: false,
      folder: '${.idl}',
      fileName: 'idl-history.idllog',
    },
  },
  code: {
    formatting: {
      // manually unpack as there are extra properties we dont want/need
      autoDoc: DEFAULT_ASSEMBLER_OPTIONS.autoDoc,
      autoFix: DEFAULT_ASSEMBLER_OPTIONS.autoFix,
      eol: DEFAULT_ASSEMBLER_OPTIONS.eol,
      styleAndFormat: DEFAULT_ASSEMBLER_OPTIONS.styleAndFormat,
      tabWidth: DEFAULT_ASSEMBLER_OPTIONS.tabWidth,
    },
    formattingStyle: copy(DEFAULT_CODE_STYLE),
  },
  languageServer: {
    fullParse: true,
  },
  notebooks: {
    quietMode: true,
    embedGraphics: true,
  },
  problems: {
    reportDocsProblems: true,
    ignoreProblems: [],
    includeProblemsFromIDLPath: true,
    includeProblemsFromIDLPackages: false,
  },
  dontAsk: {
    forIDLDir: false,
    forIconChange: false,
    forFormatterChange: false,
    // toInitConfig: false,
    // toInitConfigForTheseFolders: [],
  },
  dontShow: {
    welcomePage: false,
  },
  developer: {
    IDL: false,
    ENVI: false,
    ENVIDeepLearning: false,
    ENVIMachineLearning: false,
  },
};
