# Hover Help

This guide covers how to generate updated hover help content for ENVI, IDL and the modules.

This is one of the few portions of the extension, apart from debugging, that required you to have IDL installed.

## Important Notes

The online URL for the documentation can be found within `libs/shared/src/lib/website-url.interface.ts`.

Important to know since we will be changing our URL here shortly.

## Prerequisites

> CRITICAL!!!! The formatting for hover-help uses the files that get generated by our docs parsing to function correctly. This means that you will potentially need to run this twice if you are starting from scratch.
>
> This needs to be manual for now as it requires you to have our core software installed locally.

1. Install the latest ENVI and IDL

2. Install the latest ENVI Deep Learning

3. If there are any new modules that include routines and their docs that are not a part of the above, also install them

4. From IDL, compile and run `idl/helpers/catalog_to_json.pro` to update a JSON file containing the internal routines from "\_catalog.xml" files

5. Run `nx serve idl-docs-parser` to process the JSON file from step 4. This will:

- Find the actual docs HTML files in the ENVI and IDL installation for every routine

- Parse the HTML files (they have strict formatting and styling that makes this easy)

- Convert parsed content to the `GlobalToken` format

- Saves as JSON to disk

- At runtime, this JSON file is parsed and added to the global lookup to support hover help and, eventually, autocomplete
