import * as t from './types';

// interface Param<T> {
//   name: string;
//   description: string;
//   type: t.Type<T>;
// }

// // export interface Skill<P extends unknown[] | [], R> {
// //   func: (...params: P) => R;
// //   paramsType: t.Type<P>;
// //   returnType: t.Type<R>;

// //   name: string;
// //   description: string;
// // }

// export interface Skill<P extends Param<unknown>[], R> {
//   func: (...params: Params2<P>) => R;
//   params: P;
//   // paramsType: t.Type<P>;
//   // returnType: t.Type<R>;

//   name: string;
//   description: string;
// }

// const fooSkill = {
//   func: (a: number, b: string) => `${a}: ${b}`,
//   params: [
//     {
//       name: 'a',
//       description: 'description for a',
//       type: t.Number,
//     } as Param<number>,
//     {
//       name: 'b',
//       description: 'description for b',
//       type: t.Boolean,
//     } as Param<boolean>,
//   ] as const,
//   name: 'foo',
//   description: 'the foo function',
// };

// function convert<P extends Param<unknown>[], R>(s: Skill<P, R>) {
//   return s;
// }

// const ffoo = convert(fooSkill);

// const params = [
//   {
//     name: 'a',
//     description: 'description for a',
//     type: t.Number,
//   } as Param<number>,
//   {
//     name: 'b',
//     description: 'description for b',
//     type: t.Boolean,
//   } as Param<boolean>,
// ] as const;

// type Params<P extends readonly Param<unknown>[] | []> = P extends [
//   infer Head extends Param<unknown>,
//   ...infer Tail extends readonly Param<unknown>[]
// ]
//   ? [Head['type'], ...Params<Tail>]
//   : [];

// type Params2<T extends readonly Param<unknown>[] | []> = {
//   -readonly [P in keyof T]: T[P]['type']['_type'];
// };

// type x = Params<typeof params>;
// type y = Params<[Param<number>, Param<boolean>]>;
// type z = Params<(Param<number> | Param<boolean>)[]>;

// type x2 = Params2<typeof params>;
// type y2 = Params2<[Param<number>, Param<boolean>]>;
// type z2 = Params2<(Param<number> | Param<boolean>)[]>;
