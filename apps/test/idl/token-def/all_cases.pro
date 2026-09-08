function func2, kw = kw, kwb = kwb
  compile_opt idl2
  return, 1
end

pro NYStruct0::proMethod1, kw = kw, kwb = kwb
  compile_opt idl2

end

pro NYStruct::proMethod2, kw = kw, kwb = kwb
  compile_opt idl2

end

function NYStruct0::FuncMethod1, kw = kw, kwb = kwb
  compile_opt idl2
  return, 1
end

function NYStruct::FuncMethod2, kw = kw, kwb = kwb
  compile_opt idl2
  return, 1
end

pro pro3, kw = kw, kwb = kwb
  compile_opt idl3
end

pro pro3__define, kw = kw
  compile_opt idl3
  ; first structure
  !null = {NYStruct0, prop1: 5}
  ; second structure
  !null = {NYStruct, inherits NYStruct0, prop2: 6}
end

compile_opt idl2

; structure name
st = {NYStruct}

; defining properties, real, inherited, and fake
!null = {NYStruct, PROP1: 5, PROP2: 6, prop42: 42}

; variable - real
!null = st

; variable - not real
!null = st3

; procedure - real
pro3, kw = 42, kw2 = 4242, /kwb, /kwb2

; procedure - not real
pro42, kw = 42

; function - real
!null = func2(kw = 42, kw2 = 4242, /kwb, /kwb2)

; function - not real
!null = func42(kw = 42)

; property - inherited
!NULL = st.PROP1

; property - directed
!NULL = st.PROP2

; property - not real
!NULL = st.PROP42

; procedure method - inherited
st.proMethod1, kw = 42, kw2 = 4242, /kwb, /kwb2

; procedure method - direct
st.proMethod2, kw = 42, kw2 = 4242, /kwb, /kwb2

; procedure method - not real
st.proMethod42, kw = 42

; function method - inherited
!NULL = st.FuncMethod1(kw = 42, kw2 = 4242, /kwb, /kwb2)

; function method - direct
!NULL = st.FuncMethod2(kw = 42, kw2 = 4242, /kwb, /kwb2)

; function method - not real
!NULL = st.FuncMethod42(kw = 42)

; anonymous structure
anonymous = {SomeThing: 'cool'}

; can find the property
!null = anonymous.SomeThing

END