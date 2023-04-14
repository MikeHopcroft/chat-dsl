import {evaluateWithAction} from '../dsl';
import {ISkillsRepository} from '../interfaces';

export async function getSkillResult(text: string, skills: ISkillsRepository) {
  const matches = text.match(/~~~dsl\n([^~]*)/);
  if (!matches) {
    throw new Error(`Can't parse LLM response: ${JSON.stringify(text)}`);
  }
  const source = matches[1];
  return await evaluateWithAction(source, skills);
}
