### Break

The break statement stops the current loop or switch statement from progressing and exits.

```idl
; how worthy is our super hero
worthiness = 0

; train our super hero to be better
while !true do begin
  ; if we are worthy to pick up mjolnir and wield the power of thor, then stop
  if (worthiness ge 1e6) then break

  ; increase our strength by training
  doSomeSuperHeroTraining
  worthiness++
endwhile
```
