import {TokenPosition} from 'typescript-parsec';

import {TypeError} from './errors';
import {ASTNode, IEvaluationContext, ITypeCheckingContext} from '../interfaces';
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

export class ASTLiteral<T extends Literal> implements ASTNode<T> {
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
// ASTTuple
//
///////////////////////////////////////////////////////////////////////////////
export class ASTTuple<P extends unknown[]> implements ASTNode<P> {
  elements: AST<P>;
  position: TokenPosition;

  constructor(elements: AST<P>, position: TokenPosition) {
    this.elements = elements;
    this.position = position;
  }

  check(context: ITypeCheckingContext): t.Type<unknown> {
    // Check for cycles
    context.push(this);
    const types = this.elements.map(p => p.check(context)) as t.TypeWrap<P>; // as t.Type<unknown>[]; //t.TypeWrap<P>;
    const type = t.Tuple(...types);
    context.pop();

    return type as t.Type<unknown>;
  }

  async eval(context: IEvaluationContext): Promise<P> {
    // These links explain why we have to type assert to Promisify<P> after map.
    // https://stackoverflow.com/questions/57913193/how-to-use-array-map-with-tuples-in-typescript
    // https://stackoverflow.com/questions/65335982/how-to-map-a-typescript-tuple-into-a-new-tuple-using-array-map
    const promises = this.elements.map(p => p.eval(context)) as Promisify<P>;
    return await Promise.all(promises);
  }
}

///////////////////////////////////////////////////////////////////////////////
//
// ASTFunction
//
///////////////////////////////////////////////////////////////////////////////
export class ASTFunction<P extends unknown[]> implements ASTNode<unknown> {
  name: string;
  params: AST<P>;
  position: TokenPosition;

  constructor(name: string, params: AST<P>, position: TokenPosition) {
    this.name = name;
    this.params = params;
    this.position = position;
  }

  check(context: ITypeCheckingContext): t.Type<unknown> {
    // Verify parameters, check for cycles
    context.push(this);
    const types = t.Tuple(...this.params.map(p => p.check(context)));
    const skill = context.skill(this.name);
    if (!t.check(t.Tuple(...skill.params.map(x => x.type)), types)) {
      throw new TypeError();
    }
    context.pop();

    // Then return type.
    return skill.returns.type;
  }

  async eval(context: IEvaluationContext) {
    const skill = context.skill(this.name);

    // These links explain why we have to type assert to Promisify<P> after map.
    // https://stackoverflow.com/questions/57913193/how-to-use-array-map-with-tuples-in-typescript
    // https://stackoverflow.com/questions/65335982/how-to-map-a-typescript-tuple-into-a-new-tuple-using-array-map
    const promises = this.params.map(p => p.eval(context)) as Promisify<P>;
    const awaitedParams = await Promise.all(promises);
    return await skill.func(...awaitedParams);
  }
}

///////////////////////////////////////////////////////////////////////////////
//
// ASTReference
//
///////////////////////////////////////////////////////////////////////////////
export class ASTReference<T> implements ASTNode<unknown> {
  name: string;
  position: TokenPosition;

  constructor(name: string, position: TokenPosition) {
    this.name = name;
    this.position = position;
  }

  check(context: ITypeCheckingContext): t.Type<T> {
    context.push(this);
    const node = context.lookup(this.name);
    context.enterScope(this.name);
    const type = node.check(context);
    context.exitScope(this.name);
    context.pop();
    return type as t.Type<T>;
  }

  async eval(context: IEvaluationContext) {
    return context.get(this.name) as Promise<T>;
  }
}
