import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { JSONFormatter } from '@idl/assembling/json-formatter';
import { IDL_JSON_URI } from '@idl/shared';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Generator that creates our "idl.json" config file for us
 * and is a dedicated place to store the logic for creating this.
 */
export function GenerateIDLJSON(
  folder: string,
  config: IAssemblerOptions<FormatterType>
) {
  // remove keys that we dont need in the local file
  delete config.spaceOffset;
  delete config.formatter;
  delete config.eol;

  /** Fully qualified filepath */
  const file = join(folder, IDL_JSON_URI);

  // write data to disk
  writeFileSync(file, JSONFormatter(config, config));

  // return the file we generated
  return file;
}
