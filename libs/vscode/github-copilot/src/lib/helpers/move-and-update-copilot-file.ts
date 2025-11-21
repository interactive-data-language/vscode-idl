import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

/**
 * Migrates a GitHub copilot file (prompt or instructions) to a new
 * location and manages adding in custom user instructions
 */
export function MoveAndUpdateCopilotFile(
  sourceFile: string,
  destinationFolder: string
) {
  // make sure the destination folder exists
  if (!existsSync(destinationFolder)) {
    mkdirSync(destinationFolder, { recursive: true });
  }

  /**
   * Get full path to copy a file to
   */
  const destinationFile = join(destinationFolder, basename(sourceFile));

  // make sure folder exists
  if (!existsSync(destinationFile)) {
    cpSync(sourceFile, destinationFile);
    return;
  }

  // if the file exists, check if we need to update
  const existingContent = readFileSync(destinationFile, { encoding: 'utf-8' });

  /** Split content */
  const split = existingContent.split(/\r?\n/g);

  /** Track strings that we need to add to the instructions */
  let addStrings: string[] = [];

  // check for user content
  const idxUser = split
    .map((str) => str.toLowerCase().trim())
    .indexOf('## additional instructions');
  if (idxUser !== -1) {
    addStrings.push('');
    addStrings = addStrings.concat(split.slice(idxUser));
    addStrings.push('');
  }

  /**
   * Create source content with custom instructions included
   */
  const sourceContent =
    readFileSync(sourceFile, { encoding: 'utf-8' }) + addStrings.join('\n');

  /**
   * Write out content to disk
   */
  writeFileSync(destinationFile, sourceContent);
}
