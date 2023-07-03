;+
; :Returns: any
;
; :Arguments:
;   a: in, required, Number
;     Placeholder docs for argument, keyword, or property
;   b: in, required, ComplexNumber
;     Placeholder docs for argument, keyword, or property
;   c: in, required, Array<any>
;     Placeholder docs for argument, keyword, or property
;   d: in, required, List<any>
;     Placeholder docs for argument, keyword, or property
;   e: in, required, Hash<any>
;     Placeholder docs for argument, keyword, or property
;   f: in, required, OrderedHash<any>
;     Placeholder docs for argument, keyword, or property
;   g: in, required, Dictionary<any>
;     Placeholder docs for argument, keyword, or property
;   h: in, required, ENVIRasterMetadata
;     Placeholder docs for argument, keyword, or property
;
;-
function allowed_to_index, a, b, c, d, e, f, g, h
  compile_opt idl2

  ; OK
  !null = c[0]
  !null = d[0]
  !null = e[0]
  !null = f[0]
  !null = g[0]

  ; also OK, though non standard IDL types
  !null = h[0]

  ; problems
  byte = ('s' + 1b)[0]
  int = ('s' + 1s)[0]
  uint = ('s' + 1us)[0]
  long = ('s' + 1l)[0]
  ulong = ('s' + 1ul)[0]
  long64 = ('s' + 1ll)[0]
  ulong64 = ('s' + 1ull)[0]
  float1 = ('s' + 1.)[0]
  float2 = ('s' + 1e)[0]
  double = ('s' + 1d)[0]
  biginteger = ('s' + BigInteger(5))[0]
  number = ('s' + a)[0]
  complexfloat = ('s' + 1.i)[0]
  complexdouble = ('s' + 1di)[0]
  complexdouble = ('s' + 1dj)[0]
  complexnumber1 = ('s' + a + 1di + 1dj)[0]
  complexnumber2 = (a + b)[0]

  return, 1
end