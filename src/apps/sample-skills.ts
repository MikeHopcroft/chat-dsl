import * as t from '../dsl/types';
import {Skill} from '../interfaces';
import {SkillsRepository} from '../skills';

const add: Skill<[number, number], number> = {
  func: (a: number, b: number) => Promise.resolve(a + b),
  params: [
    {name: 'a', description: 'description for a', type: t.Number},
    {name: 'b', description: 'description for b', type: t.Number},
  ],
  returns: {description: 'the sum `a + b`', type: t.Number},
  name: 'add',
  description: 'adds two numbers',
};

const mul: Skill<[number, number], number> = {
  func: (a: number, b: number) => Promise.resolve(a * b),
  params: [
    {name: 'a', description: 'description for a', type: t.Number},
    {name: 'b', description: 'description for b', type: t.Number},
  ],
  returns: {description: 'the product `a * b`', type: t.Number},
  name: 'mul',
  description: 'multiples two numbers',
};

const reverse: Skill<[string], string> = {
  func: (s: string) => Promise.resolve(s.split('').reverse().join('')),
  params: [{name: 'text', description: 'text to reverse', type: t.String}],
  returns: {description: 'the reversed text', type: t.String},
  name: 'reverse',
  description: 'reverses a string',
};

export const sampleSkills = new SkillsRepository();
sampleSkills.add(add);
sampleSkills.add(mul);
sampleSkills.add(reverse);
