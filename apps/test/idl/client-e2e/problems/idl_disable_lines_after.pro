;+
; :Returns: any
;
; :Arguments:
;   event: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function Blah::ValidateTextInputLines, event ; idl-disable-line unused-var
  compile_opt idl2, hidden
  ; idl-disable-next-line undefined-var
  regName = ~keyword_set(noName)
  lookup = $
    [(regName ? {prop: 'NAME', cat: 'Property:Name', str: 'Name'} : []), $
    {prop: 'COLOR', cat: 'Property:Color', str: 'Color'}]
  return, -1
end