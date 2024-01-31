### While Loop

Executes a statement or groups of statements until a condition is met.

> Infinity is closer than you think when using `while` loops, so make sure to have proper exit conditions

```idl
; a basic while loop
i = 0
while (i lt 10) do i++

; another while loop
while (snakesOnPlane) do defeatSnakes

; while loop with a block
meaningOfLife = 42
while (meaningOfLife eq 42) do begin
  ; exit our loop if our condition is met
  ; if you have a "truthy" loop that never ends, then
  ; make sure to have exit conditions
  if (itsNotThatSimple) then break
endwhile
```
