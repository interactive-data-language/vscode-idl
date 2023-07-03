pro examples
  compile_opt idl2

  ; example variable
  p = IDLgrSurface()

  ; dont show init method for auto-complete
  !null = p.()

  ; dont insert paren - absent from insert text in results
  p2 = I1()
  !null = p.()
  !null = p.ge()

  ; no variables
  p3 = I1()

  ; no properties
  !null = p.()
  !null = p.ge()

  ; yes properties
  p.
  p.cle

  ; static variable properties
  !null = envi.

  ; system variables
  !
  a = !nu
end

compile_opt idl2

; executive commands
.r

end