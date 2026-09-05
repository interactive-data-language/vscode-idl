pro mypro17_1, a, b, c
  compile_opt idl2
  a = self.property
end
pro mypro17_2,a, b, c, c=b,$
  a = b,$ ; comment
  ; comment
  
    
  c = f
  compile_opt idl2
  a = self.property
end
pro myclass17::method1, a, b, c
  compile_opt idl2
  a = self.property
end
pro myclass17::method2,a, b, c, a=b,$
  a = b,$ ; comment
  ; comment
  
    
  c = f
  compile_opt idl2
  a = self.property
end

function myfunc17_1, a, b, c
  compile_opt idl2
  a = self.property
  return, 17
end
function myfunc17_2,a, b, c, c=b,$
  a = b,$ ; comment
  ; comment
  
    
  c = f
  compile_opt idl2
  a = self.property
  return, 17
end
function myclass17::method17, a, b, c
  compile_opt idl2
  a = self.property
  return, 17
end
function myclass17::method2,a, b,$
  a = b,$ ; comment
  ; comment


  c = f
  compile_opt idl2
  a = self.property
  return, 17
end

pro loops, a, b, c, $
  THING = t
  compile_opt idl2

  FOR X = 1.5, 10.5 DO S = S + SQRT(X)

  FOR K = 0, N - 1 DO BEGIN
    C = A[K]
    HIST(C) = HIST(C)+1
    break
    continue
  ENDFOR

  REPEAT A = A * 2 UNTIL A GT B

  REPEAT BEGIN
    A = A * 2
    if !true then continue
  ENDREP UNTIL A GT B

  WHILE ~EOF(1) DO READF, 1, A, B, C

  WHILE ~EOF(1) DO BEGIN
    READF, 1, A, B, C
  ENDWHILE

  FOREACH element, array DO PRINT, 'Value = ', element

  FOREACH element, list DO BEGIN
    PRINT, 'Value = ', element
  ENDFOREACH
end

; TODO: something
pro mypro17
  compile_opt idl2
  a = self.property
end

function myfunc17
  compile_opt idl2
  return, 1
  a = self.property
end

pro myclass::method17
  compile_opt idl2
  a = self.property
end

function myclass::method17
  compile_opt idl2
  return, 1
  a = self.property
end

pro myclass17__define
  compile_opt idl2
  a = {name, inherits myclass, property: {sub, prop1: 5, prop2: 6}}
  a = self.property
end

pro advanced_syntax
  compile_opt idl2

    ; common blocks with line continuations
    common colors, r, g, b, $
      ; something
      
      cur_red

    ; if-then-else with line continuations
    if (sMainState.sprojstate.projtype) then $ ; comments
      ; comment
  
      sumImage = $   
        fltarr(xS, yS) $
  
    else  $
      ; comment
      procedure,$
      sumImage = bytarr(xS, yS)

end

; main level program
compile_opt idl2

a = func(func())
a = func(func(), KW2 = obj.method(func()))
mypro
mypro, arg1, func(), KW1 = var.method(var.method2())
var.method
var._method, func(), obj.method(), 1
void = self.parent::method()
self.parent::method
self.method
self->method
oVis[i]._IDLitVisualization::SetProperty, GROUP_PARENT = self
oVis[iOk[i]]->_IDLitVisualization::SetProperty, GROUP_PARENT = obj_new()

a = !awesome

a = lambda(x:x+5)

;---------------------------------------------------------------------------
; numbers
;----------------------------------------------------------------------------
some5ing
a = 5 * b
a = 5.0
a = 5.
a = .5d
a = 5B
b = 0S
d = 0L
e = 0UL
f = 0LL
g = 0ULL
i = 0.0D
i = -0.0D
j = '101010'b
k = "101010"b
k = "101010b
l = 'AF'x
m = 0xaf

; All of these should be chromacoded as numbers
a = 101 + 101b + 101ub + 101ull
a = '101'b + '101'bub + '101'buLL
a = "101"b + "101"bub + "101"buLL
a = '127'o + '127'oub + '127'ouLL
a = "127"o + "127"oub + "127"ouLL
a = "127 + "127ub + "127uLL
a = '1234'X + '8F'xub + '8F'xulL
a = "1234"x + "8F"xub + "8F"xulL
a = "8F"xub + "8F"xulL
a = 0x8FFF + 0x8Fub + 0x8FulL

a = "1234" + '6541'  ; should be strings
a = '1234'

a = b + 5

;+
; :something:
;   param: in, thing, other, last
;    some comments about it
;+

; Following 2 lines should have warnings
a = '1234
a = "888

a = `some\r\nthing`
a = `something \` ${func(a = b, c=d, /kw) + 6*12} else ${5*5 + `something` + nested}  some`
a = `just string` + variable; and comment

a = 'escaped''single \nquote'
a = "escaped""double \rquote"

a = !thing

a = *var ne 5 && 6 || 7
a = *(*var)
end