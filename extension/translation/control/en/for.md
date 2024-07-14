### For Loop

Use the for loop to execute one or more statements repeatedly until the exit condition is met.

```idl
; a basic for loop
for i=0, 9 do print, i
; output: 0, 1, 2, 3, 4...

; a basic for loop with increment
for i=0, 9, 2 do print, i
; output: 0, 2, 4, 6..

; for loop with a block
for i = 0, 42 do begin
  meaningOfLine = i ; but its not that simple...
endfor
```
