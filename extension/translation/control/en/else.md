### Else

The `else` statement is the second half of the `if` statement and executes when a condition is not met.

```idl
if (prometheusFindsAliens) then foundEngineers = !true else foundEngineers = !false
```

Just like the if statement, we can use blocks to execute more than one statement.

```idl
if (bridgeKeeperSays eq 'stop') then begin
  answerQuestions
endif else begin
  problemSolve
  andEcape
endif
```
