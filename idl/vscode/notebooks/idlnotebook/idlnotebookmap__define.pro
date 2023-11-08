;+
; :Returns: IDLNotebookItem
;
; :Arguments:
;   val: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function IDLNotebookMap::_CreateNotebookItem, val
  compile_opt idl2, hidden, static
  on_error, 2

  ;+
  ; See what we are trying to add to our map
  ;-
  case (!true) of
    ;+
    ; Handle raw GeoJSON
    ;-
    isa(val, 'IDLNotebookMap_GeoJSON'): begin
      return, IDLNotebook._createNotebookItem(val)
    end

    ;+
    ; Handle GeoJSON files
    ;-
    isa(val, 'IDLNotebookMap_GeoJSONFromUri'): begin
      if ~file_test(val.uri) then begin
        message, '"IDLNotebookMap_GeoJSONFromUri" has a uri that does not exist on disk!', level = -1
      endif

      ; save because we are OK!
      return, IDLNotebook._createNotebookItem(val)
    end

    ;+
    ; Handle images from URIs
    ;-
    isa(val, 'IDLNotebookMap_ImageFromUri'): begin
      if ~file_test(val.uri) then begin
        message, '"IDLNotebookMap_ImageFromUri" has a uri that does not exist on disk!', level = -1
      endif

      ; save because we are OK!
      return, IDLNotebook._createNotebookItem(val)
    end

    ;+
    ; Handle an image (i.e. raster)
    ;-
    isa(val, 'IDLNotebookMap_Image'): begin
      ; check ENVI
      e = envi(/current)
      if (e eq !null) then begin
        message, 'Embedding images in a map requires ENVI to be started', level = -1
      endif

      if ~isa(val.raster, 'ENVIRaster') then begin
        message, 'Image to embed is not a valid ENVIRaster', level = -1
      endif

      ; make sure we have a spatialref
      if (val.raster.spatialref eq !null) then begin
        message, 'Image to embed does not have a spatialref', level = -1
      endif

      ; reproject
      reproj = ENVIReprojectRaster(val.raster, $
        coord_sys = ENVICoordSys(coord_sys_code = 3857))

      ; make thumbnail
      uri = !null
      AwesomeGenerateThumbnail, $
        input_raster = reproj, $
        thumbnail_size = 1024, $
        output_png_uri = uri

      ; get info about PNG to display correctly
      !null = query_png(uri, info)

      ; make new item
      newItem = {IDLNotebookMap_ImageFromUri}
      newItem.uri = uri
      newItem.xSize = info.dimensions[0]
      newItem.ySize = info.dimensions[1]
      newItem.extents = reproj.getExtents()

      ; save new item
      return, IDLNotebook._createNotebookItem(newItem)
    end

    ;+
    ; Handle ROIs
    ;-
    isa(val, 'IDLNotebookMap_ROIs'): begin
      if n_elements(val.ROIs) eq 0 then begin
        message, '"IDLNotebookMap_ROIs" has no rois to add!', level = -1
      endif

      ; check ENVI
      e = envi(/current)
      if (e eq !null) then begin
        message, 'Embedding ROIs in a map requires ENVI to be started', level = -1
      endif

      ; convert
      uri = !null
      ROItoGeoJSON, $
        epsg_code = 3857, $
        input_roi = val.ROIs.toArray(), $
        has_features = isROIOK, $
        output_geojson_uri = uri

      ; validate
      if ~isROIOK then message, 'ROI does not have any features to embed', level = -1

      ; make new item
      newItem = {IDLNotebookMap_GeoJSONFromUri}
      newItem.uri = uri
      newItem.properties = val.properties

      ; save because we are OK!
      return, IDLNotebook._createNotebookItem(newItem)
    end

    ;+
    ; Handle vector files
    ;-
    isa(val, 'IDLNotebookMap_ShapeFileFromUri'): begin
      if ~file_test(val.uri) then begin
        message, '"IDLNotebookMap_ShapeFileFromUri" has a uri that does not exist on disk!', level = -1
      endif

      ; check ENVI
      e = envi(/current)
      if (e eq !null) then begin
        message, 'Embedding a shapefile in a map requires ENVI to be started', level = -1
      endif

      ; open as vector
      vect = e.openVector(val.uri)

      ; convert
      uri = !null
      ShapeFileToGeoJSON, $
        epsg_code = 3857, $
        input_vector = vect, $
        has_features = isOK, $
        output_geojson_uri = uri

      ; validate
      if ~isOK then message, 'Shapefile does not have any features to embed', level = -1

      ; make new item
      newItem = {IDLNotebookMap_GeoJSONFromUri}
      newItem.uri = uri
      newItem.properties = val.properties

      ; save because we are OK!
      return, IDLNotebook._createNotebookItem(newItem)
    end

    ;+
    ; Unknown data type that we can't handle
    ;-
    else: begin
      message, 'Found an unsupported data type in list of items to add to map', level = -1
    end
  endcase
