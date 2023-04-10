import * as t from './types';

import {Skill} from './interfaces';

// export interface Param<T> {
//   name: string;
//   description: string;
//   type: t.Type<T>;
// }

// export interface ReturnValue<T> {
//   description: string;
//   type: t.Type<T>;
// }

// type ParamsFromTypes<T extends readonly unknown[] | []> = {
//   -readonly [P in keyof T]: Param<T[P]>;
// };

// export interface Skill<P extends unknown[], R> {
//   func: (...params: P) => R;
//   params: ParamsFromTypes<P>;
//   returns: ReturnValue<R>;

//   name: string;
//   description: string;
// }

export function renderSkill<P extends unknown[], R>(skill: Skill<P, R>) {
  const lines: string[] = [];
  lines.push(`* ${skill.name}(${skill.params.map(p => p.name).join(', ')})`);
  lines.push(`  * Description: ${skill.description}`);
  lines.push('  * Parameters:');

  for (const p of skill.params) {
    lines.push(`    * ${p.name}: ${t.renderType(p.type)} - ${p.description}`);
  }

  lines.push('  * Returns:');
  lines.push(
    `    * ${t.renderType(skill.returns.type)}: ${skill.returns.description}`
  );
  return lines.join('\n');
}

const mySkill: Skill<[number, string], string> = {
  name: 'bulleted',
  description: 'A function that generates a numbered list item.',
  func: (a: number, b: string) => `${a}: ${b}`,
  params: [
    {
      name: 'bullet',
      description: 'The numerical value to use for the list item bullet.',
      type: t.Number,
    },
    {
      name: 'text',
      description: 'The text for this list item.',
      type: t.String,
    },
  ],
  returns: {
    description: 'The complete list item with bullet and text',
    type: t.String,
  },
};

console.log(renderSkill(mySkill));
