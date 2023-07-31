;+
; :Description:
;   Creates a visual product for a raster that we can display within an IDL Notebook
;
; :Arguments:
;   raster: in, required, ENVIRaster
;     Specify the raster to display in a notebook
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
;   e = envi()
;
;   ; Open an input file
;   file = filepath('qb_boulder_msi', subdir = ['data'], $
;     root_dir = e.root_dir)
;   raster = e.openRaster(File)
;
;   ; display in the current notebook cell
;   ; which requires this to be running in a notebook
;   e.displayInNotebook, raster
;   ```
;
;-
pro envi::displayInNotebook, raster, size = size
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

  ; make sure we have system vars
  vscode_notebookInit

  ; convert raster to thumbnail
  task = ENVITask('GenerateThumbnail')
  task.input_raster = raster
  task.thumbnail_size = size
  task.execute

  ; read output data
  bytes = bytarr((file_info(task.output_raster_uri)).size, /nozero)

  ; get bytes for PNG
  openr, lun, task.output_raster_uri, /get_lun
  readu, lun, bytes
  free_lun, lun

  ; get info about PNG to display correctly
  !null = query_png(task.output_raster_uri, info)

  ; add to our envi magic
  !envi_magic.add, {uri: task.output_raster_uri, png: IDL_Base64(bytes), xsize: info.dimensions[0], ysize: info.dimensions[1]}
end