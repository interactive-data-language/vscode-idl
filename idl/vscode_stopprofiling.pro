;+
; :Description:
;   Stops profiling the IDL interpreter
;
;-
pro vscode_stopProfiling
  compile_opt idl2, hidden
  on_error, 2
  vscode_verifyPath

  ; turn off profiling
  profiler, /report, /code_coverage, data = data
  profiler, /reset
  profiler, /clear

  ; summarize results, minified JSON for faster creation and parsing
  if (n_elements(data) eq 0) then begin
    print, '[]'
    return
  endif
  json = '[' + strjoin('{"r":"' + data.(0) + '","n":' + strtrim(data.(1), 2) + ',"t":' + strtrim(data.(3), 2) + ',"t_s":' + strtrim(data.(2), 2) + ',"sys":' + strtrim(uint(data.(4)), 2) + ',"l_r":' + strtrim(data.(5), 2) + ',"l_t":' + strtrim(data.(6), 2) + '}', ',') + ']'
  print, json
end