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
pro vscode_getFileProcedures, file
  compile_opt idl2, hidden

  ;+ track procedures found in this file
  found = list()

  ;+ get all pros
  pros = routine_info(/source)

  ; find procedures in our file
  for i = 0, n_elements(pros) - 1 do if pros[i].path eq file then found.add, pros[i].name

  ; print for use!
  print, json_serialize(found)
end