;+
; :Description:
;   Fix filepaths that are incorrect in the lookup
;
; :Returns: OrderedHash<String>
;
;-
function getFileFixMap
  compile_opt idl2, hidden

  fileFixMap = orderedhash()
  fileFixMap['Graphics_System_Variables.htm'] = 'Graphics_System_Variable.htm'

  return, fileFixMap
end
