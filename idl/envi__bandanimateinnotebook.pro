;+
; :Description:
;   Creates an animation of all bands and embeds them in a notebook cell.
;
;   WARNING: Do not use with datasets containing many bands. This routine
;   throws an error if you have more than 12 bands.
;
;   Because we embed each band as an image within the cell. This can cause notebooks to
;   become excessively large so please do a spectral subset before calling.
;
;   If you still want to display more than 12, you can set the keyword "allow_many_bands"
;   to force your image to display, but use at your own risk.
;
; :Arguments:
;   raster: in, required, ENVIRaster
;     Specify the raster to display bands for in a notebook
;
; :Keywords:
;   allow_many_bands: in, optional, Boolean
;     If set, allows the display of more than 12 bands of data
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
;   ; Open an input file
;   file = filepath('qb_boulder_msi', subdir = ['data'], $
;     root_dir = e.root_dir)
;   raster = e.openRaster(File)
;
;   ; display all bands as animation in current notebook cell
;   e.bandAnimateInNotebook, raster
;   ```
;
;-
pro envi::bandAnimateInNotebook, raster, size = size, allow_many_bands = allow_many_bands
  compile_opt idl2, hidden, static
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; validate input
  if ~isa(raster, 'enviraster') then $
    message, 'Expected a single argument as an ENVI raster'

  ; band check
  if (raster.nbands gt 12 and ~keyword_set(allow_many_bands)) then begin
    message, 'Raster has more than 12 bands and will cause notebook to be quite large. Please spectrally subset or pass in the keyword "allow_many_bands" to proceed.', $
      level = -1
  endif

  ; make sure we have system vars
  vscode_notebookInit

  ; make array for rasters
  rasters = objarr(raster.nbands)
  for i = 0, raster.nbands - 1 do rasters[i] = ENVISubsetRaster(raster, bands = i)

  ; display rasters
  ENVI.displayRasterInNotebook, rasters

  ; clean up
  for i = 0, raster.nbands - 1 do rasters[i].close
end