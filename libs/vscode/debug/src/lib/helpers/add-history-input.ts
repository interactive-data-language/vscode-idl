import { platform } from 'os';

import { AddHistory } from './add-history';

/**
 * Adds input to the history file as a new entry/line
 */
export function AddHistoryInput(content: string) {
  AddHistory(platform() === 'win32' ? `\n${content}\n` : `\n\n${content}\n`);
}
