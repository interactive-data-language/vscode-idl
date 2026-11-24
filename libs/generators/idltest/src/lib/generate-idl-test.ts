import { DEFAULT_IDL_TEST } from '@idl/schemas/idltest';
import { IDL_TEST_URI } from '@idl/shared/extension';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Generator that creates an "idltest.json" file with default values for a folder
 *
 * @returns The file that we created
 */
export function GenerateIDLTest(folder: string) {
  /** Fully qualified filepath */
  const file = join(folder, IDL_TEST_URI);

  writeFileSync(file, `${JSON.stringify(DEFAULT_IDL_TEST, null, 2)}\n`);

  return file;
}
