;+
; :Arguments:
;   tags: in, required, List<String>
;     Tags for the package
;   tagToAdd: in, required, String
;     Tag to add if it isn't already present
;
;-
pro vscode_createManifest_addTag, tags, tagToAdd
  compile_opt idl2, hidden
  on_error, 2

  ; save tag if not there
  if (tags.count(tagToAdd) eq 0) then tags.add, tagToAdd
end
