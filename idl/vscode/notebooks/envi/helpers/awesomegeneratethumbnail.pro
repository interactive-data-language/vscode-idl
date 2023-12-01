;+
; :Description:
;   Gets the pyramid level we need to use for creating a display of our data
;
; :Returns: Long
;
; :Arguments:
;   value1: in, required, any
;     Placeholder docs for argument, keyword, or property
;   value2: in, required, any
;     Placeholder docs for argument, keyword, or property
;   compareValue: in, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function AwesomeGenerateThumbnailGetPyramidLevel, value1, value2, compareValue
  compile_opt idl2, hidden

  level = 0
  while ((value1 / 2 ^ level > value2 / 2 ^ level) gt compareValue) do begin
    level++
  endwhile
  return, (level - 1) > 0
end

;+
; :Keywords:
;   input_raster: in, optional, ENVIRaster
;     Placeholder docs for argument, keyword, or property
;   no_stretch: in, optional, Boolean
;     If set, don't stretch data
;   output_png_uri: bidirectional, optional, String
;     Fully qualified filepath where we write PNG
;   thumbnail_size: in, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro AwesomeGenerateThumbnail, $
  input_raster = inputRaster, $
  thumbnail_size = thumbnailSize, $
  no_stretch = no_stretch, $
  output_png_uri = output_png_uri
  compile_opt idl2, hidden
  on_error, 2

  ; verify ENVI is up and running
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, requried!'
  endif

  ; set default
  if (thumbnailSize eq !null) then thumbnailSize = 800

  ; Getting information about inputRaster
  !null = IDLcf$DefaultRasterDisplayBands(inputRaster._component, useBands)
  inputRaster._component.getProperty, pyramid_levels = maxPyramidLevel
  pyramidLevel = AwesomeGenerateThumbnailGetPyramidLevel(inputRaster.nsamples, inputRaster.nlines, thumbnailSize) < maxPyramidLevel

  ; Get data at a reduced pyramid level
  if (~inputRaster._component.getData(data, level = pyramidLevel, $
    bands = useBands, $
    pixelstate = pixelState, $
    interleave = 0)) then begin
    message, IDLcfLangCatQuery('Failed to get data array to generate thumbnail'), /noname
  endif

  ; Get dimensions of the input image
  dimensions = data.dim
  nChannels = (n_elements(dimensions) eq 2) ? 1 : 3

  ; check for data ignore - this is not honored for classification images
  if inputRaster.metadata.hasTag('data ignore value') then begin
    pixelState += data eq inputRaster.metadata['data ignore value']
  endif

  ; flatten pixel state
  if (nChannels gt 1) then pixelState = total(pixelState, 3, /integer)

  ; Assign bad pixels to alpha band
  alpha = (pixelState eq 0) * 255b

  ; Dealing with images that have a colormap
  inputRaster.getProperty, colormap = colormap
  if (isa(colormap, 'EnviColorMap')) then begin
    colordata = bytarr(dimensions[0], dimensions[1], 3, /nozero)
    colordata[0, 0, 0] = colormap.red[data]
    colordata[0, 0, 1] = colormap.green[data]
    colordata[0, 0, 2] = colormap.blue[data]
    data = temporary(colordata)
  endif else if (nChannels eq 1) then begin
    rgbData = make_array(dimensions[0], dimensions[1], 3, type = data.typecode, /nozero)
    for i = 0, 2 do begin
      rgbData[0, 0, i] = data
    endfor
    data = temporary(rgbData)
  endif

  ; Linear Stretch from histogram
  if (~isa(colormap, 'EnviColorMap') && (inputRaster.data_type ne 'byte' || keyword_set(no_stretch))) then begin
    histData = bytarr(dimensions[0], dimensions[1], 3, /nozero)
    for i = 0, 2 do begin
      band = data[*, *, i]
      oHist = obj_new('IDLcfHistogram', data = band)
      minVal = oHist.stretchValue(2.)
      maxVal = oHist.stretchValue(98.)
      histData[*, *, i] = bytscl(band, min = minVal, max = maxVal, /nan)
      obj_destroy, oHist
    endfor
    data = temporary(histData)
  endif

  ; Add alpha band
  thumbnailList = list()
  thumbnailList.add, data
  thumbnailList.add, alpha
  data = thumbnailList.toArray(dimension = 3)

  ; Converting to the correct size
  if (dimensions[0] gt dimensions[1]) then begin
    scale = thumbnailSize / float(dimensions[0])
  endif else begin
    scale = thumbnailSize / float(dimensions[1])
  endelse
  dimensions[0] *= scale
  dimensions[1] *= scale
  data = congrid(data, dimensions[0], dimensions[1], 4)

  ; Convert from BSQ to BIP
  data = transpose(data, [2, 0, 1])

  ; make output URI if we dont have it
  if ~keyword_set(output_png_uri) then begin
    output_png_uri = e.getTemporaryFilename('.png')
  endif

  ; Save data
  write_png, output_png_uri, data, /order
end