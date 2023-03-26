import {EvaluationContext} from './evaluation-context';
import {parse} from './parser';
import {SkillsRepository} from './skills-repository';
import {TypeCheckingContext} from './type-checking-context';

export async function run(
  text: string,
  skills: SkillsRepository = new SkillsRepository()
) {
  const {symbols, expression} = parse(text);
  const tcContext = new TypeCheckingContext(skills, symbols);
  expression.check(tcContext);
  const evalContext = new EvaluationContext(skills, symbols);
  return await expression.eval(evalContext);
}
