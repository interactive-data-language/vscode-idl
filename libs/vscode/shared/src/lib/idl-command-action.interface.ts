export type IDLActionType =
  | 'Commands'
  | 'Compile'
  | 'Continue'
  | 'Execute'
  | 'File'
  | 'Open'
  | 'Open Webview'
  | 'Reset'
  | 'Run'
  | 'Start Profiling'
  | 'Step In'
  | 'Step Out'
  | 'Step Over'
  | 'Stop'
  | 'Stop Profiling';

export interface IDLCommandAction {
  execute?: string;
  label: IDLActionType;
}
