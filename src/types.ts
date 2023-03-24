import * as _ from 'lodash';
enum Types {
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

type Typify<T extends readonly Type<unknown>[] | []> = T extends [
  infer Head extends Type<unknown>,
  ...infer Tail extends Type<unknown>[]
]
  ? [Head['_type'], ...Typify<Tail>]
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
    tag: Types.Tuple,
    parameters,
    returns,
  } as unknown as (...x: Typify<P>) => Typeof<R>;
  // (Type<Typify<P>>) => Type<Typify<R>>;
}

type x = Typify<[Type<string>, Type<string>]>;
type s = Typeof<typeof String>;
const t = Tuple(String, Number, Boolean, Tuple(Boolean, String));
type t = Typeof<typeof t>;
const f = Function([String, Number], Boolean);
