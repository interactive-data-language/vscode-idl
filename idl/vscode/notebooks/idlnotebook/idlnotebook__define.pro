;+
; :Description:
;   Tracks items that we want to add to a map within our notebook cell.
;
;   In general, this requires ENVI in order to convert data to the right formats so
;   we can embed. Only GeoJSON is allowed as a standalone item.
;
;   At the end of cell execution, all items will be prepared for embedding into a map
;   and the outputs for the current notebook cell.
;
; :Arguments:
;   item: in, required, ENVIRaster | ENVIVector | ENVIROI | Array<ENVIROI> | String
;     The item to add to the notebook map
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
;-
pro IDLNotebook::AddToNotebookMap, item, properties, $
  is_geojson_uri = is_geojson_uri
  compile_opt idl2, hidden, static
  on_error, 2

  ; validate arg
  if isa(item, /null) then $
    message, 'Item to add to notebook map not specified, required!'

  ; validate properties
  if keyword_set(properties) then begin
    if ~isa(properties, 'orderedhash') then message, 'Properties should be an orderedhash', level = -1
  endif

  case (!true) of
    ;+
    ; Handle rasters
    ;-
    isa(item, 'ENVIRaster'): begin
      if (item.spatialref eq !null) then message, 'Raster must have a spatial reference', level = -1
      rasterForMap = {IDLNotebookMap_Image}
      rasterForMap.raster = item
      !idlnotebookmagic.mapitems.add, rasterForMap
    end

    ;+
    ; Handle vectors
    ;-
    isa(item, 'ENVIVector'): begin
      shapefileforMap = {IDLNotebookMap_ShapeFileFromUri}
      shapefileforMap.uri = item.uri
      if keyword_set(properties) then shapefileforMap.properties = properties
      !idlnotebookmagic.mapitems.add, shapefileforMap
    end

    ;+
    ; Handle single ROI
    ;-
    isa(item, 'ENVIROI'): begin
      roisForMap = {IDLNotebookMap_ROIs}
      roisForMap.rois = list(item)
      if keyword_set(properties) then roisForMap.properties = properties
      !idlnotebookmagic.mapitems.add, roisForMap
    end

    ;+
    ; Handle array of ROIs
    ;-
    isa(item, /array) && isa(item[0], 'ENVIROI'): begin
      roiArrayForMap = {IDLNotebookMap_ROIs}
      roiArrayForMap.rois = list(item, /extract)
      if keyword_set(properties) then roiArrayForMap.properties = properties
      !idlnotebookmagic.mapitems.add, roiArrayForMap
    end

    ;+
    ; Handle strings
    ;-
    isa(item, /string): begin
      if keyword_set(is_geojson_uri) then begin
        geojsonUriForMap = {IDLNotebookMap_GeoJSONFromUri}
        geojsonUriForMap.uri = item
        if keyword_set(properties) then geojsonUriForMap.properties = properties
        !idlnotebookmagic.mapitems.add, geojsonUriForMap
      endif else begin
        geojsonForMap = {IDLNotebookMap_GeoJSON}
        geojsonForMap.geoJSON = item
        if keyword_set(properties) then geojsonForMap.properties = properties
        !idlnotebookmagic.mapitems.add, geojsonForMap
      endelse
    end

    else: begin
      message, 'Unknown type of item to add to map', level = -1
    end
  endcase
end

