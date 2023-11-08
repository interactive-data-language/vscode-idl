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
;   no_stretch: in, optional, Boolean
;     If set, rasters that are diplsyed will not have a stretch applied.
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
;   ENVINotebook.display, series
;   ```
;
;-
pro ENVINotebook_DisplayRasterSeries, series, allow_many_rasters = allow_many_rasters, no_stretch = no_stretch, size = size
  compile_opt idl2, hidden
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

  ; make array for rasters
  rasters = objarr(series.count)
  foreach raster, series, i do rasters[i] = raster

  ; display rasters
  ENVINotebook.display, rasters, no_stretch = no_stretch, size = size
end