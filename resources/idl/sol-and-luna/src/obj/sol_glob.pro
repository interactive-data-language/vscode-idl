;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Finds files under a root folder using glob patterns, like the
;   `include` and `exclude` lists of the `idltest.json` file.
;
;   Pattern syntax, matched against the path of each file relative
;   to `root`:
;
;   - `*` matches any number of characters within one folder or file name.
;   - `?` matches exactly one character within one folder or file name.
;   - `**` as a whole folder name (`src/**/*.pro`) matches zero or more folders.
;   - A pattern ending in `/` matches everything below that folder.
;   - `/` and `\` can both be used as separators in patterns.
;   - Matching is case-insensitive on Windows and case-sensitive elsewhere.
;   - Parent folder references (`..`) are not supported.
;
;   A file is returned if it matches at least one `include` pattern and
;   no `exclude` pattern.
;
; :Returns: any
;
; :Arguments:
;   root: in, required, String
;     Folder that the patterns are relative to.
;   include: in, optional, String | Array<String>
;     Patterns for the files to return. Nothing is returned if not specified.
;   exclude: in, optional, String | Array<String>
;     Patterns for the files to remove from the results.
;
; :Keywords:
;   count: out, optional, Long
;     Set to a named variable to retrieve the number of files returned.
;
; :Examples:
;   Find all of the PRO files under `src`, excluding the tests:
;
;   ```idl
;   files = sol_glob(dir, 'src/**/*.pro', '**/*.spec.pro', COUNT = count)
;   ```
;
;-
function sol_glob, root, include, exclude, count = count
  compile_opt idl2, hidden
  on_error, 2

  count = 0
  sol_validate, hash('root', ['required', 'string'])
  if (n_elements(include) eq 0) then return, !null
  sol_validate, hash('include', 'string')
  if (n_elements(exclude) gt 0) then sol_validate, hash('exclude', 'string')

  ; work with / internally and fold case for platforms with case-insensitive paths
  base = (file_expand_path(root)).replace('\', '/')
  if (strlen(base) gt 1) and base.endsWith('/') then base = strmid(base, 0, strlen(base) - 1)
  if ~file_test(base, /directory) then begin
    message, 'Root folder does not exist: ' + root
  endif
  fold = (!version.os_family eq 'Windows')

  found = list()
  foreach pattern, [include] do begin
    glob = (strtrim(pattern, 2)).replace('\', '/')
    while glob.startsWith('./') do glob = strmid(glob, 2)
    if (glob eq '') then continue
    if glob.endsWith('/') then glob += '**'
    segments = strsplit(glob, '/', /extract, count = nSeg)
    if (total(segments eq '..') gt 0) then begin
      message, 'Parent folder references ("..") are not supported in pattern: ' + pattern
    endif

    ; only search below the folders at the start of the pattern that have no wildcards
    searchDir = base
    for i = 0, nSeg - 2 do begin
      if (strpos(segments[i], '*') ne -1) or (strpos(segments[i], '?') ne -1) then break
      searchDir += '/' + segments[i]
    endfor
    if ~file_test(searchDir, /directory) then continue

    paths = file_search(searchDir, '*', /test_regular, count = nPaths)
    if (nPaths eq 0) then continue
    paths = paths.replace('\', '/')
    relative = strmid(paths, strlen(base) + 1)
    idx = where(stregex(relative, sol_glob_regex(glob), /boolean, fold_case = fold), nMatch)
    if (nMatch gt 0) then found.add, paths[idx], /extract
  endforeach
  if (n_elements(found) eq 0) then return, !null

  files = found.toArray()

  ; remove everything that is excluded
  if (n_elements(exclude) gt 0) then begin
    foreach pattern, [exclude] do begin
      glob = (strtrim(pattern, 2)).replace('\', '/')
      while glob.startsWith('./') do glob = strmid(glob, 2)
      if (glob eq '') then continue
      if glob.endsWith('/') then glob += '**'
      relative = strmid(files, strlen(base) + 1)
      idx = where(~stregex(relative, sol_glob_regex(glob), /boolean, fold_case = fold), nKeep)
      if (nKeep eq 0) then return, !null
      files = files[idx]
    endforeach
  endif

  ; sort and remove duplicates from overlapping patterns
  compare = fold ? strlowcase(files) : files
  files = files[uniq(compare, sort(compare))]
  count = n_elements(files)
  return, files.replace('/', path_sep())
end
