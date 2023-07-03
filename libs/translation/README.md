# translation

This library contains everything related to translation for our extension. Uses code for our translations and strictly-typed interfaces so we know that all translations will work.

## Adding a New Translation

1. Update `libs/translation/src/translation.interface.ts` with your changes

2. Make sure every translation file in `libs/translation/src/lib/languages` has been updated

3. Re-build the translation files using `npm run build-i18n` which will make sure everything is correct

## Adding a Language

1. Copy and paste a file from `libs/translation/src/lib/languages` and rename it to match your language. See other languages to follow the same pattern

2. Add the language to the `LANGUAGES` constant in `libs/translation/src/languages.ts`

3. Re-build the translation files using `npm run build-i18n`

## Running unit tests

Run `nx test translation` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint translation` to execute the lint via [ESLint](https://eslint.org/).
