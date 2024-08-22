import {
  AccessPropertyToken,
  CallFunctionMethodToken,
  CallFunctionToken,
  CallProcedureMethodToken,
  CallProcedureToken,
  CommentBlockToken,
  CommentToken,
  KeywordBinaryToken,
  KeywordDefinitionToken,
  OperatorToken,
  QuoteDoubleToken,
  QuoteSingleToken,
  RoutineMethodNameToken,
  RoutineNameToken,
  StructureInheritanceToken,
  StructurePropertyToken,
  SystemVariableToken,
  TokenName,
  UnknownToken,
  VariableToken,
} from './tokens.interface';
import { AccessPropertyMatches } from './tokens/defs/access-property.interface';
import {
  CommentBlockMatches,
  CommentMatches,
} from './tokens/defs/comment.interface';
import {
  KeywordBinaryMatches,
  KeywordDefinitionMatches,
} from './tokens/defs/keywords.interface';
import { OperatorMatches } from './tokens/defs/operators.interface';
import { QuoteMatches } from './tokens/defs/quotes.interface';
import {
  CallFunctionMatches,
  CallFunctionMethodMatches,
  CallProcedureMatches,
  CallProcedureMethodMatches,
} from './tokens/defs/routines.call.interface';
import {
  RoutineMethodNameMatches,
  RoutineNameMatches,
} from './tokens/defs/routines.definition.interface';
import {
  StructureInheritanceMatches,
  StructurePropertyMatches,
} from './tokens/defs/structure.interface';
import { UnknownMatches } from './tokens/defs/unknown.interface';
import { VariableMatches } from './tokens/defs/variables.interface';

/**
 * Matches for start tokens
 */
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
    ? CommentMatches
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
