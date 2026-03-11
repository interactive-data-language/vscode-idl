import { EXTENSION_FULL_NAME } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';

import { IPackageJSON, IPackageNLS } from '../package.interface';

/**
 * Updates the package.json file to list our MCP server that we provide
 */
export function ProcessMCP(packageJSON: IPackageJSON, nls: IPackageNLS) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  /**
   * Add primary MCP server that we provide
   */
  contrib['mcpServerDefinitionProviders'] = [
    {
      id: EXTENSION_FULL_NAME,
      label: IDL_TRANSLATION.packageJSON.displayName,
      description:
        'Provides MCP tools for IDL code analysis, documentation, and ENVI integration',
    },
  ];
}
