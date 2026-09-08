# Customizing Themes

In case you are interested in tweaking the theme and style for IDL syntax, here are the token names associated with IDL's TextMate grammar file.

Using the name of tokens, you can update VSCode's preferences to manually change the appearance/style of the tokens.

In your JSON settings file, this would look something like:

```json
"editor.tokenColorCustomizations": {
  "textMateRules": [{
    "scope": "keyword.operator.idl",
    "settings": {
      "foreground": "#FF0000",
      "fontStyle": "bold"
    }
  }]
}
```

Below is a list which shows, on the right hand side, the token names used for IDL.

You can also find this information directly within the editor by using the "Developer: Inspect Editor Tokens and Scopes" command. (Quick access using Ctrl + Shift + P on Windows to open the command palette).

> If this is not 100% up-to-date, then let us know.

```yaml
# token names on the right
name_arg_def: variable.parameter.idl
name_brace: meta.brace.idl
name_bracket: meta.brace.square.idl
name_call_func: entity.name.function.idl
name_call_func_method: entity.name.function.idl-method.idl
name_call_pro: support.function.idl-procedure
name_call_pro_method: support.function.idl-procedure-method
name_comma: keyword.operator.idl
name_comment: comment.line.idl
name_comment_block: comment.block.idl
name_control: keyword.control.idl
name_control_option: variable.other.readwrite.ts.idl
name_docs_header: markup.heading.idl
name_docs_arg_kw: markup.italic.idl
name_escape: constant.character.escape.idl
name_nothing: meta.var.expr.idl
name_kw_def_super: parameter.definition.keyword.idl # wrapper around keyword definitions
name_kw_def: entity.other.attribute-name.idl # external keyword name external = internal
name_kw_usage: parameter.usage.keyword.idl # using a keyword in a procedure or function
name_kw_binary: entity.other.attribute-name.idl # /kw_name
name_kw_assignment: entity.other.attribute-name.idl # kw_name = value
name_number: constant.numeric.idl
name_operator: keyword.operator.idl
name_paren: meta.brace.round.idl
name_property: entity.other.attribute-name.idl
name_python: meta.embedded.block.python
name_quote_double: string.quoted.double.idl
name_quote_single: string.quoted.single.idl
name_template: string.template.idl # string literal
name_template_expression: meta.embedded.idl # expression in string literal
name_routine_function: entity.name.function.idl
name_routine_function_method: entity.name.function.idl-method
name_routine_procedure: support.function.idl-procedure
name_routine_procedure_method: support.function.idl-procedure-method
name_struct_inherits: entity.other.inherited-class.idl
name_struct_name: storage.type.idl
name_struct_tag: entity.name.tag.idl
name_special: entity.name.type.idl # special characters, like "self" or goto or "@include"
name_sysvar: constant.language.idl
name_type: entity.name.type.ts
name_variable: variable.other.readwrite.ts.idl # TS before gives us their formatting
```
