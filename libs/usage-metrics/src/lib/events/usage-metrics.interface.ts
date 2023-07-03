/**
 * Event for sending code formatting preferences
 */
export type CodeFormattingUsageMetric = 'code_formatting';

/**
 * Event we send when we have problem codes disabled
 */
export type DisabledProblemCodesUsageMetric = 'disabled_problem';

/**
 * Usage metric event for IDL starting up
 */
export type IDLStartupUsageMetric = 'idl_startup';

/**
 * Usage metric event for when the language server starts up
 */
export type LanguageServerStartupUsageMetric = 'language_server_startup';

/**
 * The event used to report preferences
 */
export type PreferencesUsageMetric = 'idl_preferences';

/**
 * The event used when we run a command
 */
export type RunCommandUsageMetric = 'vscode_command';

/**
 * Event name for when we select content in the UI
 */
export type SelectContentEvent = 'select_content';

/**
 * Event name for when we select content in the UI
 */
export type ViewItemListEvent = 'view_item_list';

/**
 * Type representing all possible usage metric events
 */
export type UsageMetric =
  | CodeFormattingUsageMetric
  | DisabledProblemCodesUsageMetric
  | IDLStartupUsageMetric
  | LanguageServerStartupUsageMetric
  | PreferencesUsageMetric
  | RunCommandUsageMetric;

/**
 * Strictly types lookup for usage metric event names
 */
interface IUsageMetricLookup {
  /**
   * If we have code formatting preferences
   */
  CODE_FORMATTING: CodeFormattingUsageMetric;
  /**
   * Problem codes that are disabled
   */
  DISABLED_PROBLEM_CODES: DisabledProblemCodesUsageMetric;
  /**
   * Usage metric event for IDL starting up
   */
  IDL_STARTUP: IDLStartupUsageMetric;
  /**
   * Usage metric event for when the language server starts up
   */
  LANGUAGE_SERVER_STARTUP: LanguageServerStartupUsageMetric;
  /**
   * The event used to report preferences
   */
  PREFERENCES: PreferencesUsageMetric;
  /**
   * The event used when we run a command
   */
  RUN_COMMAND: RunCommandUsageMetric;
}

/**
 * Lookup of usage metric events that we use behind the scenes
 */
export const USAGE_METRIC_LOOKUP: IUsageMetricLookup = {
  CODE_FORMATTING: 'code_formatting',
  DISABLED_PROBLEM_CODES: 'disabled_problem',
  IDL_STARTUP: 'idl_startup',
  LANGUAGE_SERVER_STARTUP: 'language_server_startup',
  PREFERENCES: 'idl_preferences',
  RUN_COMMAND: 'vscode_command',
};
