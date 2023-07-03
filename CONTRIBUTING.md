# Contributing

This contains information about how to get set up for development with the tools!

For questions, issues, or concerns you can reach out to Zach Norman at zacharyanorman@gmail.com or zachary.norman@nv5.com.

> If you are a developer and new to NX, see [NX.md](./NX.md)

> If you are using ubuntu on windows, replace commands with `npx nx` instead of just `nx`.

> With the update to NX 16, there are a fex outstanding NX bugs that need to be resolved for everything to work quite as expected.
>
> Some projects may require to be developed a little differently with "nx build my-app --watch" and "node dist/apps/my-app/main.js" to execute.

## Node and NPM Versions

This repository is forward leaning with LTS and new versions of node and NPM.

At the time of writing this, you need:

- Node.js 18.12 or newer
- NPM 9.2 or newer

You should see an error when you try to install dependencies or package the extension, both of which check your node and NPM versions to make sure they are valid.

You can also view these at anytime with the "engines" tag in the package.json file.

## Quick Start: Building Pre-release Extensions

To build your own version of the extension run the following from the root of this repository:

1. `npm i -g nx vsce`

2. `npm i`

3. `npm run package`

4. Manually install the generated `idl-*.vsix` file in VS Code

## Quick Links and Helpful Information

Developer docs (tests, architecture, etc.) are located in: `extension/docs/developer`

- [Setup](#setup)
- [Development](#development)
- [Testing](#testing)
- [Package and Publish](#package-and-publish)

## Setup

> This repository uses NX to manage apps and libraries. NX is a great tool for monorepo code management and offers great functionality to make your life easier when developing.
>
> New to NX? Check out their website https://nx.dev/ or one of their tutorials https://nx.dev/angular-tutorial/01-create-application.

1. Make sure `nx` is installed globally. Use `npm i -g nx`.

2. From the main folder, run `npm i` in install all dependencies.

3. Additionally, you should install the recommended extensions for this repository which includes Prettier and ESLint to make sure code is properly formatted and consistent.

> This is a firm requirement so all code has the same style and appearance between developers.

4. Before major changes, execute `npm run code-prep` which will automatically lint, format, and alert you of any issues.

## Development

1. You can easily develop all components of the application using:

```
npm start
```

This will build, and rebuild on changes, the client, server, and parsing-worker to support the language server. When any changes are made, the bundles will be re-built automatically.

2. Press "F5" to launch the extension development environment

3. On changes, and after a few seconds, things will rebuild and you can refresh using the debug menu in VSCode.

For more advanced cases, and if you want to only have the server/client start, you can do the following:

1. Open a terminal and run `npm run start-server`

2. Open a terminal and run `npm run start-client`

On any changed, each will recompile and update oon-the-fly and this is a bit quicker to start up compared to using `npm start`.

### Changing Extension Contribution

An added complexity with the recent changes is that the contribution points for this extension are stored in code and added to the package.json file before packaging or during development.

See the source code in `apps/package-json/src/main.ts` and `apps/package-json/src/contributes` for the code that changes our contribution points.

The main reason for this is so that, using code, we can verify that our translation and auxiliary files are where we expect them to be. We can also automatically create the translation strings so we don't need to do that by hand which is a burden.

To update the package.json file, after making code changes, you can execute `npm run build-package-json`.

### Packaging Extension

In order to package the IDL extension, execute the following NPM script:

```shell
npm run package
```

### Internationalization Development

When you update the internationalization files, execute:

```shell
npm run build-i18n
```

> Note: The translations are stored in libs/translation/src/lib/languages
>
> They are based in code so that we have strict checking and types to make sure all languages have the same content

### Developing the Web View

Similar to the client and language server, here's the command to execute for development of the web view:

```shell
nx build idl-webview --watch
```

It is probably easiest to have a separate terminal running with this active in addition to the client and server.

This will take 5-10 seconds to update the dist folder after changes have been made and, if you have the server

## Testing

> For more details on testing, see the TESTING\_\* files in `extension/docs/developer` folder.

At a high level, testing happens in two places:

1. Libraries to make sure functionality works as expected

2. Integration to make sure all components come together and work as expected.

Most of our testing happens in the first step above as the second is more complicated at this point in time.

To test this application you can run `npm run test-everything` which will run all tests and take several minutes to run. To do this, you need to have ENVI and IDL installed.

If you are just updating or working with the libraries, you can use `npm run test-libs` which will just test the libraries. This does not require ENVI and IDL to be installed to run.
