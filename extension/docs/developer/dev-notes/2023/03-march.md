# Changes

## Dramatically Improved Parsing Performance

Made a tiny change to the code which, because of past reasons, was copying a data structure every time we tried to find a token (thousands of times for larger files).

Removing this, our parsing speed is now 3x faster than TextMate parsing which was about 15-20% faster.

Here are the times for TextMate using the tmLanguage file for IDL:

```
Reading files [=========================] 0.0s 1546/1546 zoom.pro
Extracting tokens via TextMate [=========================] 0.0s 1546/1546 zoom.pro
  Processing time (ms): 24754.845458984375
  Processing rate (lines/s): 18113.26193665506
```

And here are the times for the Tokenizer:

```
idl-lsp info Creating parser worker thread pool with 0 workers
Reading files [=========================] 0.0s 1546/1546 zoom.pro
Extracting tokens via Tokenizer [=========================] 0.0s 1546/1546 zoom.pro
  Processing time (ms): 7691.045946121216
  Processing rate (lines/s): 58300.392838783475
```

Lastly, we can get the updated performance from a single-threaded parse using the IDLIndex which parses, validates, tracks global tokens, and more.

```
idl-lsp info Creating parser worker thread pool with 0 workers
Reading files [=========================] 0.0s 1546/1546 zoom.pro
Extracting tokens via Index [=========================] 0.0s 1546/1546 zoom.pro
  Processing time (ms): 20681.750759124756
  Processing rate (lines/s): 21680.514634486182
```

Even with all of our additional processing, at least on Mac, we are faster than using the TextMate files!!

### High-end Windows Parsing Performance

Same parsing metrics from above, including problem checking and validation.

```
Reading files [=========================] 0.0s 1547/1547 zoom.pro
Extracting tokens via TextMate [=========================] 0.0s 1547/1547 zoom.pro
  Processing time (ms): 12260.356999993324
  Processing rate (lines/s): 36608.47722462277

idl-lsp info Creating parser worker thread pool with 0 workers
Reading files [=========================] 0.0s 1547/1547 zoom.pro
Extracting tokens via Tokenizer [=========================] 0.0s 1547/1547 zoom.pro
  Processing time (ms): 3605.2789999246597
  Processing rate (lines/s): 124493.27777666565

idl-lsp info Creating parser worker thread pool with 0 workers
Reading files [=========================] 0.0s 1547/1547 zoom.pro
Extracting tokens via Index [=========================] 0.0s 1547/1547 zoom.pro
  Processing time (ms): 9416.462200045586
  Processing rate (lines/s): 47664.71637276122
```

## Statements Directly After Function Calls

Added a checker to cath errors like:

```idl
a = func().property
```

Works for functions and function methods and validates anything that might access a value afterwards (except brackets for array indexing).

## Renamed all Preferences

Good and bad thing. VSCode organizes them by hierarchy, but it needed a complete refactor of the entire preference types and API, so it was a pretty big change.

The most annoying part was VSCode automatically expanded paths from "main.sub.val" into a nested object.

We now have a separate lib with the extension config and it has hand-made full-path access keys so that, from VSCode, we can set the preferences for specific items.

## Update Package Build

The package-json app manages creating the package.json file and strictly validating the presence and value of translation elements. It was updated with the new configuration structure and now has strict checks for all translation keys for configuration. It missed a few before.

When processing the configuration, we also now update the schema definitions with the english translation for different properties so that you only have to change them in one place.

One outstanding item is that, every time you build the package.json file, you will have changes in your schema files for config.

## Types Re-work

Types have been completely re-done. All types now are expresses as arrays internally and we have support for the pipe (i.e. or) operator when parsing types.

Here's an example of the syntax, that matches VSCode, that we now support:

```idl
type Union1 = Number | String
type Union2 = ENVIGLTRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIRPCRasterSpatialRe | ENVIStandardRasterSpatialRef
```

We needed to do this so that we could properly capture types that get returned from IDL or ENVI routines. The second example above is straight out of the docs for ENVIRaster and there are other places that this is used as well.

One key change is that, if you want the display name of a type, you need to use `SerializeIDLType` to do so.

## AutoComplete In Structures

When you use auto-complete within explicitly defined structures, you now have properties appear.

## Preference re-work

Update names to be a nested structure which you can easily access with the dot notation. This also includes the addition of our code formatting and code style as additional properties within VSCode.

> IMPORTANT NOTE: While our settings are nested and organized, if you are within the VSCode Client portion of the extension, you need a full-path key to get/set values. ONLY use the constant with the keys hard-coded so that we can more easily change/update this as we go.

## Go To Definition

Go-to definition works for just about everything! Added tests, handles structure inheritance, and is implemented for:

- All routines (including methods as long as we have type information)
- Keywords
- Properties in structures
- Properties being accessed outside of structures
- Structure names

## Functions

We use the init method for hover help now when you hover over the name of a class (i.e. as a function call).

We also add a duplicate token for init methods as a function call so that we have auto complete fitting the style that most programmers would use.
