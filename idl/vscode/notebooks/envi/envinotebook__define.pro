;+
; :Description:
;   Creates a visual product for a raster or raster series that we can display
;   within an IDL Notebook.
;
;   This routine is only meant to be used from within IDL Notebooks within VSCode.
;
; :Arguments:
;   dataset: in, required, ENVIRaster | ENVIRasterSeries
;     The dataset to display in a notebook
;
; :Keywords:
;   allow_many: in, optional, Boolean
;     If set, and `animate` is set or we are displaying a raster series, allows
;     the display of more than 12 bands or rasters. By default, an error is thrown if
;     ou have 12 or more bands to limit the size of notebook files.
;   animate: in, optional, Boolean
;     If set, and we are displaying an ENVI Raster, then we will create an
;     animation of each band
;   cube: in, optional, Boolean
;     If set, and we are displaying an ENVI Raster, then we will create
;     a 3d data cube representation showing a visual of the raster with
;     a spectral representation along the top and right sides of the image
;   no_stretch: in, optional, Boolean
;     If set, then bands or rasters that are diplsyed will not have a stretch applied.
;
;     This keyword does not apply when creating a raster cube
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
pro ENVINotebook::Display, dataset, allow_many = allow_many, animate = animate, cube = cube, no_stretch = no_stretch, size = size
  compile_opt idl2, hidden, static
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; make sure we passed in a dataset
  if (dataset eq !null) then $
    message, 'Please specify a dataset to display', level = -1

  ; make sure we have system vars
  vscode_notebookInit

  ; determine how to proceed
  case (!true) of
    ;+
    ; One or more rasters (hence the indexing to allow arrays of them)
    ;-
    isa(dataset[0], 'enviraster'): begin
      case (!true) of
        ;+
        ; Band animation
        ;-
        keyword_set(animate): ENVINotebook_AnimateBands, dataset, allow_many_bands = allow_many, no_stretch = no_stretch, size = size

        ;+
        ; Spectral data cube
        ;-
        keyword_set(cube): ENVINotebook_DisplayRasterCube, dataset, size = size

        ;+
        ; Normal display of raster
        ;-
        else: ENVINotebook_DisplayRaster, dataset, no_stretch = no_stretch, size = size
      endcase
    end

    ;+
    ; Displaying raster series
    ;-
    isa(dataset, 'envirasterseries'): ENVINotebook_DisplayRasterSeries, dataset, allow_many_rasters = allow_many, no_stretch = no_stretch, size = size

    ;+
    ; Unknown data type
    ;-
    else: begin
      message, 'Input dataset is not an ENVI Raster or raster series'
    end
  endcase
end

;+
; :Description:
;   Displays an item in a notebook map and embeds the map, and layers, within the
;   the output of a cell.
;
;   The first item (within each cell) that is added sets the bounds/extents of the
;   map's viewport.
;
;   More than one item can be added to a notebook map per cell. The order of
;   items in the map is based on the order in which this method is called for a
;   notebook cell.
;
; :Arguments:
;   dataset: in, required, ENVIRaster | ENVIVector | ENVIROI | Array<ENVIROI> | String
;     The item to add to the map
;   properties: in, optional, OrderedHash<any>
;     If set, should be an orderedhash with key/value pairs for the item being displayed.
;
;     Only valid for vector datasets at this point in time.
;
; :Keywords:
;   is_geojson_uri: in, optional, Boolean
;     If the specified item is a string, this indicates it is the fully-qualified
;     filepath to a JSON file on disk that should be added to the map
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
;   ; create a map and display the raster in it
;   ENVINotebook.displayInMap, raster
;   ```
;
;-
pro ENVINotebook::DisplayInMap, dataset, properties, $
  is_geojson_uri = is_geojson_uri
  compile_opt idl2, hidden, static
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; make sure we passed in a dataset
  if (dataset eq !null) then $
    message, 'Please specify a dataset to display', level = -1

  ; make sure we have system vars
  vscode_notebookInit

  ; determine how to proceed
  IDLNotebook.addToNotebookMap, dataset, properties, is_geojson_uri = is_geojson_uri
end

;+
; :Description:
;   Intercepts progress messages from ENVI Tasks and embeds them as output
;   in notebooks
;
; :Keywords:
;   stop: in, optional, Boolean
;     If set, and we are listening to events from ENVI, removes our event
;     listener and cleans up
;
;-
pro ENVINotebook::EmbedProgress, stop = stop
  compile_opt idl2, hidden, static
  on_error, 2

  ; make sure we have system vars
  vscode_notebookInit

  ; return if already registered
  if (obj_valid(!idlnotebookmagic.ENVIlistener)) then begin
    ; stop listening to events
    if keyword_set(stop) then !idlnotebookmagic.ENVIlistener.cleanup
    return
  endif

  ; create message interceptor and save
  !idlnotebookmagic.ENVIlistener = VSCodeENVIMessageInterceptor()
end

;+
; :ENVINotebook:
;
;-
pro ENVINotebook__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Dummy structure definition so our static methods work
  ;-
  !null = {ENVINotebook, inherits IDLNotebookMap}
end