compile_opt idl2

; do nothing apart from what we have already
!null = call_function()

; if first arg and single quote, then send names
!null = call_function('')

; if first arg and double quote, then send names
!null = call_function("")

; if first arg and literal string, then send names
!null = call_function(``)

; add keywords
!null = call_function('envi', )

end