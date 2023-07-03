import { IDL_TRANSLATION } from '@idl/translation';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import { IDLDebugAdapter } from '../idl-debug-adapter.class';

/**
 * VSCode debug diagnostic collection
 */
const DEBUG_DIAGNOSTIC_COLLECTION =
  vscode.languages.createDiagnosticCollection('idl-debug');

/**
 * Synchronizes syntax problems from compilation errors with vscode
 */
export function SyncSyntaxProblems(debug: IDLDebugAdapter) {
  // get syntax problems
  const allProblems = debug.getSyntaxProblems();

  // get and process each file
  const files = Object.keys(allProblems);
  for (let i = 0; i < files.length; i++) {
    // init result
    const diags: vscode.Diagnostic[] = [];

    // get and process all problems
    const problems = allProblems[files[i]];
    for (let j = 0; j < problems.length; j++) {
      diags.push({
        message: IDL_TRANSLATION.debugger.adapter.syntaxError,
        range: new vscode.Range(
          new vscode.Position(problems[j].line - 1, 0),
          new vscode.Position(problems[j].line - 1, Number.MAX_VALUE)
        ),
        severity: vscode.DiagnosticSeverity.Error,
      });
    }

    // if we have problems, open the file
    if (diags.length > 0) {
      OpenFileInVSCode(files[i]);
    }

    DEBUG_DIAGNOSTIC_COLLECTION.set(vscode.Uri.file(files[i]), diags);
  }
}