end

;+
; :Description:
;   Validates and manages data preparation for embedding items on
;   a map in notebooks
;
; :Arguments:
;   item: in, required, IDLNotebookMap
;     Placeholder docs for argument, keyword, or property
;
;-
pro IDLNotebookMap::_AddToNotebook, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; check if we have an item or if we are making a new map
  if arg_present(item) then begin
    if ~isa(item, 'IDLNotebookMap') then $
      message, 'Item is not a notebook map as expected', level = -1
    mapThese = item.data
  endif else begin
    ;+ get items that we are supposed to map
    mapThese = !idlnotebookmagic.mapitems

    ; return if nothing to add
    if (mapThese.length eq 0) then return
  endelse

  ;+ Create new data structure so that we don't dirty the first
  addItem = {IDLNotebookMap}
  addItem.data = list()

  ; process all items
  foreach val, mapThese do addItem.data.add, IDLNotebookMap._createNotebookItem(val)

  ; track data
  IDLNotebook._trackNotebookItem, addItem
end

;+
; :IDLNotebookMap:
;   data: List<IDLNotebookMap_GeoJSONFromUri | IDLNotebookMap_Image | IDLNotebookMap_ROIs | IDLNotebookMap_ShapeFileFromUri>
;     List of items to add to the map
;
; :IDLNotebookMap_VectorProperties:
;   properties: OrderedHash<any>
;     Key-value pair of properties for a map item
;
; :IDLNotebookMap_Extents:
;   epsg: Number
;     EPSG code for extents
;   xMax: Double
;     Max longitude
;   xMin: Double
;     Min longitude
;   yMax: Double
;     Max latitude
;   yMin: Double
;     Min latitude
;
; :IDLNotebookMap_GeoJSON:
;   geoJSON: String
;     GeoJSON string that should be added to a map
;
; :IDLNotebookMap_GeoJSONFromUri:
;   uri: String
;     Fully-qualified filepath to a GeoJON file on disk that you want
;     to embed in a map
;
; :IDLNotebookMap_Image:
;   raster: ENVIRaster
;     Reference to the raster you want to embed
;
; :IDLNotebookMap_ImageFromUri:
;   extents: IDLNotebookMap_Extents
;     Image extents
;
; :IDLNotebookMap_ROIs:
;   rois: List<ENVIROI>
;     A list of ROIs that we should add to the map. If you have more
;     than one ROI, then you can use `list(rois, /extract)` to add them
;     all
;
; :IDLNotebookMap_ShapeFileFromUri:
;   uri: String
;     Fully-qualified filepath to a Shapefile on disk that you want to
;     embed in a map
;
;-
pro IDLNotebookMap__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Data structure for embedding maps in notebooks
  ;-
  !null = {IDLNotebookMap, $
    data: list()}

  ;+ Properties for items we add to the map
  !null = {IDLNotebookMap_VectorProperties, $
    properties: orderedhash()}

  ;+
  ; Extents for an item to display on a map
  ;-
  !null = {IDLNotebookMap_Extents, $
    epsg: 0l, $
    xMin: 0d, $
    yMin: 0d, $
    xMax: 0d, $
    yMax: 0d}

  ;+
  ; Data structure for embedding GeoJON in maps
  ;-
  !null = {IDLNotebookMap_GeoJSON, $
    inherits IDLNotebookMap_VectorProperties, $
    geoJSON: ''}

  ;+
  ; Data structure for embedding GeoJON in maps
  ;-
  !null = {IDLNotebookMap_GeoJSONFromUri, $
    inherits IDLNotebookMap_VectorProperties, $
    uri: ''}

  ;+
  ; Data structure for embedding an image in a map
  ;-
  !null = {IDLNotebookMap_Image, $
    raster: obj_new()}

  ;+
  ; Data structure for embedding an image in a map
  ;-
  !null = {IDLNotebookMap_ImageFromUri, $
    inherits IDLNotebookImage_FromUri, $
    extents: {IDLNotebookMap_Extents}}

  ;+
  ; Data structure for embedding Shapefile in maps
  ;-
  !null = {IDLNotebookMap_ROIs, $
    inherits IDLNotebookMap_VectorProperties, $
    rois: list()}

  ;+
  ; Data structure for embedding Shapefile in maps
  ;-
  !null = {IDLNotebookMap_ShapeFileFromUri, $
    inherits IDLNotebookMap_VectorProperties, $
    uri: ''}
end