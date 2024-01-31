# Tokenizer vs Syntax Highlighting

You might be thinking, why do we have two flavors of code that do the same thing? For now, we have two solutions for similar problems. This could change in the future, but there are no plans for it right now. This is meant to document WHY this decision has been made to keep them separate.

Here are some initial thoughts on why there are two separate code paths that break down IDL code into it's simplest form:

1. TextMate grammar tokens are extremely bare-bones. By default this is what they extract:

```json
{
  "startIndex": 0,
  "endIndex": 2,
  "scopes": ["source.idl", "some-other-token.idl"]
}
```

Which is all that you need in order to apply highlighting, but does not provide the rich information that the tokenizer extracts.

2. Adds complexity needing to map the scope types to token types which is not a simple map. This is because we share scopes in the TextMate YAML file (i.e. all control statements have the same scope name), we would need to have an additional scope/variable name for each type of token that we extract. This would also mean we need to have some sort of map/connection between the YAML file and TypeScript to verify/synchronize the two sources to always match.

3. Similar to above, we would need to map TextMate to current Tokenizer which also does not make it easy to get the beginning/end of different tokens. For example, here is the mapped TextMate tokenizer format for anything with a beginning and end which has no simple connection between the start and end of the quote without additional processing of the scopes:

```typescript
  {
    line: 0,
    match: "'",
    startIndex: 0,
    endIndex: 1,
    scopes: ['source.idl', 'string.quoted.single.idl'],
  },
  {
    line: 0,
    match: 'myFunc(1 + 2)',
    startIndex: 1,
    endIndex: 14,
    scopes: ['source.idl', 'string.quoted.single.idl'],
  },
  {
    line: 0,
    match: "'",
    startIndex: 14,
    endIndex: 15,
    scopes: ['source.idl', 'string.quoted.single.idl'],
  }
```

4. The TextMate grammar does not need to parse everything from the file (although it does by default apply the "source.idl" scope) whereas the tokenizer does parse every piece of text.
