import { USER_ENVI_WORKFLOWS_FOLDER } from '@idl/idl/files';
import { join } from 'path';

/**
 * Name of tool workflow we set up
 */
export const USER_TOOL_WORKFLOW = 'my tool workflow';
export const USER_TOOL_WORKFLOW_FS = join(
  USER_ENVI_WORKFLOWS_FOLDER,
  `${USER_TOOL_WORKFLOW}.md`,
);
