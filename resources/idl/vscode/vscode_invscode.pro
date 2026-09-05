;+
; :Description:
;   Returns true if we are running in IDL for VSCode
;
;   Set from within VSCode in idl-process.class.ts
;
; :Returns: Boolean
;
;-
function vscode_inVSCode
  compile_opt idl2, hidden
  on_error, 2

  return, getenv('IDL_FOR_VSCODE') ? !true : !false
end
