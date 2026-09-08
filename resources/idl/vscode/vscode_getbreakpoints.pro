;+
; :Private:
;
; :Description:
;   Gets breakpoint information from IDL about current breakpoints and the
;   lines that they are on.
;
;   JSON output is minified and the keys should match idl.class for getting breakpoint
;   information.
;
;-
pro vscode_getBreakpoints
  compile_opt idl2, hidden
  on_error, 2
  vscode_verifyPath

  ; get the breakpoints
  help, /breakpoints, output = o

  ; recursively collapse
  while !true do begin
    idxSpace = where(strpos(o, ' ') eq 0, countSpace)
    if (countSpace gt 0) then begin
      o[idxSpace - 1] += o[idxSpace]
      o[idxSpace] = ''
    endif else begin
      break
    endelse
  endwhile

  ; remove empty white space
  idx = where(o, count)
  if (count gt 0) then o = o[idx]

  ; remove first which is the table header
  if (n_elements(o) gt 1) then begin
    o = o[1 : -1]
  endif else begin
    print, '[]', /implied_print
    return
  end

  ; process each thing
  m1 = stregex(o, '^([0-9]+) *([0-9]+)', /fold_case, /subexpr, /extract)
  l1 = strlen(reform(m1[0, *]))

  ; get the files
  if (!version.os eq 'Win32') then begin
    p2 = stregex(o, '[a-z]:\\[\\ |* ]?.*$', /fold_case, length = l2)
  endif else begin
    p2 = stregex(o, '\/([a-z0-9_+.-]+\/)*([a-z0-9_+.-]+)$', /fold_case, length = l2)
  endelse
  m2 = strmid(o, p2, l2)

  ; get information about the breakpoints
  info = strtrim(strmid(o, l1, p2 - l1), 2)

  ; print them
  print, '[' + strjoin('{"i":' + reform(m1[1, *]) + ',"l":' + reform(m1[2, *]) + ',"a":"' + reform(info) + '","f":"' + m2.replace('\', '\\') + '"}', ',') + ']', /implied_print
end