import {EvaluationContext, parseLiteral, SymbolTable} from '../dsl';

import {SkillsRepository} from '.';

export async function result(text: string) {
  const skills = new SkillsRepository();
  const symbols = new SymbolTable();
  const expression = parseLiteral(text);
  const evalContext = new EvaluationContext(skills, symbols);
  return await expression.eval(evalContext);
}
