# Tokenizer

Converts IDL code into tokens which we can then do a lot of great things with!

> Helpful note: The app `test-parsing-tokenizer` is an easy-to-use dev environment for adding new tokens or troubleshooting existing functionality.

> Important note! See below on how to test and make your life easier when testing and automate test creation.

## Writing/Adding Tokens

> **IMPORTANT NOTE**: Any regex you write **MUST NOT** be global. There are extra checks to reset global regular expressions in javascript which have been omitted for performance reasons

> **IMPORTANT NOTE**: Any regex you write **MUST NOT** have a zero-length match. The end of a regex block can be zero-length, but the start should not be (if it is then we just keep detecting the same feature over and over again unless it is global and we move the lstIndex forwards by one, but that adds complexity).

## Performance Metrics

Starting points for metrics on a high-end windows PC:

```
Reading files [=========================] 0.0s 1546/1547 zoom.pro
  Read time (ms) : 155.46689999848604
  Lines of code  : 448565
Processing files...
Extracting tokens [=========================] 0.0s 1547/1547 zoom.pro
  Processing time (ms): 18362.515800002962 # this time has progress bar removed, saves 1 second
  Processing time (lines/second): 24428.297564755674
```

By comparison, it takes about 5 seconds to compile the code using IDL and a batch file

## Testing

There are quite a few tests written to verify that they parsing-tokenizer is doing the right thing.

Tests live in the `src/test` folder and are split up into two categories:

1. Curated: hand created tests to verify correctness with regular expressions

2. Automated: tests created automatically that were human-reviewed for correctness.

To add more tests, automation is likely the key. To do this, add your tests to `apps/test-parsing-tokenizer/src/test-maker/auto-tests.interface.ts` (make sure to add them in alphabetically so they are easier to track down) and then run:

```
npm run make-parsing-tokenizer-tests
```

This will create all of the automated tests and format them so false-changes won't be tracked.

The nice thing is, however, that you can then use a tool like GitKraken to determine the changes between old and new tests. This lets you quickly see if any tweaks have impacts for currently extracted tokens.

> It is expected that you will manually review any automated test changes to ensure their correctness and completeness. Much easier than writing them by hand, but a human-in-the-loop is required.

## To Do

- [ ] Executive commands and batch files
- [ ] Docs for routines
- [ ] Revisit increment and decrement operators and how we want to handle their extraction
- [ ] Check if the term "procedure" is identified as a procedure definition instead of "pro"

## Completed

- [x] Access
  - [x] Properties
- [x] Ampersands for multiple "single-line" statements in one line
- [x] Assignment
  - [x] Properties
  - [x] Variables
- [x] Brackets
- [x] Colon
- [x] Commas
- [x] Control statements/reserved characters not covered elsewhere (list from tmLanguage file)
  - [x] break|common|compile_opt|continue|forward_function|goto
  - [x] Go-to statements: Do we parse them from found tokens or add new one?
- [x] Keywords
- Keyword assignment is a token, post-processing will need to extract binary keywords (i.e. `/` + variable)
- [x] Line continuations
- [x] Logic statements
  - [x] if-then, if-then-else
  - [x] switch
  - [x] case
  - [x] Ternary (elvis) operators
- [x] Block statements for logic and loops with begin and end
  - [x] Verify single-line equivalents with line continuations
- [x] Loops
  - [x] for
  - [x] foreach
  - [x] while
  - [x] repeat
- [x] Main level programs (via post processing)
- [x] Numbers: integers, decimals, type markup
- [x] Operators and compound operators
- [x] Parentheses (independent of function calls)
- [x] Quotes: single + double quotes and numbers-as-strings (string-like syntax for numbers)
- [x] Routines:
  - [x] Function calls
  - [x] Function method calls
  - [x] Procedure calls
  - [x] Procedure method calls
- [x] Routine definitions
  - [x] Functions/procedures
  - [x] Function/procedure methods
  - [x] Arguments
  - [x] Keywords
- [x] Structures:
  - [x] Names
  - [x] Inheritance
  - [x] Properties
  - [x] Shortcut syntax with named structures and not having to specify property names
- [x] Variables (generic statements that can only be interpreted as a variable)
- [x] Harmonize compound operators and variable assignment to behave the same way. And variable assignment does not always extract the variable name (properties might act like this too)
- [x] The "@" symbol for code blocks

