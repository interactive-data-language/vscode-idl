import { USER_ENVI_WORKFLOWS_FOLDER } from '@idl/idl/files';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';

import { USER_TOOL_WORKFLOW_FS } from './test-setup.interface';

/**
 * Set up tests
 */
export async function TestSetup() {
  /**
   * Set up user test workflow
   */
  if (!existsSync(USER_ENVI_WORKFLOWS_FOLDER)) {
    mkdirSync(USER_ENVI_WORKFLOWS_FOLDER);
  }

  writeFileSync(USER_TOOL_WORKFLOW_FS, 'Test content for test workflow');
}

/**
 * Tear down tests
 */
export async function TestTeardown() {
  if (existsSync(USER_TOOL_WORKFLOW_FS)) {
    unlinkSync(USER_TOOL_WORKFLOW_FS);
  }
}
