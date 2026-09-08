;+
; :Private:
;
; :Description:
;   Returns basic information about our IDL session for use in VSCode
;
;   This gets version
;
;-
pro vscode_getIDLInfo
  compile_opt idl2, hidden
  ; get version information
  data = orderedhash(!version, /extract, /lowercase)
  data['dir'] = !dir

  ; print
  print, json_serialize(data)
end