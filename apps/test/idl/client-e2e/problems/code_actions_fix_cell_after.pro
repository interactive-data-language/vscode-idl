;+
; idl-disable unused-var
;-

;+
; :Returns: any
;
; :Arguments:
;   event: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function Blah::CodaActionsFixNotebook, event
  compile_opt idl2, hidden
  regName = ~keyword_set(noName)
  lookup = $
    [(regName ? {prop: 'NAME', cat: 'Property:Name', str: 'Name'} : []), $
    {prop: 'COLOR', cat: 'Property:Color', str: 'Color'}]
  return, -1
end