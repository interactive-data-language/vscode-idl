import { ExportedGlobalTokensByType } from '@idl/parsing/index';
import {
  CreateRoutineSyntax,
  CreateTaskSyntax,
  IDL_DOCS_HEADERS,
} from '@idl/parsing/syntax-tree';
import { GLOBAL_TOKEN_TYPES, TASK_REGEX } from '@idl/types/core';
import { DefaultTheme } from 'vitepress';

import { CleanDocs } from './clean-docs';
import { DocsForProperty } from './docs-for-property';
import { GetClassLink } from './get-class-link';
import { GetDisplayName } from './get-display-name';
import { GetDocsLink } from './get-docs-link';

/**
 * Information we track about each class
 */
interface IClassSummary {
  /** Display name */
  display: string;
  /** Track class inheritance */
  inherits: string[];
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
        inherits: structs[i].meta.inherits.sort(),
        functions: [],
        procedures: [],
        properties: [],
        sidebar: [],
      };
    }

    // save docs for properties if public
    if (!structs[i].meta.private) {
      classes[structs[i].name].properties = Object.values(
        structs[i].meta.props
      ).map((prop) => DocsForProperty(prop));
    }
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
        inherits: [],
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
      text: GetDisplayName(fm).split('::')[1],
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
        inherits: [],
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
      text: GetDisplayName(pm).split('::')[1],
      link: GetDocsLink(pm),
    });
  }

  /**
   * Track content by class name
   */
  const byClass: {
    [key: string]: {
      display: string;
      summary: string;
      sidebar: DefaultTheme.NavItemWithLink[];
    };
  } = {};

  /** Get all functions */
  const functions = exported[GLOBAL_TOKEN_TYPES.FUNCTION];

  /**
   * Create class pages
   */
  const names = Object.keys(classes);
  for (let i = 0; i < names.length; i++) {
    /** Info about our class */
    const info = classes[names[i]];

    // check if we need to skip classes that have nothing documented about them
    if (
      info.functions.length +
        info.procedures.length +
        info.properties.length ===
      0
    ) {
      continue;
    }

    // save strings
    const strings: string[] = [];

    // filter out class inheritance for undocumented classes
    info.inherits = info.inherits.filter((parent) => parent in classes);

    // check for matching function
    const init = functions.find((item) => item.name === names[i]);

    // get structure
    const struct = structs.find((item) => item.name === names[i]);

    /**
     * determine how to proceed
     */
    switch (true) {
      /**
       * Do we have an init method?
       */
      case init !== undefined:
        strings.push(
          `See the function [${init.meta.display}()](${GetDocsLink(
            init
          )}) for creation details`
        );
        strings.push('');
        strings.push('```idl:no-line-numbers');
        strings.push(
          CreateRoutineSyntax(
            {
              name: init.meta.display,
              meta: init.meta,
            },
            true
          )
        );
        strings.push('```');
        strings.push('');

        if (init.meta.docsLookup) {
          if (IDL_DOCS_HEADERS.DEFAULT in init.meta.docsLookup) {
            strings.push(
              CleanDocs(init.meta.docsLookup[IDL_DOCS_HEADERS.DEFAULT])
            );
            strings.push('\n');
          }
        }
        break;

      /**
       * Do we have a task
       */
      case TASK_REGEX.test(names[i]) && struct !== undefined:
        strings.push('');
        strings.push('```idl:no-line-numbers');
        strings.push(CreateTaskSyntax(struct));
        strings.push('```');
        strings.push('');

        if (struct.meta.docsLookup) {
          if (IDL_DOCS_HEADERS.DEFAULT in struct.meta.docsLookup) {
            strings.push(
              CleanDocs(struct.meta.docsLookup[IDL_DOCS_HEADERS.DEFAULT])
            );
            strings.push('\n');
          }
        }
        break;

      default:
        break;
    }

    // check for inheritance
    if (info.inherits.length > 0) {
      strings.push('## Inherits From');
      strings.push('');

      // add all inheritance classes
      for (let z = 0; z < info.inherits.length; z++) {
        if (info.inherits[z] in classes) {
          strings.push(
            `[${classes[info.inherits[z]].display}](${GetClassLink(
              info.inherits[z]
            )})`
          );

          // inherit
          info.functions = info.functions
            .concat(classes[info.inherits[z]].functions)
            .sort();
          info.procedures = info.procedures
            .concat(classes[info.inherits[z]].procedures)
            .sort();
          info.properties = info.properties
            .concat(classes[info.inherits[z]].properties)
            .sort();
        } else {
          strings.push(info.inherits[z]);
        }
        strings.push('');
      }
    }

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
    byClass[info.display.toLowerCase()] = {
      display: info.display,
      summary: strings.join('\n'),
      sidebar: info.sidebar.sort((a, b) =>
        a.text > b.text ? 1 : b.text > a.text ? -1 : 0
      ),
    };
  }

  // return our lookup
  return byClass;
}
