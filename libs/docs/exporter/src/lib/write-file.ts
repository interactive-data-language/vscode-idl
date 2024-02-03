import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

/**
 * Writes a file to disk and makes sure the parent folder exists
 */
export function WriteFile(file: string, content: string) {
  const dir = dirname(file);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(file, content);
}
