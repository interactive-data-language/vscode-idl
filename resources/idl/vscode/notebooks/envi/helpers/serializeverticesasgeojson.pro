;+
; :Private:
;
; :Description:
;   Creates GeoJSON for a polygon of data represented as a List
;
; :Returns: String
;
; :Arguments:
;   features: in, required, List<any>
;     List of lists
;
;-
function SerializeVerticesAsGeoJSON, features
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