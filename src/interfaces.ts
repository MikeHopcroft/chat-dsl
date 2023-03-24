import {TokenPosition} from 'typescript-parsec';

import * as t from './types';

export interface ISymbolTable {
  add<T>(name: string, value: ASTNode<T>): void;
  get(name: string): ASTNode<unknown>;
}

export interface ITypeCheckingContext {
  lookup(symbol: string): ASTNode<unknown>;
  push(node: ASTNodeBase): void;
  pop(): void;
  enterScope(symbol: string): void;
  exitScope(symbol: string): void;
}

export interface IEvaluationContext {
  get(name: string): Promise<unknown>;
}

export interface ASTNodeBase {
  position: TokenPosition;
}

export interface ASTNode<T> extends ASTNodeBase {
  check(context: ITypeCheckingContext): t.Type<unknown>;
  eval(context: IEvaluationContext): Promise<T>;
}
