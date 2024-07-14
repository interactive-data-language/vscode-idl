;+
; :Private:
;
; :Description:
;   For a given file, returns all the known procedures for said file.
;
;   Used to help determine how to "run" a file when users hit the Run button.
;
; :Arguments:
;   file: in, required, String
;     Specify the file that we want to get all procedures for
;
;-
pro vscode_getFileRoutines, file
  compile_opt idl2, hidden
  on_error, 2

  ;+ track procedures found in this file
  procedures = list()

  ;+ get all pros
  pros = routine_info(/source)

  ; find procedures in our file
  for i = 0, n_elements(pros) - 1 do if pros[i].path eq file then procedures.add, pros[i].name

  ;+ track procedures found in this file
  functions = list()

  ;+ get all pros
  funcs = routine_info(/source, /functions)

  ; find procedures in our file
  for i = 0, n_elements(funcs) - 1 do if funcs[i].path eq file then functions.add, funcs[i].name

  ; print for use!
  print, json_serialize(hash('procedures', procedures, 'functions', functions))
end

compile_opt idl2

end