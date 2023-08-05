;+
; :Description:
;   Initializes IDL for running in notebooks
;
;-
pro vscode_notebookInit
  compile_opt idl2, hidden

  ; make sure super magic exists
  defsysv, '!super_magic', exists = _exists
  if ~_exists then defsysv, '!super_magic', orderedhash()

  ; make sure we initialize IDL Notebooks
  IDLNotebook__define
end