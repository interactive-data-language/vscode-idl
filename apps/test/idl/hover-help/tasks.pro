;+
; :Arguments:
;   a: bidirectional, required, idltask
;     Placeholder docs for argument, keyword, or property
;   b: bidirectional, required, envitask
;     Placeholder docs for argument, keyword, or property
;   c: bidirectional, required, ENVITask<BuildMosaicRaster>
;     Placeholder docs for argument, keyword, or property
;
;-
pro test, a, b, c
  compile_opt idl2

  !null = a.name
  !null = b.name
  !null = c.input_rasters
end