import { IDL_PACKAGE_URI } from '@idl/shared/extension';
import { writeFileSync } from 'fs';
import { basename, join } from 'path';

/**
 * Generator that creates an "idlpackage.json" file for a folder. The package
 * name defaults to the name of the folder.
 *
 * @returns The file that we created
 */
export function GenerateIDLPackage(folder: string) {
  /** Fully qualified filepath */
  const file = join(folder, IDL_PACKAGE_URI);

  writeFileSync(
    file,
    `${JSON.stringify(
      {
        name: basename(folder),
        version: '1.0.0',
        description: '',
        dependencies: [],
      },
      null,
      2,
    )}\n`,
  );

  return file;
}
