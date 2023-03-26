import {EvaluationContext} from './evaluation-context';
import {Skill} from './interfaces';
import {parse} from './parser';
import {SkillsRepository} from './skills-repository';
import * as t from './types';
import {TypeCheckingContext} from './type-checking-context';

const add: Skill<[number, number], number> = {
  func: (a: number, b: number) => a + b,
  paramsType: t.Tuple(t.Number, t.Number),
  returnType: t.Number,
  name: 'add',
  description: 'adds two numbers',
};

const mul: Skill<[number, number], number> = {
  func: (a: number, b: number) => a * b,
  paramsType: t.Tuple(t.Number, t.Number),
  returnType: t.Number,
  name: 'mul',
  description: 'multiples two numbers',
};

const reverse: Skill<[string], string> = {
  func: (s: string) => s.split('').reverse().join(''),
  paramsType: t.Tuple(t.String),
  returnType: t.String,
  name: 'reverse',
  description: 'reverses a string',
};

const skillsRepository = new SkillsRepository();
skillsRepository.add(add);
skillsRepository.add(mul);
skillsRepository.add(reverse);

export async function run(
  text: string,
  skills: SkillsRepository = skillsRepository
) {
  const {symbols, expression} = parse(text);
  const tcContext = new TypeCheckingContext(skills, symbols);
  expression.check(tcContext);
  const evalContext = new EvaluationContext(skills, symbols);
  return await expression.eval(evalContext);
}
