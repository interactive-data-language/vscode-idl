;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;   Converts a glob pattern into a regular expression that is matched
;   against paths relative to the search root, which always use `/`.
;
; :Returns: String
;
; :Arguments:
;   glob: in, required, String
;     Glob pattern using `/` as the separator.
;
;-
function sol_glob_regex, glob
  compile_opt idl2, hidden

  regex = '^'
  n = strlen(glob)
  i = 0
  while (i lt n) do begin
    ch = strmid(glob, i, 1)
    advance = 1
    case ch of
      '*': begin
        if (strmid(glob, i, 2) eq '**') then begin
          ; "**/" matches zero or more folders, any other "**" matches anything
          if (strmid(glob, i, 3) eq '**/') then begin
            regex += '(.*/)?'
            i += 3
          endif else begin
            regex += '.*'
            i += 2
          endelse
          advance = 0
        endif else begin
          regex += '[^/]*'
        endelse
      end
      '?': regex += '[^/]'
      else: regex += (strpos('.+^$()[]{}|\', ch) ne -1) ? '\' + ch : ch
    endcase
    i += advance
  endwhile

  return, regex + '$'
end
