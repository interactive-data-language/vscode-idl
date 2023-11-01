import { IDL_LANGUAGE_NAME } from '@idl/shared';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { AddCodeConfig } from './config/code-config';
import { AddIDLConfig } from './config/idl-config';
import { AddLanguageServerConfig } from './config/language-server-config';
import { AddNotebookConfig } from './config/notebook-config';
import { AddProblemsConfig } from './config/problems-config';
import { AddQuestionsConfig } from './config/questions-config';
import { AddTopLevelConfig } from './config/top-level-config';
import { EXTENSION_CONFIG } from './configuration.interface';
import { VerifyNLS } from './helpers/verify-nls';

/**
 * Processes the commands for our package.json file to make sure we are all kosher and
 * address any problems that we can.
 *
 * Builds and includes the command section in the package.json and adds some activation events
 */
export function ProcessConfiguration(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // root folder
  const ourConfig = {
    type: 'object',
    title: '%configuration.titles.root%',
    additionalProperties: false,
    properties: {},
  };

  // verify our translation
  if (!VerifyNLS(ourConfig.title, nls)) {
    throw new Error('Config title not in translation');
  }

  // save root config
  EXTENSION_CONFIG.push(ourConfig);

  // add all of our config sections
  AddTopLevelConfig(nls);
  AddIDLConfig(nls);
  AddCodeConfig(nls);
  AddLanguageServerConfig(nls);
  AddNotebookConfig(nls);
  AddProblemsConfig(nls);
  AddQuestionsConfig(nls);
  // AddDeveloperConfig(nls);

  // save our commands
  contrib['configuration'] = EXTENSION_CONFIG;

  /**
   * Add config for semantic tokens. From:
   *
   * https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#enablement-of-semantic-highlighting
   */
  contrib['configurationDefaults'] = {};
  contrib['configurationDefaults'][`[${IDL_LANGUAGE_NAME}]`] = {
    'editor.semanticHighlighting.enabled': true,
  };

  /**
   * Add config for opening outputs from notebook cells to work right
   *
   * https://stackoverflow.com/questions/75558543/vscode-unable-to-load-schema-for-package-json
   */
  // contrib['configurationDefaults']['workbench.settings.openDefaultSettings'] = true;
}
