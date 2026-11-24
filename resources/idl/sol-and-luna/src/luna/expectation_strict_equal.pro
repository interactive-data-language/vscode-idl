;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;   Recursively compares two values. They must have the same type,
;   dimensions, and contents. Objects must be the same class, and
;   lists, hashes, orderedhashes, dictionaries, and structures are
;   compared by their contents.
;
; :Returns: Boolean
;
; :Arguments:
;   a: in, required, any
;     Specify the first value.
;   b: in, required, any
;     Specify the second value.
;
;-
function expectation_strict_equal, a, b
  compile_opt idl2, hidden

  type = size(a, /type)
  if (type ne size(b, /type)) then return, 0
  if ~array_equal(size(a, /dimensions), size(b, /dimensions)) then return, 0

  ; arrays of objects and structures are compared one element at a time (structures
  ; are always arrays in IDL, so a single structure is compared by its tags below).
  ; Lists and hashes overload SIZE, so object arrays are found with OBJ_ISA instead.
  isObjectArray = 0
  if (type eq 11) then isObjectArray = n_elements(obj_isa(a, 'IDL_OBJECT')) gt 1
  if isObjectArray or ((type eq 8) and (n_elements(a) gt 1)) then begin
    for i = 0, n_elements(a) - 1 do begin
      if ~expectation_strict_equal(a[i], b[i]) then return, 0
    endfor
    return, 1
  endif

  switch (type) of
    8: begin
      tags = tag_names(a)
      if ~array_equal(tags, tag_names(b)) then return, 0
      for i = 0, n_elements(tags) - 1 do begin
        if ~expectation_strict_equal(a.(i), b.(i)) then return, 0
      endfor
      return, 1
    end
    10: return, a eq b
    11: begin
      if ~obj_valid(a) or ~obj_valid(b) then return, ~obj_valid(a) and ~obj_valid(b)
      if (obj_class(a) ne obj_class(b)) then return, 0
      if isa(a, 'list') then begin
        if (a.count() ne b.count()) then return, 0
        for i = 0, a.count() - 1 do begin
          if ~expectation_strict_equal(a[i], b[i]) then return, 0
        endfor
        return, 1
      endif
      if isa(a, 'hash') or isa(a, 'orderedhash') or isa(a, 'dictionary') then begin
        if (a.count() ne b.count()) then return, 0
        foreach key, a.keys() do begin
          if ~b.hasKey(key) then return, 0
          if ~expectation_strict_equal(a[key], b[key]) then return, 0
        endforeach
        return, 1
      endif
      return, obj_valid(a, /get_heap_identifier) eq obj_valid(b, /get_heap_identifier)
    end
    else: return, array_equal(a, b)
  endswitch
end
