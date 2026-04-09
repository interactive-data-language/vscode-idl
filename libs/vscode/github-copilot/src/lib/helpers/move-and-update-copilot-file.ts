import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

/**
 * Migrates a GitHub copilot file (prompt or instructions) to a new
 * location and manages adding in custom user instructions
 */
export function MoveAndUpdateCopilotFile(
  sourceFile: string,
  destinationFolder: string,
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

  // if the file exists then lets check the version.
  const sourceContent = readFileSync(sourceFile, { encoding: 'utf-8' });
  const existingContent = readFileSync(destinationFile, { encoding: 'utf-8' });

  // Check for version differences in YAML frontmatter: description: '...(vX.X)'
  const yamlVersionRegex =
    /^---\s*\n(?:.*\n)*?description:\s*['"].*?\(v([\d.]+)\)['"]/im;

  const sourceMatch = sourceContent.match(yamlVersionRegex);
  const existingMatch = existingContent.match(yamlVersionRegex);

  // Determine if we need to update based on version
  let shouldUpdate = false;

  if (sourceMatch && existingMatch) {
    const sourceVersion = sourceMatch[1];
    const existingVersion = existingMatch[1];
    shouldUpdate = sourceVersion !== existingVersion;
  } else {
    // If no version found, compare entire content
    shouldUpdate = sourceContent !== existingContent;
  }

  // If versions match and no update needed, skip
  if (!shouldUpdate) {
    return;
  }

  // If the file exists, and the version is out of date, begin update

  // Preserve any custom user instructions.
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
   * Create new content with custom instructions preserved
   */
  const updatedContent = sourceContent + addStrings.join('\n');

  // Finally we write this new file to the correct location.
  writeFileSync(destinationFile, updatedContent.trim() + '\n');
}
