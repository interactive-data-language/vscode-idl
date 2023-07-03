import { IDLDebugAdapter } from '../idl-debug-adapter.class';
import { SyncSyntaxProblems } from './sync-syntax-problems';

/**
 * Synchronizes syntax problems from compilation errors with vscode
 */
export function ResetSyntaxProblems(debug: IDLDebugAdapter) {
  // get syntax problems
  const allProblems = debug.getSyntaxProblems();

  // get and reset each file we have tracked
  const files = Object.keys(allProblems);
  for (let i = 0; i < files.length; i++) {
    allProblems[files[i]] = [];
  }

  // sync problems
  SyncSyntaxProblems(debug);
}
