;+
; :Private:
;
; :Description:
;   For a given file, calculates code coverage for a given file
;
;   Outputs an array of flags for each line being processed or not.
;
;   Value of zero is that it is a comment/ignores
;
;   Value of 1 is not executed
;
;   Value of 2 is executed
;
; :Arguments:
;   file: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro vscode_getFileCodeCoverage, file
  compile_opt idl2, hidden

  ;+ init flags for code coverage
  coverage = bytarr(file_lines(file))

  ;+ get all pros
  pros = routine_info(/source)

  ; find procedures in our file
  for i = 0, n_elements(pros) - 1 do begin
    ; check if our routine lives in our file
    if pros[i].path eq file then begin
      notRun = code_coverage(pros[i].name, executed = ran, /include_end)

      ; update converage
      coverage[notRun - 1] = 1
      coverage[ran - 1] = 2
    endif
  endfor

  ;+ get all functions
  funcs = routine_info(/source, /functions)

  ; find procedures in our file
  for i = 0, n_elements(funcs) - 1 do begin
    ; check if our routine lives in our file
    if funcs[i].path eq file then begin
      notRun = code_coverage(funcs[i].name, executed = ran, /include_end)

      ; update converage
      coverage[notRun - 1] = 1
      coverage[ran - 1] = 2
    endif
  endfor

  ; print result
  print, json_serialize(coverage)
end