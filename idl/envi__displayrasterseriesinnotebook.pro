;+
; :Description:
;   Creates an animation of all rasters in a raster series and embeds in a notebook
;
;   WARNING: Do not use with series containing many rasters. This routine
;   throws an error if you have more than 12 rasters.
;
;   Because we embed an image of each raster within the cell. This can cause notebooks to
;   become excessively large so please do a spectral subset before calling.
;
;   If you still want to display more than 12, you can set the keyword "allow_many_rasters"
;   to force your image to display, but use at your own risk.
;
; :Arguments:
;   series: in, required, ENVIRasterSeries
;     Specify a raster series that you want to display
;
; :Keywords:
;   allow_many_rasters: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;   size: in, optional, Number
;     Specify the largest dimension of the thumbnail (columns or rows). The
;     input raster's aspect ratio will be retained.
;
;     The default value is 800
;
; :Examples:
;
;   Open an image in ENVI and display in a notebook:
;
;   ```idl
;   ; Start the application
;   e = envi(/headless)
;
;   ; raster series file
;   seriesFile = filepath('AirTemp.series', subdir = ['data', 'time_series'], $
;     root_dir = e.root_dir)
;
;   ; create a raster series
;   series = ENVIRasterSeries(seriesFile)
;
;   ; display all bands as animation in current notebook cell
;   e.displayRasterSeriesInNotebook, series
;   ```
;
;-
pro envi::displayRasterSeriesInNotebook, series, size = size, allow_many_rasters = allow_many_rasters
  compile_opt idl2, hidden, static
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; validate input
  if ~isa(series, 'envirasterseries') then $
    message, 'Expected a single argument as an ENVI Raster Series'

  ; band check
  if (series.count gt 12 and ~keyword_set(allow_many_rasters)) then begin
    message, 'Raster series has more than 12 rasters and will cause notebook to be quite large. Please spectrally subset or pass in the keyword "allow_many_rasters" to proceed.', $
      level = -1
  endif

  ; make sure we have system vars
  vscode_notebookInit

  ; track files
  uris = strarr(series.count)

  foreach raster, series, i do begin
    ; convert raster to thumbnail
    task = ENVITask('GenerateThumbnail')
    task.input_raster = raster
    task.thumbnail_size = size
    task.execute

    ; save URI
    uris[i] = task.output_raster_uri

    ; get info about PNG to display correctly
    if (i eq 0) then begin
      !null = query_png(task.output_raster_uri, info)
    endif
  endforeach

  ; add to our envi magic
  !envi_magic.add, {uri: uris, xsize: info.dimensions[0], ysize: info.dimensions[1]}
end