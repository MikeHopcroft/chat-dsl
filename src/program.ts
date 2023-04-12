import {EvaluationContext} from './evaluation-context';
import {Skill, SkillSpecification} from './interfaces';
import {llmSkill} from './llm-skill';
import {llmSkillTemplate} from './llm-skill-template';
import {parse, parseLiteral} from './parser';
import {SkillsRepository} from './skills-repository';
import {SymbolTable} from './symbol-table';
import * as t from './types';
import {TypeCheckingContext} from './type-checking-context';

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

// console.log(skillsRepository.render());

export async function run(
  text: string,
  skills: SkillsRepository = skillsRepository
) {
  const {symbols, expression} = parse(text);
  const tcContext = new TypeCheckingContext(skills, symbols);
  expression.check(tcContext);
  const evalContext = new EvaluationContext(skills, symbols);
  // Don't need this await.
  return await expression.eval(evalContext);
}

export async function result(text: string) {
  const skills = new SkillsRepository();
  const symbols = new SymbolTable();
  const expression = parseLiteral(text);
  const evalContext = new EvaluationContext(skills, symbols);
  return await expression.eval(evalContext);
}

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
