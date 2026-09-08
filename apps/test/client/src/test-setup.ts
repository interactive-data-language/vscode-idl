import { USER_ENVI_WORKFLOWS_FOLDER } from '@idl/idl/files';
import { Sleep } from '@idl/shared/extension';
import { existsSync, mkdirSync, unlinkSync } from 'fs';

import {
  USER_TOOL_WORKFLOW_FS,
  USER_TOOL_WORKFLOW_WRITE_FS,
} from './test-setup.interface';

/**
 * Set up tests
 */
export async function TestSetup() {
  // always run tear-down in case we are in a bad state
  await TestTeardown();

  /**
   * Set up user test workflow
   */
  if (!existsSync(USER_ENVI_WORKFLOWS_FOLDER)) {
    mkdirSync(USER_ENVI_WORKFLOWS_FOLDER);
  }

  // make sure user file is deleted
  if (existsSync(USER_TOOL_WORKFLOW_FS)) {
    unlinkSync(USER_TOOL_WORKFLOW_FS);
  }

  await Sleep(500);
}

/**
 * Tear down tests
 */
export async function TestTeardown() {
  if (existsSync(USER_TOOL_WORKFLOW_FS)) {
    unlinkSync(USER_TOOL_WORKFLOW_FS);
  }
  if (existsSync(USER_TOOL_WORKFLOW_WRITE_FS)) {
    unlinkSync(USER_TOOL_WORKFLOW_WRITE_FS);
  }
}
