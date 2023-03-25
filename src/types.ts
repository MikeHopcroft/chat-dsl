import * as _ from 'lodash';

export enum Types {
  Boolean,
  Function,
  Number,
  String,
  Tuple,
}

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

export type Typeof<T extends Type<any>> = T['_type'];

// type Typify<T extends readonly Type<unknown>[] | []> = {
//   -readonly [P in keyof T]: T[P]['_type'];
// };

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
  // (Type<Typify<P>>) => Type<Typify<R>>;
}

export function check(left: Type<unknown>, right: Type<unknown>) {
  return _.isEqual(left, right);
}

// type x = Typify<[Type<string>, Type<string>]>;
// type s = Typeof<typeof String>;
// const t = Tuple(String, Number, Boolean, Tuple(Boolean, String));
// type t = Typeof<typeof t>;
// const f = Function([String, Number], Boolean);
