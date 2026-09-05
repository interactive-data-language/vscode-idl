# package-json

This app handles the creation, and validation, of the extension's contribution points which are added in the primary `package.json` files and makes sure we have docs files for all of our problem codes.

If you need to add an extension point, you should be updating the code in the this app.

The contribution points are located in `src/contributes` and, to find more information on contribution points you can check out [https://code.visualstudio.com/api/extension-guides/overview](https://code.visualstudio.com/api/extension-guides/overview) for more details.

## Updating package.json

Once you have made changes, you can run `npm run make-package-json` which will:

- Regenerate our internationalization files which we test match the things we contribute.
- Verifies our contribution points and updates our primary `package.json` file

> Once finished, make sure to commit your changes to the package.json which are needed for anyone else to take advantage of new functionality.
