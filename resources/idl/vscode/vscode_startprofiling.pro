;+
; :Private:
;
; :Description:
;   Starts profiling the IDL interpreter
;
;-
pro vscode_startProfiling
  compile_opt idl2, hidden
  on_error, 2
  vscode_verifyPath

  ; turn on profiling
  profiler
  profiler, /system
  profiler, /code_coverage
end