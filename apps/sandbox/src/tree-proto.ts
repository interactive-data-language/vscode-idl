import * as proto from 'protobufjs';

/**
 * Protobuffer syntax for our content
 */
export const TREE_PROTO = `
package syntaxtree;
syntax = "proto3";

message SyntaxTree {

    message BasicSyntaxTreeNode {
        string type = 1;
        uint32 name = 2;
        uint32 idx = 3;
        repeated string match = 4;
        repeated uint32 pos = 5;
        repeated uint32 parseProblems = 6;
        repeated uint32 scope = 7;
    }

    repeated BasicSyntaxTreeNode items = 1;
}`;

/**
 * Parse the schema
 */
const ROOT = proto.parse(TREE_PROTO).root;

export const SYNTAX_TREE = ROOT.lookupType('syntaxtree.SyntaxTree');
