;+
; :Description:
;   Creates a data cube visualization for a raster and displays it in a notebook.
;
;   The visualization uses ENVI to create a visual of the source raster and display
;   the spectral profile/response on the top and right side of the displayed dataset.
;
;   This is intended to be used with datasets that have many bands (hyperspectral or
;   super spectral data)
;
; :Arguments:
;   raster: in, required, ENVIRaster
;     Specify the raster to create a data cube for and siaplay in a notebook
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
;   Open an image in ENVI and display in a notebook as a data cube:
;
;   ```idl
;   ; Start the application
;   e = envi(/headless)
;
;   ; Open an input file
;   file = filepath('AVIRISReflectanceSubset.dat', subdir = ['data', 'hyperspectral'], $
;     root_dir = e.root_dir)
;   raster = e.openRaster(File)
;
;   ; display in the current notebook cell
;   ; which requires this to be running in a notebook
;   ENVINotebook.display, raster, /cube
;   ```
;
;-
pro ENVINotebook_DisplayRasterCube, raster, size = size
  compile_opt idl2, hidden
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; make sure we passed in an argument
  if ~arg_present(raster) then begin
    message, 'Expected a raster as input for display'
  endif

  ; make sure we have system vars
  vscode_notebookInit

  ; specify the number of bands we pick
  nPick = ceil(raster.nbands / 20) > 1

  ; subset to get appropriate bands
  subset = ENVISubsetRaster(raster, bands = [0 : raster.nbands - 1 : nPick])

  ; Return a file ID
  fid = ENVIRasterToFID(subset)

  ; Query the file
  ENVI_File_Query, fid, dims = dims, nb = nb

  ; Set the CT keyword to the 5th color
  ; table from the IDL file colors1.tbl.
  openr, Unit, filepath('colors1.tbl', $
    subdir = ['resource', 'colors']), $
    /block, /get
  a = assoc(Unit, bytarr(256, 3), 1)
  Ct = a[13]
  Ct[0, *] = 0
  free_lun, Unit

  ; make URI for raster (.dat)
  outUri = e.getTemporaryFilename()

  ; get the bands for RGB
  !null = IDLcf$DefaultRasterDisplayBands(subset._component, useBands)

  ; Create a 3D cube
  ENVI_Doit, 'ENVI_Cube_3d_Doit', $
    fid = fid, $
    dims = dims, $
    pos = lindgen(nb), $
    rgb_pos = useBands, $
    border = 5, $
    ct = Ct, $
    scale = 2, $
    out_name = outUri

  ; clean up
  subset.close

  ; open as raster
  r = e.openRaster(outUri)

  ; clear URI
  AwesomeGenerateThumbnail, $
    input_raster = r, $
    thumbnail_size = size, $
    /no_stretch, $
    output_png_uri = uri

  ; close
  r.close

  ; get info about PNG size
  !null = query_png(uri, info)

  ; add to notebook
  struct = {IDLNotebookImage_FromUri}
  struct.uri = uri
  struct.xSize = info.dimensions[0]
  struct.ySize = info.dimensions[1]
  IDLNotebook.addToNotebook, struct
end