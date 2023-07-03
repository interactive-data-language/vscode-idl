import { IDLDebugAdapter } from './idl-debug-adapter.class';
import { IDLDebugStatusBar } from './idl-debug-status-bar';

/**
 * Results from initializing debugger
 */
export interface IInitializeDebuggerResult {
  /** Debug adapter for IDL */
  adapter: IDLDebugAdapter;
  /** Status bar tied into debugging */
  statusBar: IDLDebugStatusBar;
}
