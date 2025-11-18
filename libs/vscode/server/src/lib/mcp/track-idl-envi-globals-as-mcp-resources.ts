import { TrackServerResource } from '@idl/mcp/server-tools';
import { IDL_GLOBAL_TOKENS } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';

/**
 * Track routines from global.json (i.e. product documentation) for
 * MCP to query more about our tools
 */
export function TrackIDLENVIGlobalsAsMCPResources() {
  /** Get al global tokens */
  const globals = IDL_GLOBAL_TOKENS;

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
