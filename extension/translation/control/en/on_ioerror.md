### on_ioerror

`on_ioerror` specifies a statement to be jumped to if an I/O error occurs in the current procedure. Normally, when an I/O error occurs, an error message is printed and program execution is stopped.

If `on_ioerror` is called and an I/O related error later occurs in the same procedure activation, control is transferred to the designated statement with the error code stored in the system variable !ERROR_STATE. The text of the error message is contained in !ERROR_STATE.MSG.

The effect of `on_ioerror` can be canceled by using the label “NULL” in the call.

Note: Note that calls to `on_ioerror` made in the procedure that causes an I/O error supersede any error handling mechanisms created with CATCH and the program branches to the label specified by `on_ioerror`.

### Example

```idl
i = 0 ; Number to read:

valid = 0 ; Valid flag

while valid eq 0 do begin
  on_ioerror, bad_num
  read, 'Enter Number: ', i
  ; If we get here, i is good.
  valid = 1
  bad_num: if ~valid then $
    print, 'You entered an invalid number.'
endwhile
```
