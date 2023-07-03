import { Sleep } from '@idl/shared';
import { OutputEvent } from '@vscode/debugadapter';

import { IDL_DEBUG_ADAPTER } from '../../initialize-debugger';
import { TXT } from './txt';

/**
 * Delay, in ms, between sending each character
 */
const DELAY = 75; // ms

/**
 * Regex to check for .fu command
 */
export const FULL_RESET_REGEX = /(?:^|\s)\.fu\b/i;

/**
 * Adds some repartee when users are mean to IDL
 */
export async function Repartee() {
  try {
    // random index
    const idx = Math.floor(Math.random() * TXT.length);

    // extract statement
    const statement = TXT[idx];

    // "type" to user
    for (let i = 0; i < statement.length; i++) {
      IDL_DEBUG_ADAPTER.sendEvent(
        new OutputEvent(
          i === statement.length - 1 ? `${statement[i]}\n` : statement[i],
          'stderr'
        )
      );
      await Sleep(DELAY);
    }
  } catch (err) {
    console.error(err);
  }
}
