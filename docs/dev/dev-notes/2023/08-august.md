# August

This is the first month where we will slowly start to introduce our big, new feature: notebooks!

Because we are officially released, not everything will be captured here and the official CHANGELOG will some other line items.

## Hover Help for Routines

There's a new hover-help option that generates a notebook file from routine docs!

## New Notebook File Format

Use plain JSON as the file format for notebooks. Before we had base64 encoded strings for everything (because we were getting Uin8Arrays from VSCode). After seeing the ipynb file format, we decided to tweak it so that we more nicely match them.

Some key changes (which also fixes some git problems):

- Everything in notebooks is really string content (even images are HTML for encoded strings)

- We JSON pretty print with 2 spaces for indent, this make git GUI tools much happier when looking at diffs in files

- We split all strings with `\r?\n` and store without line endings, which normalizes notebook cells and prevents fake git changes after cell execution when we run our tests

- Reduced file size! With less encoding, our test notebook went to 1350 kb from 1800 kb. That means it should save and parse more quickly as well.

As part of this work, we added some complexity for the loading and serializing of our notebook format so that everything is broken out by file version.

There are now two helper routines that load and save to disk based on the content that VSCode sends us:

- `libs/vscode/notebooks/src/lib/serializer/from/from-idl-raw-notebook.ts`

- `libs/vscode/notebooks/src/lib/serializer/from/to-idl-raw-notebook.ts`

Within these routines are typed-by-the-version tag which automatically handles loading and saving. Yes, we do support the API for saving to different versions so that we have a historical record of how we created older formats in the past

## Notebook Format Tests

We added some basic tests to parse 1.0.0 and 2.0.0 notebooks from disk and verify the notebooks contain the data that we expect them to.

This also changed a few types so most tests have been changed.

We also saved existing test notebooks to disk to get them to the latest version of the format (helps with git tracking and human readable)

## ENVI Notebook Methods

Far from set in stone (but no issues mentioned from the ENVI team), are some methods we have created and packaged as part of the extension in the `idl/vscode/notebooks` folder.

These create PNGs and add basic information to the "!envi_magic" system variable for us to grab. As a note, the ENVI PNG generation is lightning fast and even stretches data.

## Notebook Renderers

So far, the basic outputs of cells are tracked as Zach-crafted HTML as part of notebook execution. We have some helper routines which smartly create the HTML based on the outputs from IDL or ENVI.

This won't scale if we want to create more customized user experiences regarding notebooks. So, we need to have a way to contribute our own components.

We have a too-complex app using Angular at `apps/notebooks` and components for rendering located in `libs/notebooks/renderers`

The current set-up creates web components so that you can use a friendly developer framework to create views for data and then package as single JS files that can be imported/embedded in HTML to get access to the web components.

Some more design thought will need to be had here so we can potentially pluck just the component that we want/need and leave everything else behind to keep cells lightweight and optimized.

TBD though on this as it will take a fair amount of effort and require a lot of customization for notebook rendering.

We might need to explore and see if there's some logic that we can re-use.

## Token Cache Fix

We had a problem where, if you updated IDL's path after you launched the extension, we would not properly report all problems after you open.

We added a new method for our token cache to update problems in our cache. This is automatically called at the end of the `PostProcessParsed()` function.

## Potential Memory Fixes

We have one user who has unusually high memory usage. To try and combat this, we re-worked the logic for cleaning up our mein process and worker threads. We now have a method on our `IDLIndex` class to clean up if we have garbage collection enabled.

If it is, we clean the main thread and send messages to the worker threads for them to clean as well.

Once all are done, we get the RSS memory and report that to the logs.

This happens once every 5 minutes (which could be increased depending on how rapidly users are programming).

If you watch the logs, you should see very low memory usage now for most users (< 100k lines of code is < 500 mb of RAM).

We also remove all files from our token cache in the main thread _after_ we get what we need from them.

## Normalize Server Events

We normalized the server events to all wait for the initialization and first parse to finish before doing anything. We had 3-4 that didn't honor this.

## Notebook Printing Thoughts

Random note here: If we wanted to print a notebook we could:

1. Convert to markdown

2. Convert to PDF using Pandoc

Additionally, and this might be easier:

1. Convert notebook to markdown

2. Convert markdown to HTML

3. Instruct users to open HTML and print from browser (or maybe we can hack that from VSCode?)
