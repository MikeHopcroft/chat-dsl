import {
  buildLexer,
  expectEOF,
  expectSingleResult,
  rule,
  Token,
} from 'typescript-parsec';

import {
  alt,
  apply,
  kmid,
  kright,
  list_sc,
  // lrec_sc,
  rep_sc,
  seq,
  // str,
  tok,
} from 'typescript-parsec';

enum TokenKind {
  Number,
  String,
  Boolean,
  Return,
  Identifier,
  LBracket,
  RBracket,
  LParen,
  RParen,
  Comma,
  Equals,
  Space,
  Comment,
}

const tokenNames = [
  'Number',
  'String',
  'Boolean',
  'Return',
  'Identifier',
  'LBracket',
  'RBracket',
  'LParen',
  'RParen',
  'Comma',
  'Equals',
  'Space',
  'Comment',
];

const lexer = buildLexer([
  [true, /^\d+(\.\d+)?/g, TokenKind.Number],
  [true, /^"[^"]*"/g, TokenKind.String],
  [true, /^(true|false)/g, TokenKind.Boolean],
  [true, /^return/g, TokenKind.Return],
  [true, /^[a-zA-Z_]+[a-zA-Z_0-9]*/g, TokenKind.Identifier],
  [true, /^\[/g, TokenKind.LBracket],
  [true, /^\]/g, TokenKind.RBracket],
  [true, /^\(/g, TokenKind.LParen],
  [true, /^\)/g, TokenKind.RParen],
  [true, /^,/g, TokenKind.Comma],
  [true, /^=/g, TokenKind.Equals],
  [false, /^\/\/[^\n]*/g, TokenKind.Comment],
  [false, /^\s+/g, TokenKind.Space],
]);

// VARDEC = Identifier Equals EXPR
//
// LIST = EXPR [, EXPR]*
//
// ARRAY = LBracket LIST RBracket
//
// CALL = Identifier LParen LIST RParen
//
// EXPR =
//   Number
//   String
//   Boolean
//   ARRAY
//   CALL
//   Identifier
//
// RETURN = 'return' EXPR
//
// PROGRAM = VARDEC* RETURN

// console.log(JSON.stringify(tokens, null, 2));

import {Literal} from './eval';

function applyNumber(value: Token<TokenKind.Number>): number {
  return +value.text;
}

function applyIdentifier(value: Token<TokenKind.Identifier>): string {
  return '@' + value.text;
}

function applyVarDec(
  value: [Token<TokenKind.Identifier>, Token<TokenKind.Equals>, Literal]
): string {
  return '#' + value[0].text + ' = ' + JSON.stringify(value[2]);
}

function applyString(value: Token<TokenKind.String>): string {
  return value.text.slice(1, -1);
}

function applyBoolean(value: Token<TokenKind.Boolean>): boolean {
  return value.text === 'true';
}

const EXPR = rule<TokenKind, Literal>();

EXPR.setPattern(
  alt(
    apply(tok(TokenKind.Number), applyNumber),
    apply(tok(TokenKind.String), applyString),
    apply(tok(TokenKind.Boolean), applyBoolean),
    // apply(
    //   seq(tok(TokenKind.Identifier), tok(TokenKind.Equals), EXPR),
    //   applyVarDec
    // ),
    apply(tok(TokenKind.Identifier), applyIdentifier),
    kmid(
      tok(TokenKind.LBracket),
      list_sc(EXPR, tok(TokenKind.Comma)),
      tok(TokenKind.RBracket)
    )
  )
);

const VARDEC = rule<TokenKind, Literal>();
VARDEC.setPattern(
  apply(
    seq(tok(TokenKind.Identifier), tok(TokenKind.Equals), EXPR),
    applyVarDec
  )
);

const RETURN = kright(tok(TokenKind.Return), EXPR);

const PROGRAM = rule<TokenKind, Literal>();
PROGRAM.setPattern(seq(rep_sc(VARDEC), RETURN));

///////////////////////////////////////////////////////////////////////////////
// let token = lexer.parse('a=b(1,2) // hi there \nreturn a');
// while (token !== undefined) {
//   console.log(`${tokenNames[token.kind]}: "${token.text}"`);
//   token = token.next;
// }

// const text = 'a = [1, "hi", [1,2,3], abc, true, false]';
// const a = expectSingleResult(expectEOF(EXPR.parse(lexer.parse(text))));
// console.log(a);

const text = 'a = [1, "hi", [1,2,3], abc, true, false] \n return return 54321';
// const text = 'return 1';
const a = expectSingleResult(expectEOF(PROGRAM.parse(lexer.parse(text))));
console.log(a);
