import { TrackServerResource } from '@idl/mcp/server-tools';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';

import { IDL_INDEX } from '../events/initialize-document-manager';

/**
 * Update server resources for global tokens in some files
 *
 * TODO: Deleting resources from past cache because we may change
 * names or delete items
 */
export function UpdateMCPServerResources(files: string[]) {
  // process all files that have changed
  for (let i = 0; i < files.length; i++) {
    // make sure we know about the file
    if (files[i] in IDL_INDEX.globalIndex.globalTokensByFile) {
      /** Get al global tokens */
      const globals = IDL_INDEX.globalIndex.globalTokensByFile[files[i]];

      // process each one and track as necessary
      for (let j = 0; j < globals.length; j++) {
        /** Track updates */
        const globalj = globals[j];

        // TODO: add each type of relevant global token
        switch (globalj.type) {
          case GLOBAL_TOKEN_TYPES.FUNCTION:
            TrackServerResource(
              `idl-function-docs-${globalj.name}`,
              '',
              globalj.meta.docs
            );
            break;
          case GLOBAL_TOKEN_TYPES.STRUCTURE:
            TrackServerResource(
              `idl-structure/class-${globalj.name}`,
              '',
              globalj.meta.docs
            );
            break;
          default:
            break;
        }
      }
    }
  }
}
