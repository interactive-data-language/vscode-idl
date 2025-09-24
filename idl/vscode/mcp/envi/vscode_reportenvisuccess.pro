;+
; :Description:
;   Lets VSCode know if we finished an ENVI process successfully
;
; :Arguments:
;   payload: in, required, any
;     The JSON-serializeable response for ENVI when we are finished
;     processing
;
; :Keywords:
;   machine: in, optional, Boolean
;     If set, report the message in a special way for the IDL Machine
;
;-
pro vscode_reportENVISuccess, payload, machine = machine
  compile_opt idl2, hidden
  on_error, 2

  out = orderedhash()
  out['succeeded'] = !true
  out['payload'] = payload

  if keyword_set(machine) then begin
    !null = IDLNotify('envi_success', json_serialize(out))
  endif else begin
    print, json_serialize(out)
  endelse
end
