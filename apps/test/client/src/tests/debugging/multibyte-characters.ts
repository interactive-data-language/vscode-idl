import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { IDL_COMMANDS } from '@idl/shared/extension';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Array of test strings including Chinese characters and emojis
 * to verify multi-byte character handling in IDL output
 */
const TEST_STRINGS: string[] = [
  '成功',
  '你好，世界！',
  '中文测试',
  '😃',
  '🚀 World',
  '🎉 恭喜发财 💰',
];

/**
 * Encodes a JS UTF-8 string into a Latin-1 byte string so that IDL and idl_machine
 * process multi-byte characters (Chinese, emojis, etc.) without corruption.
 */
export function EncodeJSStringToIDL(str: string): string {
  return Buffer.from(str, 'utf8').toString('latin1');
}

export function SanitizeIDLCommand(command: string): string {
  const normalized = command
    // 1. Normalize Unicode to NFC (canonical composition)
    .normalize('NFC')
    // 2. Strip Byte Order Marks (BOM)
    .replace(/\uFEFF/g, '')
    // 3. Normalize line endings
    .replace(/\r\n/g, '\n');

  // Convert JS UTF-8 string bytes into a Latin-1 string so each byte maps 1:1 to a charCode.
  // This is the exact inverse of idl-machine-wrapper's output decoder:
  // Buffer.from(s, 'latin1').toString('utf8')
  return EncodeJSStringToIDL(normalized);
}

/**
 * Function that verifies Chinese characters and emojis are properly printed and returned
 * from IDL output without character corruption.
 */
export const MultibyteCharacters: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START,
  );

  // verify we started
  expect(started).toBeTruthy();

  for (let i = 0; i < TEST_STRINGS.length; i++) {
    console.log(`  Checking multibyte output for: "${i}"`);

    const testStr = TEST_STRINGS[i];

    /** Make nice command since VSCode handles that for us */
    const command = SanitizeIDLCommand(`print, '${testStr}'`);

    const res = await init.debug.adapter.evaluate(command, {
      echo: true,
    });

    /** strip new line */
    const cleanRes = CleanIDLOutput(res);

    // compare
    expect(cleanRes).toEqual(testStr);
  }
};
