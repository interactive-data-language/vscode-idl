compile_opt idl2

; do nothing apart from what we have already
!null = ENVITask()
!null = IDLTask()

; if first arg and single quote, then send names
!null = ENVITask('')
!null = IDLTask('')

; if first arg and double quote, then send names
!null = ENVITask("")
!null = IDLTask("")

; if first arg and literal string, then send names
!null = ENVITask(``)
!null = IDLTask(``)

end