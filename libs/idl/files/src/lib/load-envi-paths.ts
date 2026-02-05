import { existsSync, readFileSync } from 'fs';
import { basename, dirname, join } from 'path';

import { DOT_IDL_FOLDER } from './dot-idl-folder.interface';

/**
 * Loads search paths from ENVI using ENVI's preference file on disk
 *
 * We do this because the preferences are all JSON
 */
export function LoadENVIPaths(bin: string) {
  /** ENVI's search paths for IDL and tasks */
  const paths: string[] = [];

  /** Get ENVI's potejtial folder */
  const enviDir = dirname(dirname(dirname(bin)));

  // check for an ENVI folder
  if (basename(enviDir).toLowerCase().startsWith('envi')) {
    /** Get ENVI version string */
    const version = basename(enviDir).toLowerCase().replace('envi', '');

    /** Check for preferences JSON */
    const preferencesUri = join(
      DOT_IDL_FOLDER,
      'envi',
      `preferences${version[0]}_${version[1]}`,
      'envi_preferences.json'
    );

    // see if it exists
    if (existsSync(preferencesUri)) {
      try {
        const parsed = JSON.parse(readFileSync(preferencesUri, 'utf-8'));
        const dirs = parsed['directories and files'];

        // remove trailing path  separators
        paths.push(dirs['custom code directory'].replace(/(?:\\|\/)$/, ''));
        paths.push(dirs['extensions directory'].replace(/(?:\\|\/)$/, ''));
        paths.push(
          dirs['local repository directory'].replace(/(?:\\|\/)$/, '')
        );
      } catch (err) {
        console.warn(err);
      }
    }

    /**
     * Get custom code folder
     */
    const customCode = join(enviDir, 'custom_code');

    // add custom code to the paths
    if (existsSync(customCode)) {
      paths.push(customCode);
    }

    /**
     * Get extensions
     */
    const extensions = join(enviDir, 'extensions');

    // add custom code to the paths
    if (existsSync(extensions)) {
      paths.push(extensions);
    }

    /** Check for custom code environment variable */
    if ('ENVI_CUSTOM_CODE' in process.env) {
      if (existsSync(process.env['ENVI_CUSTOM_CODE'])) {
        paths.push(process.env['ENVI_CUSTOM_CODE']);
      }
    }
  }

  return paths;
}
