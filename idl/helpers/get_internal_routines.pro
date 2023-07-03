
;+
;
; Purpose of this file is to work through the logic for how formatting of IDL routines
; should work. This is NOT for internal users (meaning VIS emplyees). We are trying to
; start fresh and leave behind the baggage of past (and retro) IDL formatting practices.
;
;-

compile_opt idl2, hidden

e = envi()

routines = [routine_info(/SYSTEM, /FUNCTIONS), routine_info(/SYSTEM)]

; check for methods
pos = strpos(routines, '::')
idxFix = where(pos ne -1, countFix)
if (countFix ne 0) then begin
  routines[idxFix] = ((strsplit(routines[idxFix], '::', /EXTRACT)).toArray())[*,0]
endif

; get unique
routines = routines.uniq()

; process all of our routines
foreach routine, routines, idx do begin
  case !true of
    routine.startsWith('IDL') AND ~routine.startsWith('IDL_'): ; do nothing
    routine.startsWith('ENVI') AND ~routine.startsWith('ENVI_'): ; do nothing
    else: routines[idx] = strlowcase(routine)
  endcase
endforeach

; formatting logic for internal routines
; 1. by default, lower case of routine names unless
; 2. routine starts with "IDL" or "ENVI" then PascalCase
; 3. for user/PRO code routines, name will match the case of the definition
;
; Might be able to use this too: https://www.npmjs.com/package/change-case

message, 'this'
catch, err
return, val


end