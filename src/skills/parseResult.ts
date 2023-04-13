import {EvaluationContext, parseLiteral, run, SymbolTable} from '../dsl';

import {SkillsRepository} from '.';
import {ISkillsRepository} from '../interfaces';

export async function evaluateLiteral(text: string) {
  const matches = text.match(/~~~dsl\n([^~]*)/);
  if (!matches) {
    throw new Error(`Can't parse LLM response: ${JSON.stringify(text)}`);
  }
  const source = matches[1];
  const skills = new SkillsRepository();
  const symbols = new SymbolTable();
  const expression = parseLiteral(source);
  const evalContext = new EvaluationContext(skills, symbols);
  return await expression.eval(evalContext);
}

export async function evaluate(text: string, skills: ISkillsRepository) {
  const matches = text.match(/~~~dsl\n([^~]*)/);
  if (!matches) {
    throw new Error(`Can't parse LLM response: ${JSON.stringify(text)}`);
  }
  const source = matches[1];
  return await run(source, skills);
}
