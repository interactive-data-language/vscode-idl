pro array_creation
  compile_opt idl3

  ; long
  a = [1, 2, 3, 4]

  ; float
  b = [1, 2, 3, 4.]

  ; double
  c = [1, 2, 3, 4d]

  ; complex double
  d = [1, 2, 3, 4di]

  ; invalid
  e = [1, 2, 3, plot()]

  ; ignore if element has Null
  f = [1, 2, 3, !null, 4, 5]

  ; no nested arrays, just promoted
  g = [1, 2, 3, [1, 2, 3, 4d], 4, 5]

  ; array of lists
  h = [list(), list()]

  ; array of ENVIRasters
  i = [ENVIRaster(), ENVIRaster()]

  ; array of any
  j = [ENVIRaster(), plot()]
end