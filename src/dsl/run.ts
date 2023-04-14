import {ISkillsRepository} from '../interfaces';
import {SkillsRepository} from '../skills';

import {Action, EvaluationContext, parse, TypeCheckingContext} from '.';

export async function evaluateWithAction(
  text: string,
  skills: ISkillsRepository = new SkillsRepository()
): Promise<{
  action: Action;
  value: unknown;
}> {
  const {symbols, action, expression} = parse(text);
  const tcContext = new TypeCheckingContext(skills, symbols);
  expression.check(tcContext);
  const evalContext = new EvaluationContext(skills, symbols);

  return {
    action,
    value: await expression.eval(evalContext),
  };
}

export async function run(
  text: string,
  skills: ISkillsRepository = new SkillsRepository()
): Promise<unknown> {
  const {symbols, expression} = parse(text);
  const tcContext = new TypeCheckingContext(skills, symbols);
  expression.check(tcContext);
  const evalContext = new EvaluationContext(skills, symbols);
  return expression.eval(evalContext);
}
