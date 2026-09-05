;+
; :Private:
;
; :Description:
;   Gets the extents for the specified raster in lon/lat for
;   the given EPSG code
;
; :Returns: String
;
; :Arguments:
;   epsgCode: in, optional, Long
;     Specify the EPSG code to get the extents, default is web
;     mercator (3857)
;
;-
function ENVIRaster::getExtents, epsgCode
  compile_opt idl2, hidden
  on_error, 2

  ; get the bounding box
  bbox = getRasterExtents(self, epsgCode)

  ; unpack bounding box
  lon = [bbox[0], bbox[2], bbox[2], bbox[0], bbox[0]]
  lat = [bbox[1], bbox[1], bbox[3], bbox[3], bbox[1]]

  ;+ make 2D array
  coordinates = transpose([[lon], [lat]])

  ; convert to geojson and return
  return, SerializeVerticesAsGeoJSON(list(list(coordinates)))
end