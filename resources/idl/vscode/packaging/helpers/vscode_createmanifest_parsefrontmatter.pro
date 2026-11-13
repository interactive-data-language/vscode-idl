;+
; :Description:
;   Parse the YAML frontmatter at the start of a file (simple `key: value` pairs)
;
;   Frontmatter keys (lowercase) and values. Empty if there is no frontmatter.
;
; :Returns: Hash<String>
;
; :Arguments:
;   file: in, required, String
;     Fully-qualified file to parse
;
;-
function vscode_createManifest_parseFrontmatter, file
  compile_opt idl2, hidden
  on_error, 2

  result = orderedhash()
  strings = vscode_createManifest_readFile(file)

  ; frontmatter must start on the first line
  if (n_elements(strings) eq 0 || strtrim(strings[0], 2) ne '---') then return, result

  for i = 1, n_elements(strings) - 1 do begin
    line = strings[i]
    if (strtrim(line, 2) eq '---') then break

    ; split on first colon
    pos = strpos(line, ':')
    if (pos le 0) then continue

    key = strlowcase(strtrim(strmid(line, 0, pos), 2))
    value = strtrim(strmid(line, pos + 1), 2)

    ; remove wrapping quotes
    len = strlen(value)
    if (len ge 2) then begin
      first = strmid(value, 0, 1)
      if ((first eq `'` || first eq `"`) && strmid(value, len - 1, 1) eq first) then $
        value = strmid(value, 1, len - 2)
    endif

    result[key] = value
  endfor

  return, result
end
