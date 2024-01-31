### Switch

The `switch` statement evaluates one or more logical statements and evaluates the first one found to be true. Additionally, `switch` will execute every statement that doesn't include a `break` to stop execution.

> Pro tip: Think of the `switch` statement like a literal switch. Once it turns on, it evaluates everything afterwards unless it in interrupted with a break

```idl
; the situation we are in
howBad = 0

; see how much the trash has been squished
switch howBad of
  ; evaluate the first statement
  0: print, 'I have a bad feeling about this'

  ; and the next, because we don't have a break
  1: print, 'I think you should brace it with something'

  ; stop executing after we encounter this break
  2; begin
    print, 'In another life, I was a jedi and used the force to save us'
    break
  end

  ; default if nothing else if true
  else: print, 'It is not a dire situation'
endswitch
```
