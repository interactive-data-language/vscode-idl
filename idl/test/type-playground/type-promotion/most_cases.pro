;+
; :Returns: any
;
; :Arguments:
;   a: in, required, Number
;     Placeholder docs for argument, keyword, or property
;   b: in, required, ComplexNumber
;     Placeholder docs for argument, keyword, or property
;
;-
function most_cases, a, b
  compile_opt idl2

  byte = 's' + 1b

  int = 's' + 1s

  uint = 's' + 1us

  long = 's' + 1l

  ulong = 's' + 1ul

  long64 = 's' + 1ll

  ulong64 = 's' + 1ull

  float1 = 's' + 1.
  float2 = 's' + 1e

  double = 's' + 1d

  biginteger = 's' + BigInteger(5)

  number = 's' + a

  complexfloat = 's' + 1.i

  complexdouble = 's' + 1di
  complexdouble = 's' + 1dj

  complexnumber1 = 's' + a + 1di + 1dj
  complexnumber2 = a + b

  return, 1
end