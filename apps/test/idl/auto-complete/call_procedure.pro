compile_opt idl2

; do nothing apart from what we have already
call_procedure

; if first arg and single quote, then send names
call_procedure, ''

; if first arg and double quote, then send names
call_procedure, ""

; if first arg and literal string, then send names
call_procedure, ``

; add keywords
call_procedure, 'print', 

end