## Rules and Logic

- For non-basic tokens (meaning it has a start and an end), capture groups should **never** have zero-length. This can cause infinite loops with token detection and infinite recursion.
  Now, this can be fixed with smart logic that moves to the next character.
- Use "erased" code to easily detect missing cases/logic in code or know if we have problems with extracting tokens at runtime
- Two operators cannot be back-to-back, but a compound operator can precede an operator
- Reserved variables for loops (i.e. "idx" for foreach and overriding gives you bad descriptor or something like that)
- When we find a function call, check if the function is the name of a variable. if so, and no compile opt, likely array
- Minus sign is always treated as an operator
- Validate strings:
  - Specifically octal/binary/hex strings
  - There are regex test expressions that can do this, just hasn't been implemented
  - Note: octal strings can only use single quotes. Double quotes are shorthand
- Include statements can be found anywhere, logic with post-processing should assess correctness of their location

## Potential Syntax Decisions

### Fix these (make sure they work right)

```
*(*pState).pTitle->SetProperty, color=[255, 255, 255]
*(*pState).pTitle.SetProperty, color=[255, 255, 255]
*(*pState).pTitle.SetProperty(color=[255, 255, 255])
oXaxis -> SetProperty, ticklen=1, gridstyle=1
do_translate = sWps.rTrackballTranslate-> $
```

### Array indexing must be using brackets

```
Return,V(0:R-2)
RowNum = RowNum(1:*)
```

### Line separators Should be Ditched.

This is quite literally, just wrong:

```
FUNCTION VarName, Ptr & RETURN,'' & END
4: do_four: BEGIN & args[7] = P7 & args[6] = P6 & GOTO, do_three & END
```

### Invalid syntax: Missing method names

Line continuations in method names, or after method operators, will be considered invalid. Not only does Zach consider this wrong, you don't know what is going on without context (routine calls should all be on the same line).

```
oContainer = self->IDLitContainer:: $
sEvent.component-> $
do_translate = sWps.rTrackballTranslate-> $
```

### Exclamation point in routine names

And what is up with this?

```idl
FUNCTION !SERVER::\_overloadPrint
```

### Limited Characters After Line Continuation

This is wrong, not even sure what this person is doing, but it is wrong.

Only allowed characters after a line continuation should be comments and everything else is invalid

```
SET_VALUE=sval, UVALUE=uvalue, $ XOFFSET=xoffset, XSIZE=xsize, $
```

And this "comment" should also be invalid

```
oZoom: OBJ_NEW()                 $ Zoom visual
3: Graphic, name, arg1, arg2, arg3, /STREAMLINE, _EXTRA=ex, $\\
```

### Routine Names

While you can parse it, this will give an error as it is extremely confusing compared to system variables (not system routines and routines are already system routines)

```
pro !tyest
  print, 'im valid for some reason'
end
```

### Bad String Syntax

Why is this allowed?

```
if "mystring"then print, 'so bad'
```

### Horrendous and Ambiguous Line Continuations

Source: idlfflanguagecat\_\_define

You can't easily tell that this is the end of a procedure without looking at the next line

```
if depth eq 8 then $
  for i=0,rows-1 do $  ;Each row
      writeu, unit, byte(img[*,i]), 0b $ ; <---- HERE
else for i=0, rows-1 do $
; Bug Fix. FOR A 24 Bit image. A standard SRF stores colors in a
; BGR format, not a RGB format!
  writeu, unit, byte(img[[2,1,0],*,i]), [0b,0b,0b]
```

Source: kruskal_wallis

Unnecessary line continuation and just horribly written code here. Will not be supported and will return an error

```
if start lt size then     $

  while (sortd(start) eq sortd(stop)) DO BEGIN
                              ;how many of same rank
    stop =stop +1
    if stop gt size THEN goto, fine
ENDWHILE $ <---- HERE, why line continuation? unknown syntax

ELSE  stop = stop+1 <---- HERE, else is a variable
```

### Invalid GoTo and Jump Statements

Reserved words

```
				goto,break ; <---- HERE, reserved word "break"
			endif else begin
				FREE_LUN, cat_lun
				self.cat_lun = -1
			endelse
		endfor
break: ; <---- HERE, parsed as "break" control statement and then ":" which is unexpected
```
