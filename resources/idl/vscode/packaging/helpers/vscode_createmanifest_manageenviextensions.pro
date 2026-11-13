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

  ; process each configured extension
  foreach extension, extensions do begin
    ;+ get path
    extensionUri = strjoin([dir, extension], path_sep())

    ; make sure it exists
    if ~file_test(extensionUri) then message, `Declared extension file doesn't exist: ${extensionUri}`
  endforeach

  ; save metadata
  metadata['envi_extension'] = extensions
end
