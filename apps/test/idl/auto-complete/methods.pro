;+
; :Keywords:
;   kew: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro TestCompletion::method, kew = kw1
  compile_opt idl2

  foo = 'bar'

  ; send everything
  self.m

  ; send all methods
  self->

  ;          | only function methods
  self.method()

  ;    | everything
  self.method,

  ;          | everything
  self.method,

  ; keywords and vars
  self.method,

  ; keywords and vars
  self.method()

  ; no procedure methods
  a = self.
end

;+
; :Returns: any
;
; :Keywords:
;   kew: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
function TestCompletion::method, kew = kw1
  compile_opt idl2

  foo = 'bar'

  ; dont send properties for auto complete
  self.getProperty,

  return, 1
end

;+
; :Description:
;   Class definition procedure
;
; :TestCompletion:
;   myProp: any
;     Placeholder docs for argument, keyword, or property
;   myProp2: any
;     Placeholder docs for argument, keyword, or property
;
;-
pro testcompletion__define
  compile_opt idl2

  !null = {TestCompletion, myProp: 1, myProp2: 2}
end