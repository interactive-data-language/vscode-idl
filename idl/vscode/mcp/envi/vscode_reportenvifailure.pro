;+
; :Description:
;   Prints, for VSCode, if an ENVI process succeeded or not
;
; :Arguments:
;   reason: in, required, String
;     Why did we fail?
;   error: in, required, String
;     Additional detail for the error
;
; :Keywords:
;   machine: in, optional, Boolean
;     If set, report the message in a special way for the IDL Machine
;
;-
pro vscode_reportENVIFailure, reason, error, machine = machine
  compile_opt idl2, hidden
  on_error, 2

  out = orderedhash()
  out['succeeded'] = !false
  out['reason'] = keyword_set(reason) ? reason : ''
  out['error'] = keyword_set(error) ? error : ''

  if keyword_set(machine) then begin
    !null = IDLNotify('envi_failure', json_serialize(out))
  endif else begin
    print, json_serialize(out)
  endelse
end
