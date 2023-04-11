import {
  alt,
  apply,
  buildLexer,
  expectEOF,
  expectSingleResult,
  kmid,
  kright,
  list_sc,
  opt,
  rep_sc,
  rule,
  seq,
  tok,
  Token,
} from 'typescript-parsec';

import {
  ASTFunction,
  ASTLiteral,
  ASTReference,
  ASTTuple,
  booleanLiteral,
  numberLiteral,
  stringLiteral,
} from './ast';

import {ASTNode} from './interfaces';

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

// const tokenNames = [
//   'Number',
//   'String',
//   'Boolean',
//   'Return',
//   'Identifier',
//   'LBracket',
//   'RBracket',
//   'LParen',
//   'RParen',
//   'Comma',
//   'Equals',
//   'Space',
//   'Comment',
// ];

const lexer = buildLexer([
  [true, /^-?\d+(\.\d+)?/g, TokenKind.Number],
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

import {SymbolTable} from './symbol-table';

function applyNumber(value: Token<TokenKind.Number>): ASTLiteral<number> {
  return numberLiteral(Number(value.text), value.pos);
}

function applyIdentifier(
  value: Token<TokenKind.Identifier>
): ASTReference<string> {
  return new ASTReference(value.text, value.pos);
}

interface VarDec {
  symbol: string;
  node: ASTNode<unknown>;
}

function applyVarDec(
  value: [
    Token<TokenKind.Identifier>,
    Token<TokenKind.Equals>,
    ASTNode<unknown>
  ]
): VarDec {
  return {symbol: value[0].text, node: value[2]};
}

function applyString(value: Token<TokenKind.String>): ASTLiteral<string> {
  return stringLiteral(value.text.slice(1, -1), value.pos);
}

function applyBoolean(value: Token<TokenKind.Boolean>): ASTLiteral<boolean> {
  return booleanLiteral(value.text === 'true', value.pos);
}

type TokenRange = [Token<TokenKind> | undefined, Token<TokenKind> | undefined];

function applyTuple(
  value: ASTNode<unknown>[] | undefined,
  tokenRange: TokenRange
): ASTTuple<unknown[]> {
  // TODO: sort out position
  // TODO: tokenRange can be undefined
  return new ASTTuple(value ?? [], tokenRange[0]!.pos);
}

function applyFunction(
  [symbol, params]: [
    Token<TokenKind.Identifier>,
    ASTNode<unknown>[] | undefined
  ],
  tokenRange: TokenRange
): ASTFunction<unknown[]> {
  return new ASTFunction(symbol.text, params || [], tokenRange[0]!.pos);
}

const EXPR = rule<TokenKind, ASTNode<unknown>>();

EXPR.setPattern(
  alt(
    apply(tok(TokenKind.Number), applyNumber),
    apply(tok(TokenKind.String), applyString),
    apply(tok(TokenKind.Boolean), applyBoolean),
    apply(
      seq(
        tok(TokenKind.Identifier),
        kmid(
          tok(TokenKind.LParen),
          opt(list_sc(EXPR, tok(TokenKind.Comma))),
          tok(TokenKind.RParen)
        )
      ),
      applyFunction
    ),
    apply(tok(TokenKind.Identifier), applyIdentifier),
    apply(
      kmid(
        tok(TokenKind.LBracket),
        opt(list_sc(EXPR, tok(TokenKind.Comma))),
        tok(TokenKind.RBracket)
      ),
      applyTuple
    )
  )
);

const LITERAL_EXPR = rule<TokenKind, ASTNode<unknown>>();

LITERAL_EXPR.setPattern(
  alt(
    apply(tok(TokenKind.Number), applyNumber),
    apply(tok(TokenKind.String), applyString),
    apply(tok(TokenKind.Boolean), applyBoolean),
    apply(
      kmid(
        tok(TokenKind.LBracket),
        opt(list_sc(LITERAL_EXPR, tok(TokenKind.Comma))),
        tok(TokenKind.RBracket)
      ),
      applyTuple
    )
  )
);

const VARDEC = rule<TokenKind, VarDec>();
VARDEC.setPattern(
  apply(
    seq(tok(TokenKind.Identifier), tok(TokenKind.Equals), EXPR),
    applyVarDec
  )
);

const RETURN = kright(tok(TokenKind.Return), EXPR);

const PROGRAM = rule<TokenKind, Program>();
PROGRAM.setPattern(apply(seq(rep_sc(VARDEC), RETURN), applyProgram));

export interface Program {
  symbols: SymbolTable;
  expression: ASTNode<unknown>;
}

function applyProgram([vardecs, expression]: [
  VarDec[],
  ASTNode<unknown>
]): Program {
  const symbols = new SymbolTable(vardecs.map(x => [x.symbol, x.node]));
  return {symbols, expression};
}

export function parse(text: string): Program {
  return expectSingleResult(expectEOF(PROGRAM.parse(lexer.parse(text))));
}

export function parseLiteral(text: string): ASTNode<unknown> {
  return expectSingleResult(expectEOF(LITERAL_EXPR.parse(lexer.parse(text))));
}

///////////////////////////////////////////////////////////////////////////////
// let token = lexer.parse('a=b(1,2) // hi there \nreturn a');
// while (token !== undefined) {
//   console.log(`${tokenNames[token.kind]}: "${token.text}"`);
//   token = token.next;
// }

// const text = 'a = [1, "hi", [1,2,3], abc, true, false]';
// const a = expectSingleResult(expectEOF(EXPR.parse(lexer.parse(text))));
// console.log(a);

// const text = 'a = [1, "hi", [1,2,3], abc, true, false] \n return 54321';
// // const text = 'return 1';
// const a = expectSingleResult(expectEOF(PROGRAM.parse(lexer.parse(text))));
// console.log(a);
