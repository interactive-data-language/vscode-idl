import { IDL_DEBUG_ADAPTER } from '@idl/vscode/debug';
import { compareVersions } from 'compare-versions';

/**
 * Makes sure that we have the right version of IDL for some MCP tools
 *
 * Some tools require the IDL machine as a formal way to send content back and forth
 */
export function MCPVerifyIDLVersion() {
  const info = IDL_DEBUG_ADAPTER.idlVersion;

  // make sure we have info (problem or not started if missing)
  if (!info) {
    return false;
  }

  // if value is less than 1, then we have a problem
  return compareVersions(info.release, '9.2.0') === -1;
}
