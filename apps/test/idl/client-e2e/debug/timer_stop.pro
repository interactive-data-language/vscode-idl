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

id = Timer.set(1, 'myTimerCallback', 'woof')

for i = 0, 10 do wait, 0.1

end