import * as _ from 'lodash';

export enum Types {
  Boolean,
  Function,
  Number,
  String,
  Tuple,
}

const typeNames = ['boolean', 'function', 'number', 'string', 'tuple'];

export interface Type<T> {
  tag: Types;
  _type: T;
}

export const Boolean = {
  tag: Types.Boolean,
} as Type<boolean>;

export const Number = {
  tag: Types.Number,
} as Type<number>;

export const String = {
  tag: Types.String,
} as Type<string>;

export type Typeof<T extends Type<unknown>> = T['_type'];

export type Typify<T extends readonly Type<unknown>[] | []> = T extends [
  infer Head extends Type<unknown>,
  ...infer Tail extends Type<unknown>[]
]
  ? [Head['_type'], ...Typify<Tail>]
  : [];

export type TypeWrap<T extends readonly unknown[] | []> = T extends [
  infer Head extends unknown,
  ...infer Tail extends unknown[]
]
  ? [Type<Head>, ...TypeWrap<Tail>]
  : [];

export const TupleBase = {tag: Types.Tuple, elements: [] as Type<unknown>[]};

export function Tuple<T extends readonly Type<unknown>[] | []>(...elements: T) {
  return {
    tag: Types.Tuple,
    elements,
  } as unknown as Type<Typify<T>>;
}

export function Function<
  P extends readonly Type<unknown>[] | [],
  R extends Type<unknown>
>(parameters: P, returns: R) {
  return {
    tag: Types.Function,
    parameters,
    returns,
  } as unknown as Type<(...x: Typify<P>) => Typeof<R>>;
}

export function check(left: Type<unknown>, right: Type<unknown>) {
  return _.isEqual(left, right);
}

export function renderType(t: Type<unknown>): string {
  if (t.tag === Types.Boolean) {
    t;
  }
  switch (t.tag) {
    case Types.Boolean:
    case Types.Number:
    case Types.String:
      return typeNames[t.tag];
    case Types.Tuple:
      return (
        '[' +
        (t as unknown as typeof TupleBase).elements.map(e => renderType(e)) +
        ']'
      );
    default:
      throw new Error();
  }
}
