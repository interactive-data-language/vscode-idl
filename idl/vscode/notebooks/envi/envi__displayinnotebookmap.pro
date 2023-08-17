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
;   e.displayInNotebookMap, raster
;   ```
;
;-
pro envi::displayInNotebookMap, dataset, properties, $
  is_geojson_uri = is_geojson_uri
  compile_opt idl2, hidden, static
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; make sure we have system vars
  vscode_notebookInit

  ; determine how to proceed
  IDLNotebook.AddToNotebookMap, dataset, properties, is_geojson_uri = is_geojson_uri
end