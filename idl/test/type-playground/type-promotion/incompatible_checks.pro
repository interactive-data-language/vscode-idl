;+
;-
pro incompatible_checks
  compile_opt idl2

  a = 1 + ENVIRaster()

  b = 1 + plot()
end