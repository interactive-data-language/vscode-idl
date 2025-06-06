;+
; :Description:
;   Lets VSCode know if we finished an ENVI process successfully
;
; :Arguments:
;   payload: in, required, any
;     The JSON-serializeable response for ENVI when we are finished
;     processing
;
;-
pro vscode_reportENVISuccess, payload
  compile_opt idl2, hidden
  on_error, 2

  out = orderedhash()
  out['succeeded'] = !true
  out['payload'] = payload

  print, json_serialize(out)
end
