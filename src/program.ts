import * as t from './dsl/types';
import {Skill, SkillSpecification} from './interfaces';
import {llmSkill, llmSkillTemplate, SkillsRepository} from './skills';

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

const skillsRepository = new SkillsRepository();
skillsRepository.add(add);
skillsRepository.add(mul);
skillsRepository.add(reverse);

const mySkillSpecification: SkillSpecification<[number, string], string> = {
  name: 'bulleted',
  description: 'A function that generates a numbered list item.',
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

// console.log(renderSkill(mySkill));
const x = llmSkill(mySkillSpecification, skillsRepository, llmSkillTemplate);
console.log('==========================');
x.func(1, 'hello');
