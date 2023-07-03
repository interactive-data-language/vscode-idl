# parsing-routines

Library that loads a JSON file generated with IDL with information about everything that is documented. This also includes constants that contain lower-case routine names that are reserved.

In the `manual*.interface.ts` files you can add any methods, procedures, or functions that are missing from the docs or incomplete in the docs (i.e. some methods don't have information about them being procedures or functions so we can't check for them).

These manual additions are then included by default in our reserved constants.

Has placeholders (not used yet) to specify deprecated routines.
