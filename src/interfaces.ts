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
  skill(name: string): Skill<unknown[], unknown>;
}

export interface IEvaluationContext {
  get(name: string): Promise<unknown>;
  skill(name: string): Skill<unknown[], unknown>;
}

export interface ASTNodeBase {
  position: TokenPosition;
}

export interface ASTNode<T> extends ASTNodeBase {
  check(context: ITypeCheckingContext): t.Type<unknown>;
  eval(context: IEvaluationContext): Promise<T>;
}

// export interface Skill<P extends unknown[] | [], R> {
//   func: (...params: P) => R;
//   paramsType: t.Type<P>;
//   returnType: t.Type<R>;

//   name: string;
//   description: string;
// }

export interface Param<T> {
  name: string;
  description: string;
  type: t.Type<T>;
}

export interface ReturnValue<T> {
  description: string;
  type: t.Type<T>;
}

type ParamsFromTypes<T extends readonly unknown[] | []> = {
  -readonly [P in keyof T]: Param<T[P]>;
};

export interface Skill<P extends unknown[], R> {
  func: (...params: P) => R;
  params: ParamsFromTypes<P>;
  returns: ReturnValue<R>;

  name: string;
  description: string;
}

export interface ISkillsRepository {
  get(name: string): Skill<unknown[], unknown>;
}
