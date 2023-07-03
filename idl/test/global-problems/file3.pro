pro mypro
  compile_opt idl2
end

function myfunc
  compile_opt idl2
  return, 1
end

pro myclass::method1
  compile_opt idl2

end

function myclass::method1
  compile_opt idl2
  return, 1
end

pro myclass__define
  compile_opt idl2

end