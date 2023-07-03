export type IDLActionType =
  | 'Commands'
  | 'Open'
  | 'Compile'
  | 'Run'
  | 'Stop'
  | 'Continue'
  | 'Step In'
  | 'Step Over'
  | 'Step Out'
  | 'Reset'
  | 'Execute'
  | 'Open Webview'
  | 'Start Profiling'
  | 'Stop Profiling'
  | 'File';

export interface IDLCommandAction {
  label: IDLActionType;
  execute?: string;
}
