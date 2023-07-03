;+
; :Arguments:
;   a: in, required, ENVIRaster
;     Placeholder docs for argument or keyword
;
;-
pro my_thing, a
  compile_opt idl2

  ; verify function methods and properties
  b = a.

  ; verify procedure methods and properties
  a.

  ; verify properties with a start
  !null = a.met

  ; verify nested properties
  !null = a.metadata.

  ; verify nested properties with a  start
  !null = a.metadata.cou

  ; verify we parse from structure indexing syntax
  p = IDLgrSurface()
  !null = p.()
end