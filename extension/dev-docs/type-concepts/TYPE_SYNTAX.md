# Type Syntax

## Conditional Types

Typescript does some great, but horrendous syntax for return types where you need to use the ternary/elvis operator for as many types as you have and can end up looking really nasty.

Take an example from the extension to have the best user experience possible:

```typescript
export type TokenStartMatches<T extends TokenName> =
  T extends AccessPropertyToken
    ? AccessPropertyMatches
    : T extends CallFunctionToken
    ? CallFunctionMatches
    : T extends CallFunctionMethodToken
    ? CallFunctionMethodMatches
    : T extends CallProcedureToken
    ? CallProcedureMatches
    : T extends CallProcedureMethodToken
    ? CallProcedureMethodMatches
    : T extends CommentToken
    ? CommentMatches | CommentWithToDoMatches
    : T extends CommentBlockToken
    ? CommentBlockMatches
    : T extends KeywordBinaryToken
    ? KeywordBinaryMatches
    : T extends KeywordDefinitionToken
    ? KeywordDefinitionMatches
    : T extends OperatorToken
    ? OperatorMatches
    : T extends QuoteDoubleToken
    ? QuoteMatches
    : T extends QuoteSingleToken
    ? QuoteMatches
    : T extends RoutineMethodNameToken
    ? RoutineMethodNameMatches
    : T extends RoutineNameToken
    ? RoutineNameMatches
    : T extends StructureInheritanceToken
    ? StructureInheritanceMatches
    : T extends StructurePropertyToken
    ? StructurePropertyMatches
    : T extends SystemVariableToken
    ? VariableMatches
    : T extends VariableToken
    ? VariableMatches
    : T extends UnknownToken
    ? UnknownMatches
    : string[];
```

Now, IDL has a few key differences with languages:

1. Arguments can be input or output and can be defined at "use" time
2. We have optional keywords which can also be input or output and can be defined at "use" time
3. IDL has specific number types, and not just one "number"
4. Our optional keywords tend to change the return type of our routines (i.e. we have keywords to specify the data type that gets returned).
5. Arrays and scalars can be used in the same way (i.e. "5 + 5" or "5 + bytarr(42)")

With that in mind, we need to be able to specify the return types for functions with type code that we interpret at developer time.

Specifically, we need to:

1. Be able to use the types of arguments as the return type
2. Be able to detect "set" keywords that alter the return type
3. Have traditional typescript types that are conditional and can be written in a much easier way to read and write

Proposal:

```typescript

// most basic using docs
type ReturnType<routine> = TypeFromComments // i.e. what we parse

// using the type of arguments or keywords
type ReturnType<routine> = TypeOfArg<argname> || TypeOfKeyword<keywordname>

// type condition that could be used anywhere
type ConditionalType<anywhere> = TypeCondition<TruthyTypeExpression, TypeIfTrue, TypeIfFalse>

// this would be used like
type ReturnType<routine> = TypeCondition<
    IsType<TypeOfArg<arg1>, Array>, // truthy statement
    Array<Number>,
    Number
  >
type ReturnType<routine> = TypeCondition<
    KeywordSet<my_keyword>,
    Array<Double>,
    Array<Float>
  >

// heres an example of a type that may return an array if a scalar is specified
type ReturnType<routine> = TypeCondition<
    IsNotType<TypeOfArg<argname>, Array>,
    Array<TypeOfArg<argname>>,
    Null
  >

// typescript comparison
export type TokenStartMatches<T extends TokenName> = T extends AccessPropertyToken ? string : number

// case type where we have many scenarios to handle
type ReturnType<routine> = Case<
    Of<TruthyTypeExpression, TypeIfTrue>,
    Of<TruthyTypeExpression, TypeIfTrue>,
    Of<TruthyTypeExpression, TypeIfTrue>,
    DefaultType
  >

// and an example for the make_array function might be:
type ReturnType<routine> = TypeSwitch<
    TypeCase<KeywordSet<double>, Array<Double>>,
    TypeCase<KeywordSet<float>, Array<Double>>,
    TypeCase<KeywordSet<boolean>, Array<Boolean>>,
    Array<any>
  >

```
