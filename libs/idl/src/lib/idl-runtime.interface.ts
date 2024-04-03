/**
 * An item that we want to execute
 */
export interface IDLExecutorItem {
  /** Callback that gets called when we finish which returns the output from IDL */
  execute: () => Promise<void>;
  /** Rejection callback so we can nicely exit */
  reject: (reason: string) => void;
}
