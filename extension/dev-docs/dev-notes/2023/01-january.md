# Changes

Lots of features and capabilities since we last talked!

## Package JSON

Making tests has been cleaned up. It is now `npm run generate-tests`.

## VSCode Client

A minor, but important update was made to the logging system which can now pass additional metadata for alerts to the VSCode client.

The alert metadata has two capabilities:

1. Specifying a file that should be opened (i.e. bad `idl.json` or PRO code)

2. Alerting user that IDL has not been configured and adding a button dynamically so they can click and set it.

This will probably grow in the future, but is key to add hooks between the back-end (server) and front-end (client).

## Assembler

- More concise naming with _style_ vs _format_ and separation of the code to follow this. _Styling_ is for the appearance of individual sections of code (i.e. keywords being upper/lower case) and _formatting_ is how the code is "mechanically" structured (i.e. spacing).

- Placeholders and framework to add different types of styles and formatters in the future

- All important logic for the style and formatting was removed and migrated to separate libs under "assembling/styles" and "assembling/formatters" so they truly act like plugins for formatting our code.

- Rework core iteration of tree to use a common function with callbacks when processing a tree so you don't need a recursive algorithm and duplicate logic all over the place.

```typescript
// use our tree recurser to process what we parsed
TreeRecurser(parsed, {
  onBasicToken: (token, current) => {
    handler.processBasicToken(token, parsed, metaResolver(current));
  },
  onBranchToken: (token, current) => {
    handler.processBranchToken(token, parsed, metaResolver(current));
  },
});
```

- This has been tied into our core callback framework for tokens (TreeCallbackHandler) as an additional method to execute code when we encounter tokens

- This applies to:

  - Tree post-processing (mapping tokens from one type to another)

  - Tree validation (checking for syntax errors)

  - Assembler pre-processing (do anything custom such as fix problems, etc)

  - Assembler styling (upper/lower case of code)

  - Assembler formatting (spacing of code)

## Assembler Config

To match our naming rework above, the config file for IDL now look like the following:

```json
{
  "formatter": "fiddle",
  "tabWidth": 2,
  "autoFix": true,
  "autoDoc": true,
  "eol": "lf",
  "style": {
    "control": "dated",
    "internalRoutines": "none",
    "keywords": "dated",
    "methods": "dated",
    "numbers": "dated",
    "properties": "dated",
    "quotes": "dated",
    "systemVariables": "dated",
    "hex": "dated",
    "localVariables": "none",
    "userRoutines": "modern"
  }
}
```

## New Assembling Options

The config file also introduces several new formatting options:

- **autoDoc** to automatically document/format your code on save and add any missing args/keywords and style consistently

- **style.localVariables** to match the case of any variable with the first definition of it

- **style.userRoutines** to match the case of any user-defined routine (not methods) with the definition of it. This matches a pattern we have for internal routines.

  - In addition to the new setting, we have a new global lookup that is populated with user routines after parsing code. It gets cleaned up and updated any time a file is parsed to stay up-to-date with the latest information

## Hover Help

### Images

Hover help has had some major re-work for internal routines. This was to allow for the inclusion of images within the displayed hover help.

There are several key behaviors and changes:

- All links are now normalized and start with IDL_DIR for local paths/links to other files or IDL_DOCS for images.

- When you request hover help, we use the function `ResolveLinks` to process the placeholders and translate them to the correct paths.

This has several implications for images which follows:

- For an image, we check to see if you have it locally and use an absolute file URL

- If you don't have it installed locally, we default to the image hosted on our website. This means you can see hover help for modules and other content even if you don't have it installed locally.

For links, there is a placeholder in the code which needs some additional logic in order to function properly. Here is what is disabled:

- For a link to a routine, we check if the content is installed locally. If so, open that link. **However** this open the raw HTML in VSCode, so we would need to embed something like a command in the Markdown that we use behind the scenes in the extension client to open the HTML in your default browser instead of VSCode. We probably need to do this for a good offline user experience when the content is installed.

- If the file isn't found locally, and this is the default behavior because of the above, we open the hosted docs page.

### Missing Routines Added

There was a pretty major gap in the docs captured and included: we had no ENVI Tasks as a part of the documentation. This was because the "routine names" had a space in them. We use the idl_validname routine to verify we have a valid name which filtered these out.

They are all now included and hover help works as expected.

## New Tokens

There are two new tokens "arrow" and "dot" which are used for auto-complete to detect these kinds of statements:

```idl
a = b-> ; method not specified
b. ; method not specified
```

This also is a change where a standalone "." was being classified as a number. So we have a new post-processor that checks if a number only captures "." and converts it to the "dot" with our syntax post processor.

Additionally, added a regression test for parsing Chris' new syntax for complex numbers to make sure that "2j" would be parsed as a number.

## AutoComplete

Our first version of auto complete is here! Using the new tokens we have the context we need to determine how/what routines should be sent to the user.

There is plenty of room for improvement once we have type information so that we can give the right hover help.

As is, you get everything depending on where you are.

Here is the logic:

1. Always send variables

2. Send the following based on where you are:

- Procedure methods if your local parent is a routine definition or main level program AND you have a dot or arrow before

- Function methods if your local parent is NOT a routine definition or main level program AND you have a dot or arrow before

- Procedures if your local parent is a routine definition or main level program

- Functions if your local parent is NOT a routine definition or main level program

This means you can only see functions/procedures where functions/procedures can be called from and is syntax aware.

In addition to this, there's a property I didn't know about before that lets you control how content is sorted. The general rules for sort order are:

1. Variables (and properties in the future)

2. User routines/methods

3. Internal routines/methods

Auto-complete with procedures inside logic statements

a.myclass::TEST
