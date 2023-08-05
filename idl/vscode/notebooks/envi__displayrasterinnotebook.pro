;+
; :Description:
;   Creates a visual product for a raster that we can display within an IDL Notebook.
;
;   This routine is only meant to be used from within IDL Notebooks within VSCode.
;
; :Arguments:
;   raster: in, required, ENVIRaster | Array<ENVIRaster>
;     Specify the raster to display in a notebook. If more than one
;     raster is specified, each raster should have the same dimensions to be
;     displayed properly
;
; :Keywords:
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
;   ; display in the current notebook cell
;   ; which requires this to be running in a notebook
;   e.displayRasterInNotebook, raster
;   ```
;
;-
pro envi::displayRasterInNotebook, raster, size = size
  compile_opt idl2, hidden, static
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; make sure we passed in an argument
  if ~arg_present(raster) then begin
    message, 'Expected a raster or array of rasters as input for display'
  endif

  ; make sure rasters are array
  useRasters = ~isa(raster, /array) ? [raster] : raster

  ; get the number of rasters
  nRasters = n_elements(useRasters)

  ; validate all entries
  for i = 0, nRasters - 1 do begin
    if ~isa(useRasters[i], 'enviraster') then $
      message, 'Only rasters are allowed as input'
  endfor

  ; make sure we have system vars
  vscode_notebookInit

  ; track files
  uris = strarr(nRasters)

  ; process each raster
  for i = 0, nRasters - 1 do begin
    ; convert raster to thumbnail
    task = ENVITask('GenerateThumbnail')
    task.input_raster = useRasters[i]
    task.thumbnail_size = size
    task.execute

    ; save URI
    uris[i] = task.output_raster_uri

    ; get info about PNG to display correctly
    if (i eq 0) then begin
      !null = query_png(task.output_raster_uri, info)
    endif
  endfor

  ; add to our envi magic
  !notebook_magic.add, {uri: nRasters eq 1 ? uris[0] : uris, xsize: info.dimensions[0], ysize: info.dimensions[1]}
end