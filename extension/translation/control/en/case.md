### Case

The `case` statement evaluates one or more logical statements and executes the first one that equates to true. Think of the case statement as a way to organize an if-then statement with more than one condition.

> The case statement only executes one statement, compared to the switch, which can execute more than one.

> You can think of the case statement like

```idl
; it really is
myFavoriteNumber = 17

; try and guess the favorite number
case myFavoriteNumber of
  ; single-line case statement
  7: print, 'Your favorite number is 7'

  ; use blocks to execute as many statements as you want
  42: begin
    print, 'Is it really that simple to guess your favorite number?'
  end

  ; default if nothing else if true
  else: print, 'I do not know your favorite number :('
endcase
```
