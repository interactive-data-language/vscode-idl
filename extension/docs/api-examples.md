---
outline: deep
---

# Runtime API Examples

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```idl
;+
; :Returns: any
;
; :Arguments:
;   event: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function Blah::ValidateTextInput, event
  compile_opt idl2, hidden
  regName = ~keyword_set(noName)
  lookup = $
    [(regName ? {prop: 'NAME', cat: 'Property:Name', str: 'Name'} : []), $
    {prop: 'COLOR', cat: 'Property:Color', str: 'Color'}]
  return, -1
end
```

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data

<pre>{{ theme }}</pre>

### Page Data

<pre>{{ page }}</pre>

### Page Frontmatter

<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data

<pre>{{ theme }}</pre>

### Page Data

<pre>{{ page }}</pre>

### Page Frontmatter

<pre>{{ frontmatter }}</pre>

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).
