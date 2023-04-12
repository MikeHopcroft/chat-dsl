import {EvaluationContext, parse, TypeCheckingContext} from '.';
import {SkillsRepository} from '../skills';

export async function run(
  text: string,
  skills: SkillsRepository = new SkillsRepository()
) {
  const {symbols, expression} = parse(text);
  const tcContext = new TypeCheckingContext(skills, symbols);
  expression.check(tcContext);
  const evalContext = new EvaluationContext(skills, symbols);
  // Don't need this await. Consider removing.
  return await expression.eval(evalContext);
}
