;+
; :Description:
;   Prints, for VSCode, if an ENVI process succeeded or not
;
; :Arguments:
;   success: in, required, Boolean
;     Did we succeed or not?
;   reason: in, required, String
;     Why did we fail?
;   error: in, required, String
;     Additional detail for the error
;
;-
pro vscode_reportENVISuccess, success, reason, error
  compile_opt idl2, hidden
  on_error, 2

  out = orderedhash()
  out['succeeded'] = keyword_set(success) ? !true : !false
  out['reason'] = keyword_set(reason) ? reason : ''
  out['error'] = keyword_set(error) ? error : ''

  print, json_serialize(out)
end
