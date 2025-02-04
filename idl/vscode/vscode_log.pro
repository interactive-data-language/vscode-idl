;+
; :Arguments:
;   item: in, required, Hash<any>
;     A JSON serializable object to be logged in the VSCode
;     client
;
; :Keywords:
;   level: in, optional, String
;     The log level to report, the default value is debug which
;     does not always get printed to VSCode
;
;     Other values are: 'debug' | 'info' | 'warn' | 'error'
;
;-
pro vscode_log, item, level = level
  compile_opt idl2, hidden
  on_error, 2

  ; return if not in the IDL Machine
  if ~vscode_isMachine() then return

  ; log level
  if ~isa(level, /string) then level = 'info'

  ; alert VSCode
  !null = IDLNotify('vscode-log', level, json_serialize(hash('message', item)))
end
