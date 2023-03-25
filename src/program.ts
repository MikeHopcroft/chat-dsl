import {EvaluationContext} from './evaluation-context';
import {parse} from './parser';
import {TypeCheckingContext} from './type-checking-context';

export async function run(text: string) {
  const {symbols, expression} = parse(text);
  const tcContext = new TypeCheckingContext(symbols);
  expression.check(tcContext);
  const evalContext = new EvaluationContext(symbols);
  return await expression.eval(evalContext);
}
