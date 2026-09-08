;+
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
;   If the raster does not have a spatial reference, returns pixel-coordinates.
;
; :Returns: String
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
function getOutlineFeatureCollection, raster, epsg, skip_holes = skip_holes, method = method
  compile_opt idl2, hidden

  ; get current ENVI session
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; make sure we have an EPSG code
  if ~arg_present(epsg) then epsg = 3857

  ; set method
  if ~keyword_set(method) then method = 'idl'

  ;+ output coordinate system
  outCoordSys = ENVICoordSys(coord_sys_code = epsg)

  ; get the max pyramid level
  raster._component.getProperty, pyramid_levels = maxPyramidLevel

  ; get the pyramid level we read at - subtract 2 to put us at 1024 x 1024
  readlevel = maxPyramidLevel - 2 > 0

  ; get display bands
  !null = IDLcf$DefaultRasterDisplayBands(raster._component, useBands)

  ; Get data at a reduced pyramid level
  if (~raster._component.getData(dat, level = readlevel, $
    bands = useBands, $
    pixelstate = ps, $
    interleave = 0)) then begin
    message, IDLcfLangCatQuery('Failed to get data array to generate thumbnail'), /noname
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

  ; get our raster spatial reference
  sRef = raster.spatialref
  coordSys = sRef ne !null ? raster.coord_sys : !null

  ;+
  ; if we have no good pixels, or end up with special cases below, just use
  ; the extents of the raster
  ;-
  if (min(ps) eq 1) then begin
    nofeatures:

    ; creating starting point for vars
    fileX = [0, raster.ncolumns, raster.ncolumns, 0, 0]
    fileY = [0, 0, raster.nrows, raster.nrows, 0]

    ; check if we need to convert our coordinates
    if (coordSys ne !null) then begin
      sRef.convertFileToLonLat, fileX, fileY, lon1, lat1
      coordSys.convertLonLatToLonLat, lon1, lat1, lon, lat, outCoordSys
      coordinates = transpose([[lon], [lat]])
    endif else begin
      coordinates = transpose([[fileX], [fileY]])
    endelse

    ; convert to geojson and return
    return, SerializeVerticesAsGeoJSON(list(list(coordinates)))
  endif

  ; fill in holes in our image if we have bad pixels
  label = label_region(~ps)

  ; check for no real pixel state to check
  if (max(label) eq 0) then goto, nofeatures

  ; resample to get coordinate system
  resampled = ENVIResampleRaster(raster, dimensions = size(ps, /dimensions))

  ; -----------------------------------------------------------------
  ; if we got here, we need to use our resampled raster for the sref
  ; -----------------------------------------------------------------

  ; get our resampled raster spatial reference
  sRef = resampled.spatialref
  coordSys = sRef ne !null ? resampled.coord_sys : !null

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

  ; make a list to store our outlines
  valid = list()

  ; track total vertices for debugging
  tot1 = 0
  tot2 = 0

  ; define smoothing threshold
  SMOOTHING_THRESHOLD = 5

  ; process each chunk in our path and build the parts up
  for i = 0, n_elements(path_info) - 1 do begin
    ; calculate the indices in our new array
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
      sRef.convertFileToLonLat, reform(verts[0, *]), reform(verts[1, *]), lon1, lat1
      coordSys.convertLonLatToLonLat, lon1, lat1, lon, lat, outCoordSys

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
    collection = SerializeVerticesAsGeoJSON(valid)
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
  on_error, 2

  ; make sure we have an EPSG code
  if ~arg_present(epsgCode) then epsgCode = 3857

  ; get BBox and return
  return, getOutlineFeatureCollection(self, epsgCode, skip_holes = skip_holes, method = method)
end

; Start the application
compile_opt idl2
e = envi(/headless)

; Open an input file
file = filepath('qb_boulder_msi', root_dir = e.root_dir, $
  subdirectory = ['data'])
file = 'C:\Users\Zachary.Norman\Downloads\11MAR14020425-P2AS-052498072030_01_P001.NTF'
; file = 'C:\Users\Zachary.Norman\Downloads\11MAR14020425-P2AS-052498072030_01_P001.NTF'
file = 'C:\Users\Zachary.Norman\Downloads\2024-01-01-02-10-11_UMBRA-04_SICD.nitf'
file = 'C:\Users\Zachary.Norman\Downloads\11MAR14020425-P2AS-052498072030_01_P001.NTF'
raster = e.openRaster('C:\Users\Zachary.Norman\Downloads\haiti-jagged-edge.dat')

print, raster.getOutline()

end