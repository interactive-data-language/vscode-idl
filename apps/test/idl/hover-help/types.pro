;+
; :Arguments:
;   a: in, required, ENVIRaster
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

  ; static correct properties
  !null = envi.ui

    ; static incorrect properties
  !null = envi.why_so_serious
end