# Notebook Renderers

This is where we package up the base web components built with angular for use in notebooks.

Each web component is a separate project so that we can load one component at a time to be streamlined.

In the future, if there is overlapping functionality between components, they we might combine together

## Namespaces

Because we may use multiple web components at the same time, make sure to make element IDs unique and, more importantly, CSS classes (or named sub-classes) should also be unique.

## Usage

1. Build a non-test app in here such as `nx build notebook-renderers-image --prod`

2. Combine the scripts from dist into a single script file:

- main.js

- polyfills.js

- runtime.js

3. Embed script in target HTML

4. Embed styles from `styles.css` into target HTML as well
