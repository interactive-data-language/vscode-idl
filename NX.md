# NX

Hey there, developer! This is a quick guide for the organization of this code base and some helpful tips and tricks for working with NX.

> New to NX? Check out their website for more information about what it is and some simple tutorials: https://nx.dev/getting-started/intro

> Pro tip: If you use ubuntu on Windows, you'll need to replace `nx` with `npx nx` in order for everything to function correctly.

At a high level, NX does a few things:

- Automates migrating your code to newer versions (fully automated workflow to migrate to newer versions of NX and front-end libraries)

- Creates defined patterns for code and development so remove the choices that developers have to make (gets messy with opinions)

- Comes pre-configured with support for typescript and everything needed for live-reloading during development

- Out-of-the-box linting and formatting for _all_ code

- Easy-to-use CLI for creating new apps/libs (see below)

## Project Organization

> This NX project has an Angular app, so the NX configuration is stored primarily in `angular.json`

For NX, there are two main places that code lives:

- **apps**: The buildable projects that are used outside of development (i.e. node + express or react/angular web applications)
- **libs**: Code shared between apps and other libs.

> Pro tip: each app/lib should have a README.md file to describe what it is for and how it relates to the overall project.

## NX Cheat Sheet

- Lint code using `npm run code-prep` which tells NX to lint all projects

- Making a new lib that requires VS Code: `nx g @nx/node:lib vscode/lib-name` would make a new lib at `libs/vscode/lib-name`

- Making a new lib: `nx g @nx/node:lib lib-name` would make a new lib at `libs/lib-name`

- `nx build project` builds a project

  - Add "--watch" to re-build on changes

- `nx serve project` serves up an app for live reload (i.e. node + express server)

- Moving libs `nx g @nx/workspace:move --project my-feature-lib shared/my-feature-lib`

- Testing a specific file or files for a lib: `nx test lib --testFile my-file.spec.ts`

- Testing files matching a glob pattern for a lib: `nx test lib --testFile prefix`
