;+
; :Returns: Array<String>
;
; :Arguments:
;   file: in, required, String
;     Fully-qualified file to read as string data
;
;-
function vscode_createManifest_readFile, file
  compile_opt idl2, hidden
  on_error, 2

  nLines = file_lines(file)
  strings = strarr(nLines)

  openr, lun, file, /get_lun
  readf, lun, strings
  free_lun, lun

  return, strings
end
