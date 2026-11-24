;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;   Escapes the characters that cannot be used as-is in XML text or attribute values.
;
; :Returns: String
;
; :Arguments:
;   text: in, required, String
;     Text to escape.
;
;-
function sol_xml_escape, text
  compile_opt idl2, hidden
  out = text.replace('&', '&amp;')
  out = out.replace('<', '&lt;')
  out = out.replace('>', '&gt;')
  return, out.replace('"', '&quot;')
end
