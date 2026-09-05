;+
; :Tooltip:
;   Converts ENVI ROIs to GeoJSON
;
; :Description:
;   Procedure that converts an ROI file to GeoJSON. All features in
;   the ENVI ROI file must be georeferences and geometry based. Pixel
;   based features, or pixelated ENVI ROIs, are not supported.
;
; :Keywords:
;   debug: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;   epsg_code: in, optional, Long
;     Specify the output EPSG code that you want the ROI to be
;     reprojected to.
;   has_features: out, required, Boolean
;     This output keyword is a flag that alerts you if there are
;     actually features in the ROI you specified or not.
;   input_roi: in, required, ENVIROI
;     Specify the array of ENVIROIs that share the same file
;     on disk that you want to parse. The ROIs **must** exist on
;     disk in order to parse the XML. You can create ROIs without
;     saving them to disk so this is important to be aware of.
;   output_geojson_uri: out, required, String
;     This contains a fully-qualified filepath to the generated
;     GeoJSON file.
;
; :Examples:
;   Convert a sample ENVI ROI file to GeoJSON. This example assumes
;   you have this code on IDL's search path:
;
;   ```idl
;   ; start ENVI
;   e = envi(/HEADLESS)
;
;   ; add tasks to ENVITask catalog if not in ENVI's custom code
;   geoJSONTasks, /INIT
;
;   ; open ROIs from qb_boulder_roi.xml
;   file = Filepath('qb_boulder_roi.xml', ROOT_DIR=e.Root_Dir, $
;     SUBDIRECTORY=['data'])
;   rois = e.OpenRoi(file)
;
;   ; get the ENVITask
;   task = ENVITask('ROIToGeoJSON')
;   task.INPUT_ROI = rois
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
pro ROItoGeoJSON, $
  debug = debug, $
  epsg_code = epsg_code, $
  has_features = has_features, $
  input_roi = input_roi, $
  output_geojson_uri = output_geojson_uri
  compile_opt idl2, hidden
  if ~keyword_set(debug) then on_error, 2

  ; get current envi
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; get the URI for the ROI
  input_roi_uri = (input_roi[0].dehydrate())['url']

  ; validate
  if ~file_test(input_roi_uri) then begin
    message, 'File for INPUT_ROI source does not exist!'
  endif
  if (epsg_code eq !null) then begin
    epsg_code = 4326
  endif

  ; parse our ROI file
  parsed = ROI_Parse(input_roi_uri, /debug)

  ; check that we have regions
  if parsed.isEmpty() then begin
    message, 'No regions in ROI to process'
  endif

  ; create our output coordinate system
  outputCoordSys = ENVICoordSys(coord_sys_code = epsg_code)

  ; make some lists to store information about our ROI
  verts = list()
  types = list()
  properties = list()

  ; lookup for coord sys since we may iterate many times, reduce overhead
  lookup = hash()

  ; set up our iterator
  foreach roiInfo, parsed, roiName do begin
    ; print, roiName
    ; build our properties for this ROI
    roiProps = '{"name":"' + roiName + '","color":' + roiInfo['color'] + '}'

    ; process all geometries
    foreach geoCollection, roiInfo['geometry'], geoType do begin
      ; print, '  Geometry: ' + geoType, ', Geometries: ' + strtrim(n)
      ; process all features for our geometries
      foreach item, geoCollection do begin
        ; get our coordniates and see if we need to skip
        coordsArr = item['coordinates']
        if ~ptr_valid(coordsArr) then continue
        nCoords = n_elements(*coordsArr)

        ; get our coordinate system
        coordSysStr = item['coordSys']
        if ~lookup.hasKey(coordSysStr) then lookup[coordSysStr] = ENVICoordSys(coord_sys_str = coordSysStr)
        coordSys = lookup[coordSysStr]

        ; save info about our ROI properties
        properties.add, roiProps

        ; determine our geometry type and condense features to speed processing
        case geoType of
          'points': types.add, 'MultiPoint'
          'polylines': types.add, 'MultiLineString'
          'polygons': types.add, 'Polygon'
          else: ; do nothing
        endcase

        ; hold string features
        strings = strarr(nCoords)

        ; process and convert all geometry
        foreach coords, *coordsArr, idx do begin
          ; convert
          dat = *coords
          coordSys.convertMapToLonLat, reform(dat[0, *]), reform(dat[1, *]), lon, lat
          coordSys.convertlonLatToLonLat, lon, lat, lon, lat, outputCoordSys

          ; update geometry
          strings[idx] = json_serialize(transpose([[lon], [lat]]))
        endforeach

        ; save our properties and coordinates
        if geoType eq 'points' then begin
          verts.add, strjoin(strings, ',')
        endif else begin
          verts.add, '[' + strjoin(strings, ',') + ']'
        endelse
      endforeach
    endforeach
  endforeach

  ; check if objects or string
  ; initialize string, faster to build this way than to use IDL's searialization and objects
  outputGeo = '{"type":"FeatureCollection","features":['

  ; track all of the features that we will be adding in
  features = list()

  ; loop over all of the different features and things to build the geojson!
  ; add all items to the data structure that we found
  if (n_elements(verts) gt 0) then begin
    foreach vert, verts, idx do begin
      ; save the string representation of our feature
      features.add, '{"type":"Feature","properties":' + properties[idx] + ',"geometry":{"type":"' + types[idx] + '","coordinates":' + vert + '}}'
    endforeach
  endif

  ; update our flag if we have features or not
  has_features = n_elements(features) gt 0

  ; check how to proceed
  if has_features then begin
    outputGeo += strjoin(features.toArray(), ',')
  endif

  ; close json
  outputGeo += ']}'

  ; write to disk
  if ~keyword_set(output_geojson_uri) then output_geojson_uri = e.getTemporaryFilename('json')
  openw, lun, output_geojson_uri, /get_lun
  printf, lun, outputGeo, /implied_print
  free_lun, lun
end