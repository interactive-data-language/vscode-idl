;+
; :Private:
;
; :Description:
;   File used for parsing the ENVI ROI XML format into a data structure
;   that is easy to work with.
;
;   Used internally for roitogeojson
;
; :Returns: any
;
; :Arguments:
;   node: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
; :Author:
;   Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)
;
;-
function _roi_parse_properties, node
  compile_opt idl2, hidden

  ; make an object
  props = orderedhash()

  ; get our attributes
  attrs = node.getAttributes()
  n = attrs.getLength()
  if (n gt 0) then begin
    for i = 0, n - 1 do begin
      attr = attrs.item(i)
      props[attr.getNodeName()] = attr.getNodeValue()
    endfor
  endif

  ; check for name fixes
  if props.hasKey('name') then begin
    ; remove non-ascii character from OSM
    name = props['name']
    posName = strpos(name, 'OpenStreetMap_')
    if (posName ne -1) then name = strmid(name, posName)

    ; check for double quotes already
    ; fix strings that contain double quotes - bad character
    if (strpos(name, '"') ne -1) then begin
      ; escape all characters
      name = json_serialize(name)

      ; trim leading and training quotes, needed because we add them in later on
      name = strmid(name, 1, strlen(name) - 2)
    endif

    ; save name
    props['name'] = name
  endif

  return, props
end

;+
; :Returns: any
;
; :Arguments:
;   roi_uri: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   debug: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
function ROI_Parse, roi_uri, debug = debug
  compile_opt idl2, hidden
  if ~keyword_set(debug) then on_error, 2

  ; init result
  results = orderedhash()

  ; make our parser and load the XML file
  dom = IDLffXMLDOMDocument()
  dom.load, filename = roi_uri

  ; get region definitions in the XML
  regions = dom.getElementsByTagName('Region')
  n = regions.getLength()

  ; make sure we have regions to process
  if (n gt 0) then begin
    ; process all regions in the XML
    for i = 0, n - 1 do begin
      ; get the node for our ROI
      region = regions.item(i)

      ; get our name and color
      props = _roi_parse_properties(region)

      ; skip if missing name or color
      if ~props.hasKey('name') or ~props.hasKey('color') then continue

      ; save the name in a variable
      roiName = props['name']

      ; initialize geometry if needed
      if ~results.hasKey(roiName) then begin
        results[roiName, 'color'] = '[' + props['color'] + ']'
        results[roiName, 'geometry'] = orderedhash('points', list(), 'polylines', list(), 'polygons', list())
      endif

      ; process all geometry definitions
      geometries = region.getElementsByTagName('GeometryDef')
      nGeo = geometries.getLength()
      if (nGeo gt 0) then begin
        for j = 0, nGeo - 1 do begin
          ; get the geometry definition
          geo = geometries.item(j)

          ; verify coord sys string
          coordSysList = geo.getElementsByTagName('CoordSysStr')
          nCoordSys = coordSysList.getLength()
          if (nCoordSys eq 0) then continue
          coordSysNode = coordSysList.item(0)
          kids = coordSysNode.getChildNodes()
          coordSysNode = kids.item(0)
          coordSys = coordSysNode.getNodeValue()

          ; skip if no coord sys
          if ~keyword_set(coordSys) then continue

          ; get all coordinates nodes in our geometry
          coordsNodes = geo.getElementsByTagName('Coordinates')
          nCoords = coordsNodes.getLength()

          ; skip if nothing
          if (nCoords eq 0) then continue

          ; process only if we have data
          if (nCoords gt 0) then begin
            ; count how many we filled
            filled = 0

            ; initialize information
            coordinates = ptrarr(nCoords)
            nvertices = ulon64arr(nCoords)

            ; placeholders for things and stuff
            types = strarr(nCoords)
            aux = strarr(nCoords)

            ; process each set of coordinates
            for z = 0, nCoords - 1 do begin
              ; get the item
              coordsNode = coordsNodes.item(z)
              parent = coordsNode.getParentNode()

              ; make coordinates pretty
              coords = (coordsNode.getFirstChild()).getData()
              num = double(strsplit(coords, ' ', /extract))
              nvertices[z] = n_elements(num) / 2
              num = reform(num, [2, nvertices[z]])

              ; save our coordinates
              coordinates[z] = ptr_new(num)

              ; get our geometry name
              geomName = parent.getNodeName()

              ; update counter
              filled++

              ; check what kind of geometry we have
              case geomName of
                'LinearRing': begin
                  ; get the grandparent
                  grandparent = parent.getParentNode()
                  grandParentName = grandparent.getNodeName()

                  ; save aux info about the grandparent
                  aux[z] = grandParentName
                  types[z] = 'Polygon'
                end
                else: types[z] = geomName ; do nothing
              endcase
            endfor ; coords iterator
          endif

          ; process our geometries
          idxPoints = where(types eq 'Point', countPoints)
          idxLines = where(types eq 'LineString', countLines)
          idxPolygons = where(types eq 'Polygon', countPolygons)

          ; process points
          if (countPoints gt 0) then begin
            nVerts = nvertices[idxPoints]
            pVerts = coordinates[idxPoints]

            ; allocate an array
            coords = dblarr([2, total(nVerts)], /nozero)

            ; get starts and ends for our verts we are indexing
            ends = ulong64(total(nVerts, /cumulative))
            if (countPoints gt 1) then begin
              starts = [0, ends[0 : -2]]
            endif else begin
              starts = [0]
            endelse

            ; populate
            for zz = 0, countPoints - 1 do coords[*, starts[zz] : ends[zz] - 1] = *pVerts[zz]

            ; save the geometry
            results[roiName, 'geometry', 'points'].add, orderedhash('coordSys', coordSys, 'coordinates', ptr_new([ptr_new(coords)]))
          endif

          ; process lines - do nothing here
          if (countLines gt 0) then begin
            ; save the geometry
            results[roiName, 'geometry', 'polylines'].add, orderedhash('coordSys', coordSys, 'coordinates', ptr_new(coordinates[idxLines]))
          endif

          ; process polygons
          if (countPolygons gt 0) then begin
            ; get the auxiliary information about our items
            pAux = aux[idxPolygons]

            ; get starts and ends for our verts we are indexing
            starts = where(pAux eq 'Exterior', countStart, complement = ends)

            ; split our polygon up
            if (countStart gt 0) then begin
              ; process each polygon
              foreach idxStart, starts, idx do begin
                ; specify that the last element we grab is the same
                idxEnd = idxStart

                ; check if we have more than one item for our polygon
                ; meaning holes
                case !true of
                  ; next start is not the next element in pointer array
                  (idx ne countStart - 1): begin
                    if (starts[idx + 1] ne idxStart + 1) then begin
                      idxEnd = starts[idx + 1] - 1
                    endif
                  end
                  ; last start index is before the end
                  (idx eq countStart - 1): begin
                    if (idx ne countPolygons - 1) then begin
                      idxEnd = countPolygons - 1
                    endif
                  end
                endcase

                ; get the indices to extract
                idxExtract = idxPolygons[idxStart : idxEnd]

                ; save our geometry
                results[roiName, 'geometry', 'polygons'].add, orderedhash('coordSys', coordSys, 'coordinates', ptr_new(coordinates[idxExtract]))
              endforeach
            endif
          endif
        endfor
      endif
    endfor
  endif

  ; return our results
  return, results
end