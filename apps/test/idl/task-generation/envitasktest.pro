;+
; :Keywords:
;   input_array: in, optional, Array<ENVIRaster>
;     Placeholder docs for argument, keyword, or property
;   input_raster: in, optional, ENVIRaster
;     Placeholder docs for argument, keyword, or property
;   output_raster_uri: in, optional, String
;     Placeholder docs for argument, keyword, or property
;   output_vector_uri: in, optional, String
;     Placeholder docs for argument, keyword, or property
;
;-
pro envitasktest, input_raster = input_raster, input_array = input_array, $
  output_raster_uri = output_raster_uri, output_vector_uri = output_vector_uri
  compile_opt idl2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif
end