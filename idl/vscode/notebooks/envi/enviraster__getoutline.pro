;+
;
; :Private:
;
; :Description:
;   Creates GeoJSON for an image bounding box
;
; :Returns: any
;
; :Arguments:
;   features: in, required, List<any>
;     List of lists
;
;-
function getRasterBBox_serialize, features
  compile_opt idl2, hidden

  ; make geoJSON
  ; collection = orderedhash('type', 'FeatureCollection', 'features', list())
  collection = '{"type":"FeatureCollection","features":['

  strings = strarr(n_elements(features))

  ; add all of our shapes
  foreach shape, features, i do begin
    feature = '{"type":"Feature","geometry":{"type":"Polygon","coordinates":['
    foreach arr, shape, j do begin
      if (j eq 0) then begin
        feature += '[' + strjoin('[' + strjoin(strtrim(arr, 2), ',') + ']', ',') + ']'
      endif else begin
        feature += ',[' + strjoin('[' + strjoin(strtrim(arr, 2), ',') + ']', ',') + ']'
      endelse
    endforeach
    feature += ']},"properties":{}}'
    strings[i] = feature
    ; collection['features'].add, orderedhash('type', 'Feature', 'geometry', orderedhash('type', 'Polygon', 'coordinates', shape), 'properties', hash())
  endforeach

  collection += strjoin(strings, ',') + ']}'

  return, collection
end

