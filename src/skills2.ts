import * as t from './types';

export interface Param<T> {
  name: string;
  description: string;
  type: t.Type<T>;
}

// type ParamsToTypes<T extends readonly Param<unknown>[] | []> = {
//   -readonly [P in keyof T]: T[P]['type']['_type'];
// };

type ParamsFromTypes2<T extends readonly unknown[] | []> = {
  -readonly [P in keyof T]: Param<T[P]>;
};

type ParamsFromTypes<P extends readonly unknown[] | []> = P extends readonly [
  infer Head extends unknown,
  ...infer Tail extends readonly unknown[]
]
  ? readonly [Param<Head>, ...ParamsFromTypes2<Tail>]
  : readonly [];

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

// type x2 = ParamsToTypes<typeof params>;
// type y2 = ParamsToTypes<[Param<number>, Param<boolean>]>;
// type z2 = ParamsToTypes<(Param<number> | Param<boolean>)[]>;

// type y3 = ParamsFromTypes2<[number, string]>;

export interface Skill<P extends unknown[], R> {
  func: (...params: P) => R;
  params: ParamsFromTypes2<P>;

  name: string;
  description: string;
}

function renderSkill<P extends unknown[], R>(skill: Skill<P, R>) {
  const lines: string[] = [];
  lines.push(`* ${skill.name}(${skill.params.map(p => p.name).join(', ')})`);

  for (const p of skill.params) {
    lines.push(`  * ${p.name}: type - ${p.description}`);
  }
  return lines.join('\n');
}

const mySkill: Skill<[number, string], string> = {
  func: (a: number, b: string) => `${a}: ${b}`,
  params: [
    {
      name: 'a',
      description: 'description for a',
      type: t.Number,
    },
    {
      name: 'b',
      description: 'description for b',
      type: t.String,
    },
  ],
  name: 'foo',
  description: 'the foo function',
};

// function convert<P extends unknown[], R>(s: Skill<P, R>) {
//   return s;
// }

// fooSkill.params;
// const ffoo = convert(fooSkill);

// console.log(renderSkill(ffoo));
console.log(renderSkill(mySkill));
