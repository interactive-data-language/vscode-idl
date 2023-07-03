# parsing-syntax-validators

> All validators must be added to `src.index.ts` as an export in order to be activated.

This library is to add syntax validators to tokens and is the main entry-point to add feedback to users during development and detect problems before compiling code.

In order to add new rules, follow some of the examples in `src/lib/validators` and add as an export in `src/index.ts`

Tests should be added to `parsing/parser` via automated tests to avoid circular dependencies.

## Validators to add

- Don't have two routines of the same name/type in the same file
- when calling routines, keywords and binary keywords are not reserved words (i.e. message has "/continue"). if reserved then use the ellipsis/ information like VSCode has so you have some feedback to update the source routine, but dont throw an error
- routine names not reserved words same as vars
- make sure loops/logic statements have children
- check routine names, function calls, and any identifier for reserved words/ terms
- reserved variables/terms within loops (i.e. never change the value of the key for a foreach loop, warning for adjusting for loop)
- Variables before assignment
- Procedures or procedure methods must be called first on a line
- How do we define the types of things that we expect to have between tokens. For example, if a variable is used in assignment then we need to make sure operators or commas separate our statements
- verify no argument names match keyword variable names

---

never again are you going to need to go into the task manager to kill and idl workbench process to release ENVI rasters!
never again are you going to have to deal with breakpoints jumping around and not staying where you expect them to be