;+
;
; :Private:
;
; :Description:
;   Generates a bounding box for a raster in-memory. The assumption is that the image
;   being passed to this routine is small and can be processed in-memory.
;
;   The source data this was written for has a maximum size fo 1024 by 1024.
;
;   The result represents the outer polygon for valid pixels in the image.
;   The data ignore value is used to get the correct orientation of data.
;
;   If the raster does not have a spatial reference, returns pixell-coordinates.
;
; :Returns: any
;
; :Arguments:
;   raster: in, required, ENVIRaster
;     Specify the raster you want to process and the get the valid BBox data for.
;   epsg: in, required, Number
;     Specify the EPSG code for the coordinates of the returned bounding box. If
;     the raster is not georeferenced, then pixel coordinates are returned.
;
; :Keywords:
;   method: in, optional, String
;     The type of outline smoothing. Options are 'idl' or 'zhull'. Default is
;     IDL.
;   skip_holes: in, optional, Boolean
;     If set, if there are any holes inside the image where data is not
;     valid, then we skip and don't report
;
; :Author:
;   Zachary Norman - GitHub: znorman-harris
;
;-
function getRasterBBox, raster, epsg, skip_holes = skip_holes, method = method
  compile_opt idl2, hidden

  ; get current ENVI session
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; set method
  if ~keyword_set(method) then method = 'idl'

  ; get the max pyramid level
  raster._component.getProperty, pyramid_levels = maxPyramidLevel

  ; get the pyramid level we read at
  readlevel = maxPyramidLevel - 2 > 0

  ; get display bands
  !null = IDLcf$DefaultRasterDisplayBands(raster._component, useBands)

  ; Get data at a reduced pyramid level - subtract 2 to put us at 1024 x 1024
  if (~raster._component.getData(dat, level = readlevel, $
    bands = useBands, $
    pixelstate = ps, $
    interleave = 0)) then begin
    message, IDLcfLangCatQuery('Failed to get data array for generating outline'), /noname
  endif

  ; create PS if it doesnt exist - edge case for some rasters where its not made
  if ~isa(ps, /array) then ps = bytarr(size(dat, /dimensions))

  ; account for bad pixels
  if raster.metadata.hasTag('data ignore value') then begin
    ps += ~finite(dat) + (dat eq raster.metadata['data ignore value'])
  endif else begin
    ps += ~finite(dat)
  endelse

  ; flatten and combine our pixel state masks
  if (n_elements(useBands) gt 1) then ps = total(ps, 3, /integer)

  ; binarize and get the pixels that we should keep
  ; i.e. pixel state of zero = good
  ps = temporary(ps) eq 0

  ; resample to get coordinate system
  resampled = ENVIResampleRaster(raster, dimensions = size(ps, /dimensions))

  ; get our raste spatial reference
  sRef = raster.spatialref
  coordSys = !null

  ; build coord sys
  if (sRef ne !null) then begin
    if (sRef.coord_sys_code ne 0) then begin
      coordSys = ENVICoordSys(coord_sys_code = sRef.coord_sys_code)
    endif else begin
      if keyword_set(sRef.coord_sys_str) then begin
        coordSys = ENVICoordSys(coord_sys_str = sRef.coord_sys_str)
      endif else begin
        print, 'Raster "' + raster.uri + '" does nto have a standard spatial reference, ignoring center information'
      endelse
    endelse
  endif

  ;+
  ; if we have no data ignore value, or end up with special cases below, just use
  ; the extents of the raster
  ;-
  if (min(ps) eq 1) then begin
    nofeatures:

    ; creating starting point for vars
    lat = [0, 0, raster.nrows, raster.nrows, 0]
    lon = [0, raster.ncolumns, raster.ncolumns, 0, 0]

    ; check if we need to convert our coordinates
    if (coordSys ne !null) then begin
      sRef.convertFileToLonLat, lon, lat, lon, lat

      ; convert center from old to new coordinate system
      coordSys.convertLonLatToLonLat, lon, lat, lon, lat, ENVICoordSys(coord_sys_code = epsg)
    endif
    coordinates = transpose([[lon], [lat]])

    ; clean up
    resampled.close

    ; convert to geojson and return
    return, getRasterBBox_serialize(list(list(coordinates)))
  endif

  ; if we got here, we need to use our resampled raster for the sref

  ; get our raste spatial reference
  sRef = resampled.spatialref
  coordSys = !null

  ; build coord sys
  if (sRef ne !null) then begin
    if (sRef.coord_sys_code ne 0) then begin
      coordSys = ENVICoordSys(coord_sys_code = sRef.coord_sys_code)
    endif else begin
      if keyword_set(sRef.coord_sys_str) then begin
        coordSys = ENVICoordSys(coord_sys_str = sRef.coord_sys_str)
      endif else begin
        print, 'Raster "' + raster.uri + '" does nto have a standard spatial reference, ignoring center information'
      endelse
    endelse
  endif

  ; fill in holes in our image if we have bad pixels
  label = label_region(~ps)

  ; get pixel locations
  ; label[0] will be the edges,
  ; label[1] will be the background, etc.
  h = histogram(label, min = 1, reverse_indices = r)

  ; define threshold for small pixel clump
  IGNORE_CLUMP_MINIMUM = 100

  ; process each histogram bin
  for i = 0, n_elements(h) - 1 do begin
    ; remove small pixel clumps
    if (h[i] le IGNORE_CLUMP_MINIMUM) and (h[i] gt 0) then begin
      ps[r[r[i] : r[i + 1] - 1]] = 0
    endif
  endfor

  ; get entity outline
  contour, ps, path_info = path_info, path_xy = vertices, /path_data_coords, nlevels = 1

  ; get the number of parts
  ; nParts = n_elements(path_info) eq 1 ? 0 : n_elements(path_info)

  ; make a list to store our outlines
  valid = list()

  ; track total vertices for debugging
  tot1 = 0
  tot2 = 0

  ; define smoothing threshold
  SMOOTHING_THRESHOLD = 5

  ; process each part
  ; process each chunk in our path and build the parts up
  for i = 0, n_elements(path_info) - 1 do begin
    ; caluclate the indices in our new array
    newIdx = path_info[i].offset + i + [0l : path_info[i].n]
    verts = vertices[*, path_info[i].offset + [[0l : path_info[i].n - 1], 0]]
    tot1 += n_elements(newIdx)

    ; get the area of our vertices
    area = abs(poly_area(verts[0, *], verts[1, *]))

    ; check if our area is too small and we need to skip
    if (area le IGNORE_CLUMP_MINIMUM) then continue

    ; check if we are a hole or not
    isHole = ~path_info[i].high_low

    ; check if we are a hole or not
    if ~isHole then begin
      lastOutline = list()
      valid.add, lastOutline
    endif else begin
      if keyword_set(skip_holes) then break
    endelse

    ; increase smoothing by the complexity of the geometry
    factor = alog(sqrt(n_elements(newIdx)))

    ; smooth
    verts = vtxSmoothGeometry(verts, method, SMOOTHING_THRESHOLD * factor)

    ; get the number of vertices
    tot2 += (size(verts, /dimensions))[1]

    ; check if we need to convert our coordinates
    if (coordSys ne !null) then begin
      sRef.convertFileToLonLat, reform(verts[0, *]), reform(verts[1, *]), lon, lat

      ; convert center from old to new coordinate system
      coordSys.convertLonLatToLonLat, lon, lat, lon, lat, ENVICoordSys(coord_sys_code = epsg)

      ; remake our verts
      verts = transpose([[lon], [lat]])
    endif else begin
      ; round
      verts = round(verts)
    endelse

    ; save our vertices
    lastOutline.add, verts

    ; debug plot
    ; if (i eq 0) then begin
    ; sp = plot(verts[0,*], verts[1,*], ASPECT_RATIO=1, XRANGE = [0,raster.ncolumns], YRANGE=[0,raster.nrows], COLOR = isHole ? 'red' : 'blue', DIMENSIONS = [1200,900])
    ; endif else begin
    ; !null = plot(verts[0,*], verts[1,*], OVERPLOT=sp, COLOR = isHole ? 'red' : 'blue')
    ; endelse
  endfor

  ; serialize the collection
  if (n_elements(valid) gt 0) then begin
    collection = getRasterBBox_serialize(valid)
  endif else begin
    ; no features, so we need to use default logic
    goto, nofeatures
  endelse

  ; clean up
  resampled.close

  ; return the geometry collection
  return, collection
