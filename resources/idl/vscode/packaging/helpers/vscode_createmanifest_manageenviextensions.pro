;+
; :Arguments:
;   dir: in, required, String
;     Package directory
;   metadata: in, required, Hash<any>
;     Package metadata
;   extensions: in, required, List<String>
;     The declared extensions
;
;-
pro vscode_createManifest_manageENVIExtensions, dir, metadata, extensions
  compile_opt idl2, hidden
  on_error, 2

  ; return if nothing to save
  if (n_elements(extensions) eq 0) then return

  ; resolved extension files, which may be compiled to SAV
  resolved = list()

  ; process each configured extension
  foreach extension, extensions do begin
    ;+ get path
    extensionUri = strjoin([dir, extension], path_sep())

    ; use the file as-is if it exists
    if file_test(extensionUri) then begin
      resolved.add, extension
      continue
    endif

    ; check for SAV file
    if ~file_test(extensionUri.replace('.pro', '.sav')) then message, `Declared extension file doesn't exist: ${extensionUri} (or as a .sav file)`

    ; save modified file
    resolved.add, extension.replace('.pro', '.sav')
  endforeach

  ; save metadata
  metadata['envi_extension'] = resolved
end
