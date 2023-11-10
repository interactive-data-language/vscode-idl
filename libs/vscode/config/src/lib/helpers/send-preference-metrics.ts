import {
  IDL_PROBLEM_CODE_ALIAS_LOOKUP,
  IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP,
} from '@idl/parsing/problem-codes';
import {
  EXTENSION_FULL_NAME,
  ICON_THEME_NAME,
  IDL_LANGUAGE_NAME,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import { IDL_EXTENSION_CONFIG } from '../initialize-extension-config';

/**
 * Track if we have sent preferences already
 *
 * Only do this on startup for now
 */
let SENT_PREFERENCES = false;

/**
 * This helper function send usage metrics for our preferences
 *
 * THIS DOES NOTHING UNLESS USAGE METRICS ARE ENABLED AND HAVE BEEN INITIALIZED
 */
export function SendPreferenceUsageMetrics() {
  /**
   * Return if we have already sent preferences
   */
  if (SENT_PREFERENCES) {
    return;
  }

  /**
   * Get the ignore problems
   */
  const ignore = IDL_EXTENSION_CONFIG.problems.ignoreProblems;

  /**
   * Normalize ignore codes to only numbers and make sure they are all known
   * codes
   */
  const ignoreIds = ignore
    .map((code) => {
      if (typeof code === 'string') {
        return code in IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP
          ? IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP[code]
          : undefined;
      } else {
        return code in IDL_PROBLEM_CODE_ALIAS_LOOKUP ? code : undefined;
      }
    })
    .filter((code) => code !== undefined);

  // check if we have any ignore codes to send
  if (ignoreIds.length > 0) {
    for (let i = 0; i < ignoreIds.length; i++) {
      VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.DISABLED_PROBLEM_CODES, {
        ignored_problem_alias: IDL_PROBLEM_CODE_ALIAS_LOOKUP[ignoreIds[i]],
      });
    }
    // /**
    //  * Send as a single event, this works because we can make a dimension based on the item
    //  * property so we only have to make one request
    //  */
    // VSCodeTelemetryLogger('select_item' as any, {
    //   item_list_id: 'ignored_problem_codes',
    //   item_list_name: 'Ignored Problem codes',
    //   items: ignoreIds.map((code) => {
    //     return {
    //       item_id: `${code}`,
    //       item_name: IDL_PROBLEM_CODE_ALIAS_LOOKUP[code],
    //       ignored_code_alias: IDL_PROBLEM_CODE_ALIAS_LOOKUP[code],
    //     };
    //   }),
    // });
  }

  /**
   * get workbench config
   */
  const editor = vscode.workspace.getConfiguration('editor', {
    languageId: IDL_LANGUAGE_NAME,
  });

  // check for our client theme
  const config = vscode.workspace.getConfiguration('workbench');

  // get current theme
  const theme = config.get('colorTheme') as string;

  /**
   * Names of the themes that we contribute
   */
  const OUR_THEMES = [
    IDL_TRANSLATION.themes.retro,
    IDL_TRANSLATION.themes.new,
    IDL_TRANSLATION.themes.neon,
  ];

  /**
   * Get code formatting preferences
   */
  const code = IDL_EXTENSION_CONFIG.code;

  /**
   * See what things we provide that people are using
   */
  VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.PREFERENCES, {
    pref_default_formatter: `${
      editor.get('defaultFormatter') === EXTENSION_FULL_NAME
    }`,
    pref_icon_theme: `${config.iconTheme !== ICON_THEME_NAME}`,
    pref_idl_theme: OUR_THEMES.indexOf(theme) !== -1 ? theme : 'non-IDL',
    pref_auto_doc: `${code.formatting.autoDoc}`,
    pref_auto_fix: `${code.formatting.autoFix}`,
    pref_end_of_line: code.formatting.eol,
    pref_style_and_format: `${code.formatting.styleAndFormat}`,
    pref_tab_width: code.formatting.tabWidth,
  });

  /**
   * Send information about our formatting preferences
   */
  VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.CODE_FORMATTING, {
    pref_quotes: code.formattingStyle.quotes,
    pref_methods: code.formattingStyle.methods,
    pref_keywords: code.formattingStyle.keywords,
    pref_properties: code.formattingStyle.properties,
    pref_control: code.formattingStyle.control,
    pref_numbers: code.formattingStyle.numbers,
    pref_hex: code.formattingStyle.hex,
    pref_octal: code.formattingStyle.octal,
    pref_binary: code.formattingStyle.binary,
    pref_routines: code.formattingStyle.routines,
    pref_routine_methods: code.formattingStyle.routineMethods,
    pref_sys_var: code.formattingStyle.systemVariables,
    pref_struct_name: code.formattingStyle.structureNames,
    pref_local_var: code.formattingStyle.localVariables,
  });
  // VSCodeTelemetryLogger('select_item' as any, {
  //   item_list_id: 'code_formatting',
  //   item_list_name: 'Code Formatting',
  //   items: [
  //     {
  //       item_id: 'auto_doc',
  //       item_name: 'AutoDoc',
  //       item_variant: `${code.formatting.autoDoc}`,
  //     },
  //     {
  //       item_id: 'auto_fix',
  //       item_name: 'AutoFix',
  //       item_variant: `${code.formatting.autoFix}`,
  //     },
  //     {
  //       item_id: 'eol',
  //       item_name: 'End-of-line',
  //       item_variant: code.formatting.eol,
  //     },
  //     {
  //       item_id: 'style_and_format',
  //       item_name: 'Style and Format',
  //       item_variant: `${code.formatting.styleAndFormat}`,
  //     },
  //     {
  //       item_id: 'tab_width',
  //       item_name: 'Tab Width',
  //       item_variant: `${code.formatting.tabWidth}`,
  //     },
  //     {
  //       item_id: 'quote_style',
  //       item_name: 'Quote Style',
  //       item_variant: code.formattingStyle.quotes,
  //     },
  //     {
  //       item_id: 'method_style',
  //       item_name: 'Method Style',
  //       item_variant: code.formattingStyle.methods,
  //     },
  //     {
  //       item_id: 'keyword-_tyle',
  //       item_name: 'Keyword Style',
  //       item_variant: code.formattingStyle.keywords,
  //     },
  //     {
  //       item_id: 'property_style',
  //       item_name: 'Property Style',
  //       item_variant: code.formattingStyle.properties,
  //     },
  //     {
  //       item_id: 'control_style',
  //       item_name: 'Control Style',
  //       item_variant: code.formattingStyle.control,
  //     },
  //     {
  //       item_id: 'number_style',
  //       item_name: 'Number Style',
  //       item_variant: code.formattingStyle.numbers,
  //     },
  //     {
  //       item_id: 'hex_style',
  //       item_name: 'Hex Style',
  //       item_variant: code.formattingStyle.hex,
  //     },
  //     {
  //       item_id: 'octal_style',
  //       item_name: 'Octal Style',
  //       item_variant: code.formattingStyle.octal,
  //     },
  //     {
  //       item_id: 'binary_style',
  //       item_name: 'Binary Style',
  //       item_variant: code.formattingStyle.binary,
  //     },
  //     {
  //       item_id: 'routine_style',
  //       item_name: 'Routine Style',
  //       item_variant: code.formattingStyle.routines,
  //     },
  //     {
  //       item_id: 'sys_var_style',
  //       item_name: 'System Variables Style',
  //       item_variant: code.formattingStyle.systemVariables,
  //     },
  //     {
  //       item_id: 'local_var_style',
  //       item_name: 'Local Variables Style',
  //       item_variant: code.formattingStyle.localVariables,
  //     },
  //   ],
  // });

  // update flag that we sent preferences
  SENT_PREFERENCES = true;
}
