function go_to_def_call_function
  compile_opt idl2, hidden
  return, 1
end

compile_opt idl2

; add keywords
!null = call_function('go_to_def_call_function')

end