;+
; :Description:
;   This static method registers an item as needed to be embedded
;   within a notebook cell
;
; :Arguments:
;   item: in, required, !magic | IDLNotebookImage_Png | IDLNotebookImage_FromUri | IDLNotebookImage_AnimationFromUris | IDLNotebookMap | IDLNotebookPlot2D
;     The item we are adding to a notebook
;
;-
pro IDLNotebook::AddToNotebook, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; validate arg
  if isa(item, /null) then $
    message, 'Item to add to notebook not specified, required!'

  ;+
  ; The "types" for the IDLNotebookItem should match what typescript
  ; expects in the notebook controller
  ;-
  case (!true) of
    ;+
    ; Check for encoded PNG
    ;-
    isa(item, '!magic'): begin
      ; return if we dont have an item to track
      if (!magic.window eq -1) then return

      ; get the ID of the window
      id = strtrim(!magic.window, 2)

      ; if we havent tracked it yet, save it
      if ~!idlnotebookmagic.graphics.hasKey(id) then begin
        !idlnotebookmagic.graphics[id] = orderedhash(!magic, /extract, /lowercase)

        ; save in our list
        !idlnotebookmagic.items.add, $
          {IDLNotebook_LegacyMagic, magic: orderedhash(!magic, /extract, /lowercase)}
      endif
    end

    ;+
    ; Check if we have an animation based on multiple images on disk
    ;-
    isa(item, 'IDLNotebookImage_AnimationFromUris'): begin
      ; validate
      nImages = n_elements(item.uris)

      ; make sure we have images
      if (nImages eq 0) then message, 'No images to add', level = -1

      ; make sure all files exist
      foreach uri, item.uris do begin
        if ~file_test(uri) then begin
          message, 'File does not exist: "' + uri + '"', level = -1
        endif
      endforeach

      ; track
      IDLNotebook._trackNotebookItem, item
    end

    ;+
    ; Check for encoded PNG
    ;-
    isa(item, 'IDLNotebookImage_PNG'): IDLNotebook._trackNotebookItem, item

    ;+
    ; Check for image we are adding from a URI
    ;-
    isa(item, 'IDLNotebookImage_FromUri'): begin
      ; validate
      if ~file_test(item.uri) then begin
        message, 'File does not exist: "' + item.uri + '"', level = -1
      endif

      ; track
      IDLNotebook._trackNotebookItem, item
    end

    ;+
    ; Check for map
    ;-
    isa(item, 'IDLNotebookMap'): IDLNotebookMap._addToNotebook, item

    ;+
    ; Check for 2D plot
    ;-
    isa(item, 'IDLNotebookPlot'): IDLNotebookPlot._addToNotebook, item

    ;+
    ; Throw error because we don't know what we are adding or handling
    ;-
    else: begin
      message, 'Item is not a known structure to embed in a notebook', level = -1
    end
  endcase
end

;+
; :Private:
;
; :Returns: OrderedHash<any>
;
; :Arguments:
;   item: in, required, Structure
;     The structure we are creating a notebook magic item from
;
;-
function IDLNotebook::_CreateNotebookItemProps, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; validate input
  if ~arg_present(item) then message, 'Item not specified, required!', level = -1

  ; output properties
  saveProps = orderedhash()

  ; get structure key names
  keys = tag_names(item)

  ; remove any non-truthy items
  foreach key, keys, i do begin
    catch, err
    if (err ne 0) then begin
      catch, /cancel
      continue
    endif

    val = item.(i)
    catch, /cancel

    case (!true) of
      ; remove null strings
      isa(val, 'struct'): saveProps[key.toLower()] = IDLNotebook._createNotebookItemProps(val)

      ; remove if !null
      isa(val, /null): ; do nothing

      ; remove null object references
      isa(val, 'objref') and ~obj_valid(val): ; do nothing

      ; remove null strings
      isa(val, /string) and ~val: ; do nothing

      ; save
      else: saveProps[key.toLower()] = val
    endcase
  endforeach

  ; create and return
  return, saveProps
end

;+
; :Private:
;
; :Returns: IDLNotebookItem
;
; :Arguments:
;   item: in, required, Structure
;     The structure we are creating a notebook magic item from
;
;-
function IDLNotebook::_CreateNotebookItem, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; validate input
  if ~arg_present(item) then message, 'Item not specified, required!', level = -1

  ; create and return
  return, {IDLNotebookItem, $
    type: strlowcase(tag_names(item, /structure_name)), $
    item: IDLNotebook._createNotebookItemProps(item)}
end

;+
; :Returns: any
;
;-
function IDLNotebook::ExportItems
  compile_opt idl2, hidden, static
  on_error, 2

  ; check if we have a new graphics item (or maybe direct graphics)
  if (!magic.window ne -1) then begin
    catch, err
    if (err ne 0) then begin
      catch, /cancel
      IDLNotebook.addToNotebook, !magic
    endif else begin
      !null = ENVI.api_version
      ; only embed non-direct-graphics if ENVI UI is up
      ; otherwise we get weird items embedded in the UI
      if (!magic.type ne 0) then begin
        IDLNotebook.addToNotebook, !magic
      endif
      catch, /cancel
    endelse
  endif

  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reissue_last
  endif

  ; add a map to things we export if we have items to map
  IDLNotebookMap._addToNotebook

  ; remove tracked map items
  !idlnotebookmagic.mapitems.remove, /all

  ;+ Track the items that we will report
  export = list()

  ; convert all items for export
  foreach item, !idlnotebookmagic.items do begin
    ;+
    ; If we have a legacy magic item, convert to encoded PNG first
    ;-
    if isa(item, 'IDLNotebook_LegacyMagic') then begin
      ; encode graphic
      encoded = EncodeGraphic(item.magic['window'], item.magic['type'])

      ; skip if we werent able to encode
      if (encoded eq !null) then continue

      ;+ Create PNG data structre
      png = {IDLNotebookImage_Png}
      png.data = encoded
      png.xSize = long(item.magic['xsize'])
      png.ySize = long(item.magic['ysize'])

      ; Why doesnt this work??
      ; png = {IDLNotebookImage_PNG, $
      ; data: encoded, $
      ; xsize: long(item.magic['xsize']), $
      ; ysize: long(item.magic['ysize'])}

      ; create exportable structure and return
      export.add, IDLNotebook._createNotebookItem(png)
    endif else begin
      export.add, item
    endelse
  endforeach

  ; clean up
  IDLNotebook.reset

  ;+ Return the items to embed
  return, export
