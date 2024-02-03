;+
; :Private:
;
; :Description:
;   Returns information from IDL about a specific scope level which
;   contains information about the call stack, variables, and IDL's prompt.
;
; :Arguments:
;   level: in, optional, Number
;     Specify the scope level to extract information for. The default
;     level is 0.
;
; :Keywords:
;   output: out, optional, String
;     Contains the results from querying a specific scope level
;
;-
pro vscode_getScopeInfo, level, output = output
  compile_opt idl2, hidden
  on_error, 2
  vscode_verifyPath
  if ~keyword_set(level) then level = 0

  ; get prompt
  prompt = !prompt ; pref_get('IDL_PROMPT')

  ; reset prompt if it is not right - we wont ever get here if the
  ; prompt has a bad value. restarting IDL is the only current way to
  ; resolve prompt issues because we set the environment variable to change it
  if (prompt ne 'IDL> ' and prompt ne 'ENVI> ') then begin
    pref_set, 'idl_prompt', /default, /commit

    ; update value
    prompt = !prompt
  endif

  ; get traceback
  trace = scope_traceback(/structure)
  names = reverse(trace.(0))
  files = reverse(trace.(1))
  lines = reverse(trace.(2))
  if (names[-1] eq '$MAIN$') then begin
    track = routine_info('$MAIN$', /source)
    files[-1] = track.path
    ; check if we have a bad stack?
    ; DO THIS IN VSCODE since zero-length arrays are stupid in IDL
    ; if (files[-1] eq '') AND (lines[-1] eq 0) then begin
    ; remove the main level program
    ; if (n_elements(names) gt 1) then begin
    ; print, names
    ; help, names
    ; names = names[0:-2]
    ; files = files[0:-2]
    ; lines = lines[0:-2]
    ; endif
    ; endif
  endif
  traceback = '[' + strjoin('{"routine":"' + strlowcase(names[1 : -1]) + '","file":"' + (files.replace('\', '\\'))[1 : -1] + '","line":' + strtrim(lines[1 : -1], 2) + '}', ',') + ']'

  ; get content
  help, output = o, level = level - 1

  ; strip out compiled routines
  idxEnd = where(strpos(o, 'Compiled Procedures:') eq 0)

  ; check for ENVI using the prompt
  if prompt.startsWith('ENVI') then begin
    add = ',"envi":true'
  endif else begin
    add = ',"envi":false'
  endelse

  ; check for envi using static properties
  ; is sooo much faster (>1000x) than envi(/CURRENT) UNTIL envi is started and closed
  ; then this takes forever, so that is why we dont use it anymore, but it is still here
  ; which is OK because it also changes the last message
  ; catch, err
  ; if (err ne 0) then begin
  ; catch, /CANCEL
  ; add = ',"envi":false'
  ; endif else begin
  ; !null = envi.widget_id
  ; add = ',"envi":true'
  ; endelse
  ; catch, /CANCEL

  ; check if we dont have any variables
  if strpos(o[idxEnd[0] - 1], '%') eq 0 then begin
    output = '{"scope":' + traceback + ',"variables":[]' + add + '}'
    print, output
    return
  endif

  ; should ALWAYS have compiled procedures even if there are none
  strings = o[0 : idxEnd - 1]

  ; trim teh traceback at the beginning of the help content
  front = where(strpos(strings, '%') ne -1)

  ; get the helper strings
  strings = strings[front[-1] + 1 : -1]

  ; find the ones to process
  idxGo = where(strpos(strings, ' ') ne 0, countGo, complement = idxJoin, ncomplement = countJoin)

  ; check if we dont have any variables
  if (countGo eq 0) then begin
    output = '{"scope":' + traceback + ',"variables":[]' + add + '}'
    print, output
    return
  endif

  ; add the rest of the strings
  if (countJoin gt 0) then strings[idxJoin - 1] += strings[idxJoin]

  ; find variables
  allMatches = stregex(strings, '([_a-z][_a-z0-9$]*) *([_a-z][_a-z0-9$]*)(.*)', /subexpr, /extract, /fold_case)
  aPos = strpos(allMatches[3, *], '= Array[')
  ePos = strpos(allMatches[3, *], '=')

  ; process each line
  output = strarr(3, countGo)
  foreach idx, idxGo, iout do begin
    ; get our matches
    matches = allMatches[*, idx]

    ; get the type
    type = matches[2]

    ; check how to process the string
    case !true of
      type eq 'BYTE': goto, process
      type eq 'INT': goto, process
      type eq 'LONG': goto, process
      type eq 'FLOAT': goto, process
      type eq 'DOUBLE': goto, process
      type eq 'UINT': goto, process
      type eq 'ULONG': goto, process
      type eq 'LONG64': goto, process
      type eq 'STRING' and (aPos[idx] ne -1): goto, process
      type eq 'ULONG64': begin
        process:
        if (aPos[idx] ne -1) then begin
          desc = '"' + strtrim(strmid(matches[3], aPos[idx] + 2), 2) + '"'
        endif else begin
          desc = strtrim(strmid(matches[3], ePos[idx] + 1), 2)
        endelse
      end
      type eq 'OBJREF': begin
        name = stregex(matches[3], '\<ObjHeapVar[0-9]*\(([_a-z][_a-z0-9$]*)\)\>', /subexpr, /extract, /fold_case)
        desc = '"' + name[1] + '"'
      end
      else: desc = '"' + type + '"'
    endcase

    ; lower
    output[*, iout] = [matches[1], type, desc]
  endforeach

  ; lower case
  output = strlowcase(temporary(output))
  variables = '[' + strjoin('{"name":"' + strtrim(reform(output[0, *]), 2) + '","type":"' + strtrim(reform(output[1, *]), 2) + '","description":' + strtrim(reform(output[2, *]), 2) + '}', ',') + ']'

  ; make our json
  output = '{"scope":' + traceback + ',"variables":' + variables + '' + add + '}'
  print, output

  ; get breakpoints
  ; help, /BREAKPOINTS, OUTPUT = strings
  ;
  ; make single line
  ; idxGo = where(strpos(strings, ' ') ne 0, countGo, COMPLEMENT=idxJoin, NCOMPLEMENT=countJoin)
  ;
  ; add the rest of the strings
  ; if (countJoin gt 0) then strings[idxJoin-1] += strings[idxJoin]
  ; strings = strings[idxGo]
  ;
  ; if (n_elements(o) eq 1) then begin
  ; breakpoints = '[]'
  ; endif else begin
  ; allMatches = stregex(o[1:-1], '[0-9]* *([0-9]*) *[a-z ]* (.*)', /SUBEXPR, /EXTRACT, /FOLD_CASE)
  ; breakpoints = '[' + strjoin('{"line":' + allMatches[1,*] + ',"file":"' + allMatches[2,*].replace('\', '\\') + '"}', ',') + ']'
  ; endelse
  ;
  ; stop
end