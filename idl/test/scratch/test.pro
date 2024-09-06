pro TestClass__define
  compile_opt idl2
  !null = {TestClass, data: ptr_new()}
end

function TestClass::init, value
  compile_opt idl2
  self.data = ptr_new(0)
  *self.data = value
  return, 1
end

pro TestClass::Cleanup, keyword = keyword
  compile_opt idl2
  if keyword_set(keyword) then print, 'keyword set!'
  print, 'I have been called!'
end


pro test
  compile_opt idl2

  obj = obj_new('TestClass', 1)

  obj_destroy, obj, /keyword 
end