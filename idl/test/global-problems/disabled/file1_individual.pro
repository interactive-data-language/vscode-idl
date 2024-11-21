; idl-disable-next-line duplicate-pro
pro mypro
  compile_opt idl2
end

; idl-disable-next-line duplicate-func
function myfunc
  compile_opt idl2
  return, 1
end

; idl-disable-next-line duplicate-pro-method
pro myclass::method1
  compile_opt idl2

end

; idl-disable-next-line duplicate-func-method
function myclass::method1
  compile_opt idl2
  return, 1
end
