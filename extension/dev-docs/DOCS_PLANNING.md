# Docs Planning

How to embed docs into the extension and, using the same pattern, create docs from code.

## Thoughts

1. Discover relevant files

- Configurable, by extension
- Starting point: pro, tif, tiff, png, svg, mp4, etc

2. Convert PRO files to Markdown

- Filter private routines
- Filter private parameters

## Build System 1

3. Build simple web application with themes to render all Markdown

- Use marked.js because we have it already
- Re-purpose existing code used for docs in courses

4. Syntax highlighting with shiki.js which allows the use of tmLanguage files so we can hae exact formatting

- https://shiki-play.matsu.io/play
- Think through languages

5. Plugins for Marked.js to consider

- Latex support: https://www.npmjs.com/package/marked-extended-latex
- Emojis (for fun): https://www.npmjs.com/package/marked-emoji
- Footnotes: https://www.npmjs.com/package/marked-footnote
- Expanded tables: https://www.npmjs.com/package/marked-extended-tables

## Build System 2

https://vitepress.dev/

Use an existing tool that makes great looking websites without going crazy

Examples:

- https://vitepress.dev/

- https://shiki.matsu.io/guide/bundles

  Source: https://github.com/shikijs/shiki/tree/main/docs/.vitepress
