import {ISkillsRepository} from '../interfaces';
import {SkillsRepository} from '../skills';

import {EvaluationContext, parse, TypeCheckingContext} from '.';

export async function run(
  text: string,
  skills: ISkillsRepository = new SkillsRepository()
) {
  const {symbols, expression} = parse(text);
  const tcContext = new TypeCheckingContext(skills, symbols);
  expression.check(tcContext);
  const evalContext = new EvaluationContext(skills, symbols);
  // Don't need this await. Consider removing.
  return await expression.eval(evalContext);
}
