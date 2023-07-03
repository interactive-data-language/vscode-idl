;+
; :Arguments:
;   a: in, required, ENVISubsetRaster
;     Placeholder docs for argument or keyword
;
;-
pro my_thing, a
  compile_opt idl2

  ; verify function method hover help with type
  b = a.getData()

  ; verify procedure method hover help with type
  a.save

  ; verify property access
  !null = a.metadata.count

  ; verify property access that doesnt exist
  !null = a.incorrect.wrong

  ; verify property access that doesnt exist
  !null = a.incorrect.wrong
end