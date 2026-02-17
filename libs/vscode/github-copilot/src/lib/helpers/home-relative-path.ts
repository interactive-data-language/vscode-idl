import { homedir } from 'os';

/**
 * Returns home-relative path for a given absolute path
 */
export function HomeRelativePath(absolutePath: string): string {
  return absolutePath.replace(homedir(), '~').replace(/\\/g, '/');
}