end

;+
; :Description:
;   Returns a GeoJSON string representing the outline of the extents
;   of the raster.
;
;   The outline is generated using a low-resolution version of the image that
;   takes into account masked pixels and will be oriented along the
;   same direction of the original raster.
;
;   If the raster does not have a spatial reference, then pixel coordinates
;   are used for the extents.
;
; :Returns: String
;
; :Arguments:
;   epsgCode: in, optional, Number
;     Specify the EPSG code for the outline of the rester
;
; :Keywords:
;   method: in, optional, String
;     The type of outline smoothing. Options are 'idl' or 'zhull'. Default is
;     IDL.
;   skip_holes: in, optional, Boolean
;     If set, if there are any holes inside the image where data is not
;     valid, then we skip and don't report
;
;-
function ENVIRaster::getOutline, epsgCode, skip_holes = skip_holes, method = method
  compile_opt idl2, hidden
  ; on_error, 2

  ; make sure we have an EPSG code
  if ~arg_present(epsgCode) then epsgCode = 3857

  ; get BBox and return
  return, getRasterBBox(self, epsgCode, skip_holes = skip_holes, method = method)
end

; Start the application
compile_opt idl2
e = envi(/headless)

; Open an input file
file = filepath('qb_boulder_msi', root_dir = e.root_dir, $
  subdirectory = ['data'])
file = 'c:\Users\znorman\Downloads\CAPELLA_C09_SM_GEO_HH_20230528080239_20230528080244.tif'
; file = 'c:\TradeshowContent\ENVI_DEMOS\SAR\SICD\Helicopters\sar_cog.tif'
raster = e.openRaster(file)

tic
print, raster.getOutline(3857)
toc

end