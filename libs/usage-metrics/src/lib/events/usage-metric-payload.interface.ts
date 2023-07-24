import { IGA4EventParameters } from '../ga4/ga4-client.interface';
import {
  CodeFormattingUsageMetric,
  DisabledProblemCodesUsageMetric,
  IDLStartupUsageMetric,
  LanguageServerStartupUsageMetric,
  PreferencesUsageMetric,
  RunCommandUsageMetric,
  SelectContentEvent,
  UsageMetric,
  ViewItemListEvent,
} from './usage-metrics.interface';

/**
 * Shared interface for hardware information
 */
interface IHardwareInfo extends IGA4EventParameters {
  /**
   * What OS are we using for how important cross platform support is
   */
  app_platform: string;
  /**
   * The architecture (arm, x86, atc)
   */
  app_arch: string;
  /**
   * Total available CPU RAM
   */
  app_ram: number;
  /**
   * Amount of RAM the language server is using (includes everything)
   */
  app_ram_used: number;
  /**
   * Number of CPUs - captured for performance information about how many worker
   * threads we should be using
   */
  app_cpus: number;
}

/**
 * For code formatting, the custom properties that we report
 */
interface ICodeFormattingPayload extends IGA4EventParameters {
  /** Quote formatting */
  pref_quotes: string;
  /** Method formatting */
  pref_methods: string;
  /** Keyword formatting */
  pref_keywords: string;
  /** Property formatting */
  pref_properties: string;
  /** Control formatting */
  pref_control: string;
  /** Number formatting */
  pref_numbers: string;
  /** Hex formatting */
  pref_hex: string;
  /** Octal formatting */
  pref_octal: string;
  /** Binary formatting */
  pref_binary: string;
  /** Routine formatting */
  pref_routines: string;
  /** Sys var formatting */
  pref_sys_var: string;
  /** Local var formatting */
  pref_local_var: string;
}

/**
 * Payload for disabled problem codes
 */
interface IDisabledProblemCodePayload extends IGA4EventParameters {
  /**
   * The alias for the problem code
   */
  ignored_problem_alias: string;
}

/**
 * IDL startup information
 */
interface IIDLStartupPayload extends IGA4EventParameters {
  /**
   * Version of IDL (re-used from custom metric below)
   */
  idl_version: string;
  /**
   * Whether we have IDL or ENVI and IDL
   */
  idl_type: 'idl' | 'idl-envi';
}

/**
 * Language server startup information
 */
export interface ILanguageServerStartupPayload extends IHardwareInfo {
  /**
   * Number of worker threads being used
   */
  num_workers: number;
  /**
   * How long it takes the language server to start
   */
  parse_time: number;
  /**
   * The rate at which we parse code
   */
  parse_rate: number;
  /**
   * Number of PRO files
   */
  num_pro: number;
  /**
   * NUmber of SAVE files
   */
  num_save: number;
  /**
   * Number of IDL Task files
   */
  num_idl_task: number;
  /**
   * Number of ENVI Task files
   */
  num_envi_task: number;
  /**
   * Number of idl.json config files
   */
  num_idl_json: number;
  /**
   * Number of IDL notebook files
   */
  num_notebook: number;
}

/**
 * Information about preferences
 */
interface IPreferencePayload extends IGA4EventParameters {
  /** Are we using our icon theme */
  pref_icon_theme: string;
  /** If our formatter is the default for IDL */
  pref_default_formatter: string;
  /** If we are using a theme provided by IDL */
  pref_idl_theme: string;
  /** Is it enabled */
  pref_auto_doc: string;
  /** Do we auto fix problems */
  pref_auto_fix: string;
  /** End of line character */
  pref_end_of_line: string;
  /** Dont style or format */
  pref_style_and_format: string;
  /** Indent size */
  pref_tab_width: number;
}

/**
 * Payload when we run a command
 */
interface IRunCommandPayload extends IGA4EventParameters {
  /** The command we run */
  idl_command: string;
}

/**
 * Payload for content selection
 */
interface ISelectContentUsageMetricPayload extends IGA4EventParameters {
  /**
   * The type of content that was selected
   */
  content_type: string;
  /**
   * The ID of the content that was selected
   */
  content_id: string;
}

/**
 * Items in our item lists
 */
interface IItemListItem extends IGA4EventParameters {
  /**
   * ID for the item
   */
  item_id: string;
  /**
   * Human-readable string
   */
  item_name: string;
  /**
   * The kind of the item (i.e. green)
   */
  item_variant?: string;
}

/**
 * Payload for item lists
 */
interface IItemListPayload extends IGA4EventParameters {
  /**
   * The ID of the thing we are looking at
   */
  item_list_id: string;
  /**
   * human readable name of the thing we are looking at
   */
  item_list_name: string;
  /**
   * The items that we view
   */
  items: IItemListItem[];
}

/**
 * The payloads that we send for different events
 */
export type UsageMetricPayload<T extends UsageMetric> =
  T extends CodeFormattingUsageMetric
    ? ICodeFormattingPayload
    : T extends DisabledProblemCodesUsageMetric
    ? IDisabledProblemCodePayload
    : T extends IDLStartupUsageMetric
    ? IIDLStartupPayload
    : T extends LanguageServerStartupUsageMetric
    ? ILanguageServerStartupPayload
    : T extends PreferencesUsageMetric
    ? IPreferencePayload
    : T extends RunCommandUsageMetric
    ? IRunCommandPayload
    : T extends SelectContentEvent
    ? ISelectContentUsageMetricPayload
    : T extends ViewItemListEvent
    ? IItemListPayload
    : any;

/**
 * Event and payload data structure for usage metric data
 */
export interface IUsageMetricAndPayload<T extends UsageMetric> {
  /**
   * The name of the event
   */
  event: T;
  /**
   * The event payload
   */
  payload: UsageMetricPayload<T>;
}
