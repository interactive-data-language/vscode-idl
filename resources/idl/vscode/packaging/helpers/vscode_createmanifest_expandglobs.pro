;+
; Converts a glob pattern (using forward slashes) to a regular expression
;
; Supported syntax:
;   - `**/` matches zero or more folders
;   - `**` matches anything, including path separators
;   - `*` matches anything except path separators
;
; :Returns: String
;
; :Arguments:
;   pattern: in, required, String
;     Glob pattern with forward slashes
;
;-
function vscode_createManifest_globToRegex, pattern
  compile_opt idl2, hidden
  on_error, 2

  regex = '^'
  n = strlen(pattern)
  i = 0
  while (i lt n) do begin
    ch = strmid(pattern, i, 1)
    if (ch eq '*') then begin
      if (strmid(pattern, i, 2) eq '**') then begin
        if (strmid(pattern, i, 3) eq '**/') then begin
          regex += '(.*/)?'
          i += 3
        endif else begin
          regex += '.*'
          i += 2
        endelse
      endif else begin
        regex += '[^/]*'
        i++
      endelse
    endif else begin
      ; escape regular expression special characters
      if (strpos('.^$+?()[]{}|\', ch) ne -1) then regex += '\'
      regex += ch
      i++
    endelse
  endwhile

  return, regex + '$'
end

;+
; Expands glob patterns (`*` and `**`) in a list of declared files. Entries
; without a `*` are returned as-is.
;
; :Returns: List<String>
;   Paths relative to `dir`, using forward slashes
;
; :Arguments:
;   dir: in, required, String
;     Package directory
;   patterns: in, required, List<String>
;     Declared files and/or glob patterns
;
;-
function vscode_createManifest_expandGlobs, dir, patterns
  compile_opt idl2, hidden
  on_error, 2

  result = list()
  seen = hash()

  ; base folder with consistent separators
  base = file_expand_path(dir)
  base = base.replace('\', '/')
  if ~base.endsWith('/') then base += '/'
  isWindows = !version.os_family eq 'Windows'

  foreach pattern, patterns do begin
    ; literal paths pass through unchanged
    if ~pattern.contains('*') then begin
      if ~seen.hasKey(pattern) then begin
        seen[pattern] = !true
        result.add, pattern
      endif
      continue
    endif

    norm = pattern.replace('\', '/')

    ; find the static folder prefix to limit what we search
    segments = strsplit(norm, '/', /extract, /preserve_null)
    first = 0
    while (first lt n_elements(segments) - 1 && strpos(segments[first], '*') eq -1) do first++
    prefix = first gt 0 ? strjoin(segments[0 : first - 1], '/') : ''

    searchDir = prefix eq '' ? dir : strjoin([dir, prefix], path_sep())
    if ~file_test(searchDir, /directory) then message, `Glob pattern folder doesn't exist: ${pattern}`

    files = file_search(searchDir, '*', count = nFiles, /test_regular, /fully_qualify_path)

    matches = list()
    if (nFiles gt 0) then begin
      regex = vscode_createManifest_globToRegex(norm)
      foreach file, files do begin
        fileNorm = file.replace('\', '/')
        rel = strmid(fileNorm, strlen(base))
        if stregex(rel, regex, /boolean, fold_case = isWindows) then matches.add, rel
      endforeach
    endif

    if (matches.length eq 0) then message, `Glob pattern didn't match any files: ${pattern}`

    ; sort for consistent manifests
    matches = matches.toArray()
    foreach match, matches[sort(matches)] do begin
      if ~seen.hasKey(match) then begin
        seen[match] = !true
        result.add, match
      endif
    endforeach
  endforeach

  return, result
end
