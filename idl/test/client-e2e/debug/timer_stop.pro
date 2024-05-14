;+
; :Arguments:
;   id: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   userData: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro myTimerCallback, id, userData
  compile_opt idl2

  stop
end

compile_opt idl2

id = Timer.Set(1, 'myTimerCallback', 'woof')

end