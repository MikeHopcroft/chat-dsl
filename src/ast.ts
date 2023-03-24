import {TokenPosition} from 'typescript-parsec';

import {ASTNode, IEvaluationContext, ITypeCheckingContext} from './interfaces';
import * as t from './types';

type Promisify<T extends readonly unknown[] | []> = {
  -readonly [P in keyof T]: Promise<T[P]>;
};

type AST<T extends readonly unknown[] | []> = {
  -readonly [P in keyof T]: ASTNode<T[P]>;
};

///////////////////////////////////////////////////////////////////////////////
//
// ASTLiteral
//
///////////////////////////////////////////////////////////////////////////////
export type Literal = string | number | boolean | Array<Literal>;

class ASTLiteral<T extends Literal> implements ASTNode<T> {
  position: TokenPosition;
  value: T;
  type: t.Type<T>;

  constructor(value: T, type: t.Type<T>, position: TokenPosition) {
    this.value = value;
    this.type = type;
    this.position = position;
  }

  check() {
    return this.type;
  }

  eval() {
    return Promise.resolve(this.value);
  }
}

export function booleanLiteral(value: boolean, position: TokenPosition) {
  return new ASTLiteral(value, t.Boolean, position);
}

export function numberLiteral(value: number, position: TokenPosition) {
  return new ASTLiteral(value, t.Number, position);
}

export function stringLiteral(value: string, position: TokenPosition) {
  return new ASTLiteral(value, t.String, position);
}

///////////////////////////////////////////////////////////////////////////////
//
// ASTFunction
//
///////////////////////////////////////////////////////////////////////////////
export interface FunctionDeclaration<P extends unknown[], R> {
  func: (...params: P) => R;
  paramsType: t.Type<P>;
  returnType: t.Type<R>;
}

export class ASTFunction<P extends unknown[], R> implements ASTNode<R> {
  func: FunctionDeclaration<P, R>;
  params: AST<P>;
  position: TokenPosition;

  constructor(
    func: FunctionDeclaration<P, R>,
    params: AST<P>,
    position: TokenPosition
  ) {
    this.func = func;
    this.params = params;
    this.position = position;
  }

  check(context: ITypeCheckingContext): t.Type<R> {
    // Verify parameters, check for cycles
    context.push(this);
    const types = t.Tuple(...this.params.map(p => p.check(context)));
    if (!t.check(this.func.paramsType, types)) {
      throw new Error('Type checking error.');
    }
    context.pop();

    // Then return type.
    return this.func.returnType;
  }

  async eval(context: IEvaluationContext) {
    // These links explain why we have to type assert to Promisify<P> after map.
    // https://stackoverflow.com/questions/57913193/how-to-use-array-map-with-tuples-in-typescript
    // https://stackoverflow.com/questions/65335982/how-to-map-a-typescript-tuple-into-a-new-tuple-using-array-map
    const promises = this.params.map(p => p.eval(context)) as Promisify<P>;
    const awaitedParams = await Promise.all(promises);
    return await this.func.func(...awaitedParams);
  }
}

///////////////////////////////////////////////////////////////////////////////
//
// ASTReference
//
///////////////////////////////////////////////////////////////////////////////
export class ASTReference implements ASTNode<unknown> {
  name: string;
  position: TokenPosition;

  constructor(name: string, position: TokenPosition) {
    this.name = name;
    this.position = position;
  }

  check(context: ITypeCheckingContext): t.Type<unknown> {
    context.push(this);
    context.enterScope(this.name);
    const node = context.lookup(this.name);
    const type = node.check(context);
    context.exitScope(this.name);
    context.pop();
    return type;
  }

  async eval(context: IEvaluationContext) {
    return context.get(this.name);
  }
}
