;+
; :Private:
;
; :Returns: String
;
; :Arguments:
;   item: in, required, any
;     The item that we are saving
;
;-
function ShapeFileToGeoJSON_Serialize, item
  compile_opt idl2, hidden

  ; check what our IDL version is
  case (!true) of
    ;+
    ; Support for precision keyword
    ;-
    long(!version.release.replace('.', '')) ge 883: return, json_serialize(item, /lowercase, precision = 8)
    ;+
    ; We don't so we can't print
    ;-
    else: return, json_serialize(item, /lowercase)
  endcase
end

;+
; :Tooltip:
;   Converts shapefiles to GeoJSON
;
; :Description:
;   IDL and ENVI routine that converts a shapefile to GeoJSON with the desired
;   EPSG code. The shapefile must have entities in order to be processed.
;
;   This routine requires ENVI as it uses the ENVI API for reprojecting
;   shapefiles as needed.
;
; :Keywords:
;   debug: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;   epsg_code: in, optional, Long
;     Specify the output EPSG code that you want the coordinate
;     information in the shapefile coverted to.
;   has_features: out, required, Boolean
;     This output flag alerts the user if there are any features or
;     not present in the GeoJSON file.
;   input_vector: in, required, ENVIVector
;     Specify the input shapefile that you want to prcess. This should
;     be opened with the ENVI API and not just a string.
;   output_geojson_uri: bidirectional, optional, ENVIURI
;     Specify the fully-qualified filepath for the output GeoJSON file.
;
; :Examples:
;   Here is an example for how you can use this ENVI Task:
;
;   ```idl
;   ; start ENVI
;   e = envi(/HEADLESS)
;
;   ; add tasks to ENVITask catalog if not in ENVI's custom code
;   geoJSONTasks, /INIT
;
;   ; open ROIs from qb_boulder_roi.xml
;   ; Create an ENVIVector from the shapefile data
;   file = filepath('states.shp', SUBDIRECTORY = ['examples', 'data'])
;   vector = e.openVector(file)
;
;   ; get the ENVITask
;   task = ENVITask('ShapefileToGeoJSON')
;   task.INPUT_VECTOR = vector
;   task.EPSG_CODE = 4326 ; default coordinate system
;
;   ; optionally specify the output filename, auto-populated if not set.
;   task.OUTPUT_GEOJSON_URI = e.getTemporaryFilename('json')
;
;   ; run our task
;   task.execute
;
;   ; check to see if we have features and the output GeoJSON file
;   print, 'Features in the ROI file : ', task.HAS_FEATURES
;   print, 'GoeJSON file location    : ', task.OUTPUT_GEOJSON_URI
;   ```
;
; :Author:
;   Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)
;
;-
pro ShapeFileToGeoJSON, $
  debug = debug, $
  input_vector = input_vector, $
  epsg_code = epsg_code, $
  has_features = has_features, $
  output_geojson_uri = output_geojson_uri
  compile_opt idl2, hidden
  if ~keyword_set(debug) then on_error, 2

  ; get current ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  if (epsg_code eq !null) then begin
    epsg_code = 4326
  endif

  ; create our output coordinate system
  output_coord_sys = ENVICoordSys(coord_sys_code = epsg_code)

  ; get coordinate system of our shape file
  coordSys = input_vector.coord_sys

  ; open as an object in IDL
  shape = IDLffShape(input_vector.uri)

  ; get information about our attributes
  shape.getProperty, attribute_names = attNames, n_entities = nEnts

  ; initialize our output geojson
  outputGeo = '{"type":"FeatureCollection","features":['

  ; store type of each entity
  types = list()

  ; create list to hold the strings we are joining together (features)
  strs = list()

  ; only process if we have features
  if (nEnts gt 0) then begin
    ; get our attributes
    attributes = shape.getAttributes(/all)
    nAtt = n_elements(attNames)

    ; make attribute names all lower case
    attNames = strlowcase(attNames)

    ; correct duplicate names so that we have valid JSON, i.e. make all unique
    if (n_elements(attNames.uniq()) ne n_elements(attNames)) then begin
      for i = 0, nAtt - 1 do begin
        ref = attNames[i]
        idxMatch = where(attNames eq ref, countMatch)
        if (countMatch gt 1) then begin
          foreach fIdx, idxMatch, j do begin
            if (fIdx gt i) then attNames[fIdx] += '-' + strtrim(j + 1, 2) ; dont update first occurrence
          endforeach
        endif
      endfor
    endif

    ; get them ready to be jsonified
    attNames = '"' + attNames + '":'

    ; figure out which attributes are strings or not
    flags = bytarr(nAtt)
    for nIdx = 0, n_elements(attNames) - 1 do flags[nIdx] = isa(attributes[0].(nIdx), /string)
    front = strarr(nAtt)
    back = strarr(nAtt)

    idxStr = where(flags, countStr)
    if (countStr gt 0) then begin
      front[idxStr] = '"'
      back[idxStr] = '"'
    endif

    ; concat strings
    attNames += front

    ; init the strings for our properties
    strings = strarr(n_elements(attributes), nAtt)

    ; populate with values
    for i = 0, nAtt - 1 do strings[*, i] = strtrim(attributes.(i), 2)

    ; fix strings that starts with numbers and end with '.', not valid GeoJSON.
    idxFix = where(stregex(strings, '[0-9][0-9]+\.$') ne -1, countFix)
    if (countFix gt 0) then strings[idxFix] += '0'

    ; fix strings that contain double quotes - bad character
    idxFix = where(strpos(strings, '"') ne -1, countFix)
    if (countFix gt 0) then begin
      foreach fIdx, idxFix do begin
        ; escape all characters
        jsonOK = json_serialize(strings[fIdx])

        ; trim leading and training quotes, needed because we add them in already
        strings[fIdx] = strmid(jsonOK, 1, strlen(jsonOK) - 2)
      endforeach
    endif

    ; create a nice string for each property
    fixed = list()
    for i = 0, n_elements(attributes) - 1 do begin
      fixed.add, '{' + strjoin(attNames + reform(strings[i, *]) + back, ',') + '}'
    endfor

    ; get our entities and iterate over each one
    entities = shape.getEntity(/all)
    foreach entity, entities, z do begin
      ; check what type of entity we have
      okEntity = 1
      switch (entity.shape_type) of
        ; points
        (1): ; point
        (11): ; point-z
        (21): begin ; point-m
          ; check if we have vertices or not
          if ptr_valid(entity.vertices) then begin
            vert = *entity.vertices
          endif else begin
            vert = [entity.bounds[0], entity.bounds[1]]
          endelse
          types.add, 'Point'
          break ;
        end

        ; ;multi-points
        ; (8):;multi-point
        ; (18):;multi-point-z
        ; (28):begin;multi-point-m
        ; vert = *entity.VERTICES
        ; type = ''
        ; break;
        ; end

        ; polylines
        (3): ; polyline
        (13): ; polyline-z
        (23): begin ; polyline-m
          vert = *entity.vertices
          types.add, 'LineString'
          break ;
        end

        ; polygons
        (5): ; polygon
        (15): ; polygon-z
        (25): begin ; polygon-m
          vert = *entity.vertices
          types.add, 'Polygon'
          break ;
        end

        else: ; do nothing
      endswitch

      ; skip if not an ok entity
      if ~okEntity then continue

      ; convert our coordinates
      coordSys.convertMapToLonLat, reform(vert[0, *]), reform(vert[1, *]), lon, lat
      coordSys.convertLonLatToLonLat, lon, lat, lon, lat, output_coord_sys
      nPts = n_elements(lon)

      ; create a list for our vertices
      verts = list()
      multipoints = list()

      ; cehck if we have parts
      if (ptr_valid(entity.parts)) then begin
        parts = [*entity.parts, nPts]
        if (n_elements(parts) gt 1) then begin
          ; create polygon vertices
          ; first is outer, rest are inner holes
          polyVerts = list()

          ; extract the number of parts for each item
          nParts = parts - shift(parts, 1)

          ; loop over each sub element of the entity
          for i = 0, n_elements(parts) - 2 do begin
            ; make sure there are at least three vertices
            if (nParts[i + 1] lt 3) then continue

            ; build the index subscript
            idx = parts[i] + [0 : (nParts[i + 1] - 1)]

            ; add our vertices to our group
            polyVerts.add, transpose([[lon[idx]], [lat[idx]]])
          endfor

          ; save polygon vertices
          verts.add, polyVerts
          multipoints.add, 1
        endif else begin
          vertItem = list()
          for i = 0, nPts - 1 do vertItem.add, [lon[i], lat[i]]
          verts.add, vertItem
          multipoints.add, 0
        endelse
      endif else begin
        vertItem = list()
        for i = 0, nPts - 1 do vertItem.add, [lon[i], lat[i]]
        verts.add, vertItem
        multipoints.add, 0
      endelse

      ; add all items to the data structure that we found
      if (n_elements(verts) gt 0) then begin
        foreach vert, verts, idx do begin
          ; skip if no vertices
          if (n_elements(vert) eq 0) then continue
          if (n_elements(vert[0]) eq 0) then continue

          ; how do we proceed
          case (1) of
            ((types[idx] eq 'Polygon') && (~multipoints[idx])): begin
              strs.add, '{"type":"Feature","properties":' + fixed[z] + ',"geometry":{"type":"' + types[idx] + '","coordinates":' + ShapeFileToGeoJSON_Serialize(list(vert)) + '}}'
            end
            (types[idx] eq 'Point' && (n_elements(vert) eq 1)): begin
              strs.add, '{"type":"Feature","properties":' + fixed[z] + ',"geometry":{"type":"' + types[idx] + '","coordinates":' + ShapeFileToGeoJSON_Serialize(vert[0]) + '}}'
            end
            (types[idx] eq 'LineString'): begin
              strs.add, '{"type":"Feature","properties":' + fixed[z] + ',"geometry":{"type":"' + types[idx] + '","coordinates":' + ShapeFileToGeoJSON_Serialize(vert[0]) + '}}'
            end
            else: begin
              strs.add, '{"type":"Feature","properties":' + fixed[z] + ',"geometry":{"type":"' + types[idx] + '","coordinates":' + ShapeFileToGeoJSON_Serialize(vert) + '}}'
            end
          endcase
        endforeach
      endif
    endforeach
  endif

  ; close geojson accordingly
  if (n_elements(strs) gt 0) then begin
    outputGeo += strjoin(strs.toArray(), ',') + ']}'
  endif else begin
    outputGeo += ']}'
  endelse

  ; update our flag if we have features or not
  has_features = n_elements(verts) gt 0

  ; create our output json filename
  if ~keyword_set(output_geojson_uri) then begin
    output_geojson_uri = e.getTemporaryFilename('json')
  endif
  openw, lun, output_geojson_uri, /get_lun
  printf, lun, outputGeo, /implied_print
  free_lun, lun
end