import { EXTENSION_NAME, EXTENSION_PUBLISHER_NAME } from '@idl/shared';

import { ProcessActivationEvents } from './contributes/activation-events';
import { ProcessActivityBar } from './contributes/activity-bar';
import { ProcessCommands } from './contributes/commands';
import { ProcessConfiguration } from './contributes/configuration';
import { ProcessCustomEditors } from './contributes/custom-editors';
import { ProcessDebugging } from './contributes/debugging';
import { ProcessGrammars } from './contributes/grammars';
import { ProcessIconTheme } from './contributes/icon-theme';
import { ProcessJSONValidators } from './contributes/json-validators';
import { ProcessLanguages } from './contributes/languages';
import { ProcessNotebooks } from './contributes/notebooks';
import { ProcessMainPackageJSON } from './contributes/package-json';
import { ProcessSnippets } from './contributes/snippets';
import { ProcessThemes } from './contributes/themes';
import { ProcessTreeView } from './contributes/tree-view';
import { ProcessWebView } from './contributes/web-view';
import { IPackageJSON, IPackageNLS } from './package.interface';

/**
 * Process our package.json file to:
 *
 * 1. Validate correctness
 * 2. Make changes as needed
 * 3. Halt building if there is a problem that requires manual intervention
 *
 * This routine is to alleviate the extremely manual burden that developers
 * have because all of the commands etc for your extension have to be
 * **manually** included in the package.json file.
 */
export async function ProcessPackage(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  // clear contrib section
  packageJSON['contributes'] = {};

  // get our icon theme
  await ProcessIconTheme(packageJSON, nls);

  // process basic properties in our package.json file
  ProcessMainPackageJSON(packageJSON, nls);

  // add activation events
  ProcessActivationEvents(packageJSON, nls);

  // add configuration
  ProcessConfiguration(packageJSON, nls);

  // add our themes
  ProcessThemes(packageJSON, nls);

  // verify our snippets
  ProcessSnippets(packageJSON, nls);

  // add language associations
  ProcessLanguages(packageJSON, nls);

  // add syntax highlighting
  ProcessGrammars(packageJSON, nls);

  // add JSON schemas
  ProcessJSONValidators(packageJSON, nls);

  // verify our commands
  ProcessCommands(packageJSON, nls);

  // add our activity bar
  ProcessActivityBar(packageJSON, nls);

  // add debug stuff to our package file
  ProcessTreeView(packageJSON, nls);

  // add debug stuff to our package file
  ProcessWebView(packageJSON, nls);

  // add our custom editor
  ProcessCustomEditors(packageJSON, nls);

  // add debug stuff to our package file
  // MUST be after we add our commands
  ProcessDebugging(packageJSON, nls);

  // add notebooks
  ProcessNotebooks(packageJSON, nls);

  // set the name for our language to match our config file
  packageJSON['name'] = EXTENSION_NAME;
  packageJSON['publisher'] = EXTENSION_PUBLISHER_NAME;

  // sort constrib
  const oldContrib = packageJSON['contributes'];
  const newContrib = {};
  const keys = Object.keys(oldContrib).sort();
  for (let i = 0; i < keys.length; i++) {
    newContrib[keys[i]] = oldContrib[keys[i]];
  }
  packageJSON['contributes'] = newContrib;

  // return our modified JSON
  return packageJSON;
}
