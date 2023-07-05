# Commands and Tree

This file covers some of the basics regarding adding new commands and adding buttons to the tree view in the sidebar of VSCode.

Adding commands, which are required to add entries into the sidebar tree, requires changes across the code base. We have to add translations, add the code to run the commands, update our `package.json` file, and potentially add in new icons as well.

## Commands

Commands have a few places that you need to update in order to add a new one.

1. Update our constant that has lookups for all commands. Do this here:

   `libs/shared/src/lib/commands.interface.ts`

2. Pick an appropriate section to add the command to. If you can't find one, feel free to toss it into the "client" section.

3. Update the translation interface `ICommandTranslation` which can be found in:

   `libs/translation/src/lib/translation.interface.ts`

   Add the new command and **MAKE SURE** the cases match what you added in the `commands.interface.ts` file

4. Make updates to the actual translations in `libs/translation/src/lib/languages/en.ts`

   Once you have made the base changes to the translations, either build a new local translation file with `npm run build-i18n` or live-reload on changes and build dynamically with `nx server i18n`

5. At this point, you'll want to regenerate the `package.json` file. You can use the app `package-json` to automatically update the package.json file and add translations so that you can use the commands in VSCode.

   Update it by running `nx serve package-json`, make any changes, and let it live-reload as much as you want/need.

   Once finished, you can leave it up and running to make any tweaks or you can kill the process.

   > If you see any errors like `Error: Command "idl.client.initializeConfig" is missing a translation key of "%commands.idl.client.initializeConfig%"` then that means you skipped step 4 above or you didn't make sure the keys/names/case match for the commands and translation files

6. Based on where you added the commands to the `IDL_COMMANDS` object, there should be a matching `register-SECTION-commands.ts` file where you should actually put the logic for handing your command.

At this point you should be able to use the standard NPM commands to do development with `npm run start-client` and `npm run start-server`.

> Pro tip: you might need to occasionally stop the extension process (i.e. press stop in the debugging controls) and start it again for changes to be picked up.

## Tree View

The tree view uses commands in order to execute actions. This gives the added benefit of someone being able to click on buttons or they can use the command palette to execute some IDL code.

Once you have your command implemented, minimally the translation and package.json have been updated, there are a few things for you to do:

1. In `libs/translation/src/lib/translation.interface.ts` you should add a new entry into `idl.tree.children` for the name of the command you wish to add.

   Pick the right parent in `idl.tree.children` which is "Additional Actions" or "Debugging". These entries are organized by the tab in the tree and there are some extras which are there in case we add old functionality back.

2. Add your entry to the proper parent group file within the folder `libs/vscode/tree-view/src/lib/trees`

3. As part of adding to the tree, we show an SVG icon next to the entry. You may need to fetch additional icons. Here's some links where you can find ok-to-use icons:

   - Finding new icons from google: https://fonts.google.com/icons

   - Finding new icons from a huge material library: https://pictogrammers.com/library/mdi/

   > You can get icons from other locations, but you need to make sure it is OK to use any icons that you download.

4. Each icon needs a light and dark theme version. This may require editing some of the SVG to remove fill/colors so that VSCode can apply what their themes decide the colors should be.

   All icons should be put in their respective folders in `extension/images`

   > Make sure to test that the icons look correct in light and dark mode and that they fit with other themes (i.e. make sure its not just white/back and can be shades of gray). Pro tip: for dark theme add in `fill="#c5c5c5"` and for dark theme use `fill="none"`. See the others for examples

   > Make sure that you try to save the icon with the name of the actual icon so, if someone needs to try and track it down from one of the two sites above, it is easier to do so
