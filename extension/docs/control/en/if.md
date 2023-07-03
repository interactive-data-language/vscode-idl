### If

The `if` statement conditionally performs an action if a condition is met

```idl
if (spaceOdyssey eq 2001) then findAlienLife = !true
```

Additionally, we can use a block statement to execute complex groups of statements:

```idl
if (weMeetAliens) then begin
  firstContactProtocol = !true
  doMakeFriends
endif
```

Lastly, we can optionally evaluate statements when our conditions are not met using `else`

```idl
if truthyStatement then print, `This is true` else print, `this is false`
```
