# Test tokenizer

App has two purposes:

1. Live development of the tokenizer to easily change/view token results on-the-fly. Do this with:

```
nx serve test-tokenizer
```

2. Generates a large number of tests for the tokenizer using automation. This provides several benefits: easily change and re-architect tokenizing so you don't spend hours re-writing tests and lets you easily track with a git client how changes impact the tests. Do this with:

```
npm run make-tokenizer-tests
```

> It is expected that you will manually review any test changes to ensure their correctness and completeness. Much easier than writing them by hand, but a human-in-the-loop is required.
