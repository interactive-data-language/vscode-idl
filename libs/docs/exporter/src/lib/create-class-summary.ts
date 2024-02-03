import { ExportedGlobalTokensByType } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { DefaultTheme } from 'vitepress';

import { GetDisplayName } from './get-display-name';
import { GetDocsLink } from './get-docs-link';

/**
 * Information we track about each class
 */
interface IClassSummary {
  /** Display name */
  display: string;
  /** Function methods */
  functions: string[];
  /** Procedure methods */
  procedures: string[];
  /** Properties */
  properties: string[];
  /** Sidebar for class */
  sidebar: DefaultTheme.NavItemWithLink[];
}

/**
 * Creates class summary files based on what is public in the classes being exported
 *
 * Accounts for methods being exposed without structures (i.e. like static methods)
 */
export function GenerateClassSummaries(exported: ExportedGlobalTokensByType) {
  /**
   * Track the classes by names
   */
  const classes: { [key: string]: IClassSummary } = {};

  /**
   * Check structures
   */
  const structs = exported[GLOBAL_TOKEN_TYPES.STRUCTURE];
  for (let i = 0; i < structs.length; i++) {
    if (!(structs[i].name in classes)) {
      classes[structs[i].name] = {
        display: structs[i].meta.display,
        functions: [],
        procedures: [],
        properties: [],
        sidebar: [],
      };
    }

    // save docs for properties
    classes[structs[i].name].properties = Object.values(
      structs[i].meta.props
    ).map((prop) => prop.docs);
  }

  /**
   * Check function methods
   */
  const fms = exported[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD];
  for (let i = 0; i < fms.length; i++) {
    const fm = fms[i];
    const className = fm.name.split('::')[0];

    if (!(className in classes)) {
      classes[className] = {
        display: fm.meta.display.split('::')[0],
        functions: [],
        procedures: [],
        properties: [],
        sidebar: [],
      };
    }

    classes[className].functions.push(
      `[${GetDisplayName(fm)}](${GetDocsLink(fm)})`
    );

    // update sidebar
    classes[className].sidebar.push({
      text: GetDisplayName(fm),
      link: GetDocsLink(fm),
    });
  }

  /**
   * Check procedure methods
   */
  const pms = exported[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD];
  for (let i = 0; i < pms.length; i++) {
    const pm = pms[i];
    const className = pm.name.split('::')[0];

    if (!(className in classes)) {
      classes[className] = {
        display: pm.meta.display.split('::')[0],
        functions: [],
        procedures: [],
        properties: [],
        sidebar: [],
      };
    }

    classes[className].procedures.push(
      `[${GetDisplayName(pm)}](${GetDocsLink(pm)})`
    );

    // update sidebar
    classes[className].sidebar.push({
      text: GetDisplayName(pm),
      link: GetDocsLink(pm),
    });
  }

  /**
   * Track content by class name
   */
  const byClass: {
    [key: string]: { summary: string; sidebar: DefaultTheme.NavItemWithLink[] };
  } = {};

  /**
   * Create class pages
   */
  const names = Object.keys(classes);
  for (let i = 0; i < names.length; i++) {
    /** Info about our class */
    const info = classes[names[i]];

    // save strings
    const strings: string[] = [];

    // add methods
    strings.push('## Known Methods');
    strings.push('');

    const allMethods = info.procedures.concat(info.functions).sort();
    if (allMethods.length === 0) {
      strings.push('No documented methods');
    } else {
      for (let j = 0; j < allMethods.length; j++) {
        strings.push(allMethods[j]);
        strings.push('');
      }
    }
    strings.push('');

    // add properties
    strings.push('## Known Properties');
    strings.push('');
    if (info.properties.length === 0) {
      strings.push('No documented properties');
    } else {
      for (let j = 0; j < info.properties.length; j++) {
        strings.push(info.properties[j]);
        strings.push('');
      }
    }

    // save
    byClass[info.display] = {
      summary: strings.join('\n'),
      sidebar: info.sidebar,
    };
  }

  // return our lookup
  return byClass;
}
