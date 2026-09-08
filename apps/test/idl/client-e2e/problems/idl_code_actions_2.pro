;+
; idl-disable illegal-arrow
;-

;+
; :Returns: any
;
; :Arguments:
;   event: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function Blah::CodeActions2, event
  compile_opt idl2, hidden
  regName = ~keyword_set(noName)
  ; idl-disable-next-line undefined-var
  lookup = $
    [(regName ? {prop: 'NAME', cat: 'Property:Name', str: 'Name'} : []), $
    {prop: 'COLOR', cat: 'Property:Color', str: 'Color'}]
  return, -1
end