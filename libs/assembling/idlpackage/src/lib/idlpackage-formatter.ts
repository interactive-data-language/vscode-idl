import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { JSONFormatter } from '@idl/assembling/json-formatter';

import { LCProps } from './helpers/lc-props';

/**
 * Formats a task and handles the logic of managing formatting for different task types
 */
export function IDLPackageFormatter<T extends FormatterType>(
  jsonString: string,
  options: IAssemblerOptions<T>
): string | undefined {
  try {
    /** Parse the file */
    const parsed = JSON.parse(jsonString);

    // make all keys lower case
    const mapped = LCProps(parsed);

    // make keys in dependencies LC as well
    if ('dependencies' in mapped) {
      const deps = mapped['dependencies'] as { [key: string]: any }[];
      for (let i = 0; i < deps.length; i++) {
        deps[i] = LCProps(deps[i]);
      }
    }

    // format and return
    return JSONFormatter(mapped, options);
  } catch (err) {
    return jsonString;
  }
}
