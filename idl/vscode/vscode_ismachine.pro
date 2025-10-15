;+
; :Description:
;   Returns true if we are in the IDL machine or not
;
;   Set from within VSCode
;
; :Returns: Boolean
;
;-
function vscode_isMachine
  compile_opt idl2, hidden
  on_error, 2

  return, getenv('IDL_IS_IDL_MACHINE') ? !true : !false
end
