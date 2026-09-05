;+
; :Private:
;
; :Description:
;   Initializes IDL for running in notebooks
;
;-
pro vscode_notebookInit
  compile_opt idl2, hidden
  on_error, 2

  ; make sure we initialize IDL Notebooks
  IDLNotebook__define
end