import { IDLDiagnostic } from '@idl/types/diagnostic';
import * as vscode from 'vscode';

/**
 * Actually gets the diagnostics from VSCode UI that came from language server
 *
 * The API is broken (at least types are) and its just stupid that you cant easily
 * get what was sent via LSP
 */
export function GetRealDiagnostic(
  dumbDiags: vscode.Diagnostic[]
): IDLDiagnostic[] {
  const realDiags: IDLDiagnostic[] = [];

  for (let i = 0; i < dumbDiags.length; i++) {
    const stupidDiag = dumbDiags[i];
    realDiags.push({
      message: stupidDiag.message,
      data: (stupidDiag as any).data,
      range: {
        start: {
          line: stupidDiag.range.start.line,
          character: stupidDiag.range.start.character,
        },
        end: {
          line: stupidDiag.range.end.line,
          character: stupidDiag.range.end.character,
        },
      },
      severity: stupidDiag.severity as any,
      tags: stupidDiag.tags,
      source: stupidDiag.source,
    });
  }

  return realDiags;
}
