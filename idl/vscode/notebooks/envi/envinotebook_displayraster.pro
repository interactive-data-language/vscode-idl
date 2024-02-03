;+
; :Private:
;
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
;   no_stretch: in, optional, Boolean
;     If set, then bands or rasters that are diplsyed will not have a stretch applied.
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
;   ENVINotebook.display, raster
;   ```
;
;-
pro ENVINotebook_DisplayRaster, raster, no_stretch = no_stretch, size = size
  compile_opt idl2, hidden
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
    ; make thumbnail
    uri = !null
    AwesomeGenerateThumbnail, $
      no_stretch = no_stretch, $
      input_raster = useRasters[i], $
      thumbnail_size = size, $
      output_png_uri = uri

    ; save URI
    uris[i] = uri

    ; get info about PNG to display correctly
    if (i eq 0) then begin
      !null = query_png(uri, info)
    endif
  endfor

  ; check how we should report the image
  if (nRasters eq 1) then begin
    struct = {IDLNotebookImage_FromUri}
    struct.uri = uris[0]
    struct.xSize = info.dimensions[0]
    struct.ySize = info.dimensions[1]
    IDLNotebook.addToNotebook, struct
  endif else begin
    struct = {IDLNotebookImage_AnimationFromUris}
    struct.uris = list(uris, /extract)
    struct.xSize = info.dimensions[0]
    struct.ySize = info.dimensions[1]
    IDLNotebook.addToNotebook, struct
  endelse
end