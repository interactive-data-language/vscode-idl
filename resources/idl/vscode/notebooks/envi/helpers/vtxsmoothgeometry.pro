;+
; :Returns: any
;
; :Arguments:
;   vertices: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   methods: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   thresholds: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   auto_scale: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;   debug: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
function vtxSmoothGeometry, vertices, methods, thresholds, debug = debug, auto_scale = auto_scale
  compile_opt idl2, hidden
  if ~keyword_set(debug) then on_error, 2

  ; make arrays if not already
  if ~isa(methods, /array) then useMethods = [methods] else useMethods = methods
  if ~isa(thresholds, /array) then useThresholds = [thresholds] else useThresholds = thresholds

  ; set defaults and validate our input
  inputDefaultor, hash('useMethods', ['idl'], 'useThresholds', [1.0])
  inputValidator, hash( $
    'vertices', ['number', 'array', 'required'], $
    'useMethods', ['string', 'array', 'required'], $
    'useThresholds', ['number', 'array', 'required'])

  ; get usable method name
  useMethods = strtrim(strlowcase(useMethods), 2)

  ; verify dimensions
  dims = size(vertices, /dimensions)
  if (n_elements(dims) ne 2) then begin
    message, 'Vertices specified, but no 2d array. Expected data of the form [2, n], where n is the number of vertices.', level = -1
  endif
  if (dims[0] ne 2) then begin
    message, 'Vertices specified, but is not a [2,n] elements array, where n is the number of vertices.', level = -1
  endif

  ; verify thresholds
  if n_elements(useMethods) ne n_elements(useThresholds) then begin
    message, 'Number of methods and threshold do not match!'
  endif

  ; process each case
  smoothed = vertices
  for i = 0, n_elements(useMethods) - 1 do begin
    ; get the number of vertices
    nVerts = n_elements(smoothed) / 2

    ; check what method we are using
    case useMethods[i] of
      'idl': begin
        ply = obj_new('IDLanPolygon2D', vertices = smoothed)
        !null = ply.simplify(keyword_set(auto_scale) ? useThresholds[i] * (alog(nVerts)) ^ 2 : useThresholds[i])
        ply.getproperty, vertices = smoothed
      end
      'zhull': begin
        idx = zhull(smoothed[0, *], smoothed[1, *], min_area = keyword_set(auto_scale) ? useThresholds[i] / alog(nVerts) : useThresholds[i])
        smoothed = smoothed[*, idx]
      end
      else: message, 'Method specified as "' + useMethods[i] + '", but is not valid method for smoothing geometry.', level = -1
    endcase
  endfor

  return, smoothed
end