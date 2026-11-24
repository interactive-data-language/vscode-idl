import { IDL_COMMANDS, Sleep } from '@idl/shared/extension';
import expect from 'expect';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';
import * as vscode from 'vscode';

import type { RunnerFunction } from '../../runner.interface';

/** Wait for a file to exist, up to a timeout */
async function WaitForFile(file: string, timeoutMs = 10000) {
  const start = Date.now();
  while (!existsSync(file) && Date.now() - start < timeoutMs) {
    await Sleep(100);
  }
}

/**
 * Verifies that the commands to initialize idlformat.json, idlpackage.json,
 * and idltest.json create valid files and never overwrite existing files
 */
export const InitializeConfigFiles: RunnerFunction = async () => {
  const folder = mkdtempSync(join(tmpdir(), 'idl-init-'));

  try {
    const cases = [
      {
        command: IDL_COMMANDS.CODE.INITIALIZE_FORMATTING,
        file: 'idlformat.json',
      },
      {
        command: IDL_COMMANDS.CODE.INITIALIZE_PACKAGE,
        file: 'idlpackage.json',
      },
      { command: IDL_COMMANDS.CODE.INITIALIZE_TEST, file: 'idltest.json' },
    ];

    for (const { command, file } of cases) {
      const path = join(folder, file);

      // create the file
      await vscode.commands.executeCommand(command, folder);
      await WaitForFile(path);
      expect(existsSync(path)).toBeTruthy();

      // make sure it is valid JSON
      const parsed = JSON.parse(readFileSync(path, 'utf-8'));
      expect(typeof parsed).toEqual('object');

      // the package name defaults to the folder name
      if (file === 'idlpackage.json') {
        expect(parsed.name).toEqual(basename(folder));
      }

      // running again must not overwrite our changes
      writeFileSync(path, '{"sentinel": true}');
      await vscode.commands.executeCommand(command, folder);
      await Sleep(1000);
      expect(readFileSync(path, 'utf-8')).toEqual('{"sentinel": true}');
    }
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
};