end

;+
; :Description:
;   Exports (to the console via print) all of the magic items that
;   we are currently tracking
;
;   Cleans up and removes everything after we have exported
;
;-
pro IDLNotebook::Export
  compile_opt idl2, hidden, static
  on_error, 2

  ;+ Export items and convert to something that is serializable
  export = IDLNotebook.exportItems()

  ; check what our IDL version is
  case (!true) of
    ;+
    ; Support for precision keyword
    ;-
    long(!version.release.replace('.', '')) ge 883: print, json_serialize(export, /lowercase, precision = 8)
    ;+
    ; We don't so we can't print
    ;-
    else: print, json_serialize(export, /lowercase)
  endcase
end

;+
; :Description:
;   Constructor
;
; :Returns: IDLNotebook
;
; :Keywords:
;   _extra: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
function IDLNotebook::Init, _extra = extra
  compile_opt idl2, hidden
  on_error, 2

  if (isa(extra)) then $
    self.idlNotebook__define::setProperty, _extra = extra

  return, 1
end

;+
; :Description:
;   Resets properties and clears all tracked items
;
;-
pro IDLNotebook::Reset
  compile_opt idl2, hidden, static
  on_error, 2

  ; clean up our objects
  !idlnotebookmagic.items.remove, /all
  !idlnotebookmagic.graphics.remove, /all
  !idlnotebookmagic.mapitems.remove, /all

  ; clear any IDs for the window that we have currently embedded
  !magic.window = -1
end

;+
; :Private:
;
; :Arguments:
;   item: in, required, Structure
;     The structure we are creating a notebook magic item from
;
;-
pro IDLNotebook::_TrackNotebookItem, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; add and return
  !idlnotebookmagic.items.add, IDLNotebook._createNotebookItem(item)
end

;+
; :Description:
;   Class definition procedure
;
; :IDLNotebook:
;   enviListener: VSCodeENVIMessageInterceptor
;     If we have created an ENVI listener or not
;   graphics: OrderedHash<!magic>
;     By window ID, track graphics that we need to embed
;   items: List<any>
;     The items that we are adding to our notebook
;   mapItems: List<any>
;     The items that we are adding to a map for our given notebook
;     cell
;
; :IDLNotebook_LegacyMagic:
;   magic: OrderedHash<any>
;     An ordered-hash version of our !magic system variable
;     at the time of it being added
;
; :IDLNotebookItem:
;   item: OrderedHash<any>
;     The paired structure for the type of notebook magic
;   type: String
;     The type of notebook magic
;
;-
pro IDLNotebook__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Data structure for this class
  ;-
  !null = {IDLNotebook, $
    enviListener: obj_new(), $
    items: list(), $
    mapItems: list(), $
    graphics: orderedhash()}

  ;+
  ; Legacy magic definition for all of our graphics
  ;-
  !null = {IDLNotebook_LegacyMagic, $
    magic: orderedhash()}

  ;+
  ; Messages stored in `!IDLNotebookMagic`
  ;-
  !null = {IDLNotebookItem, $
    type: 'string', $
    item: orderedhash()}

  ; make sure super magic exists
  defsysv, '!IDLNotebookMagic', exists = _exists
  if ~_exists then defsysv, '!IDLNotebookMagic', $
    {IDLNotebook, enviListener: !false, items: list(), mapItems: list(), graphics: orderedhash(/fold_case)}

  ; load all other structures
  IDLNotebookImage__define
  IDLNotebookMap__define
  IDLNotebookPlot__define
  ENVINotebook__define
end