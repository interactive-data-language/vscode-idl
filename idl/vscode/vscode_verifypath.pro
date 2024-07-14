;+
; :Private:
;
; :Description:
;   Verifies that this folder is always on IDL's search path
;
;-
pro vscode_verifyPath
  compile_opt idl2, hidden
  on_error, 2

  ; get the current folder
  thisdir = file_dirname(routine_filepath())

  ; check if folder is not on our path
  if ~!path.contains(thisdir) then begin
    ; update preference and rebuild path cache
    pref_set, 'IDL_PATH', thisdir + path_sep(/search_path) + !path, /commit
    path_cache, /rebuild
  endif
end