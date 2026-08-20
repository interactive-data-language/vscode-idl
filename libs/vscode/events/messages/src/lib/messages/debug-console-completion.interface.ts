import { CompletionItem, Position } from 'vscode-languageserver';

/** Auto-complete in the debug console */
export type DebugConsoleCompletionMessage = 'debug-console-completion';

/*
 * Payload to generate auto-complete in the debug console
 */
export interface DebugConsoleCompletionPayload {
  /** Current code in terminal */
  code: string;
  /** Position for auto-complete in the code */
  position: Position;
  /** Current variables to add to completion */
  variables: string[];
}

/*
 * Response for debug console auto-completion
 */
export type DebugConsoleCompletionResponse = CompletionItem[];
