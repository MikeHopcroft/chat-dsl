import chalk from 'chalk';
import Handlebars from 'handlebars';
import {v4 as uuidv4} from 'uuid';

import {Action} from '../dsl';
import {renderType} from '../dsl/types';
import {ISkillsRepository, Skill, SkillSpecification} from '../interfaces';
import {invokeMockLLM} from './invoke-mock-llm';

import {getSkillResult} from './parseResult';

class Conversation {
  sections: string[] = [];
  logger: (text: string) => void;

  constructor(logger: (text: string) => void = () => {}) {
    this.logger = logger;
  }

  turn(role: string, type: string, ...parts: string[]) {
    const heading = `[${role}](#${type})`;
    this.logger(heading);
    this.sections.push(heading);
    for (const part of parts) {
      this.logger(part);
      this.sections.push(part);
    }
    this.logger('');
    this.sections.push('');
  }

  text(): string {
    return this.sections.join('\n');
  }
}

export function llmSkill<P extends unknown[], R>(
  spec: SkillSpecification<P, R>,
  skills: ISkillsRepository,
  template: string,
  maxSteps: number
): Skill<P, R> {
  const compiled = Handlebars.compile(template);

  const func = async (...params: unknown[]): Promise<R> => {
    const context = makeContext(params, spec, skills);
    const conversation = new Conversation(console.log);
    conversation.turn('system', 'instructions', compiled(context));

    for (let i = 0; i < maxSteps; ++i) {
      //
      // Call out to the LLM
      //
      const dsl = await invokeMockLLM(
        conversation.text(),
        context.uuid,
        context.call,
        i
      );

      conversation.turn('assistant', 'message', dsl);

      //
      // Parse the result field
      //
      const {action, value} = await getSkillResult(dsl, skills);
      conversation.turn('dsl', 'message', JSON.stringify(value));
      if (action === Action.Return) {
        console.log(chalk.red(`LLM returns ${JSON.stringify(value)}`));
        return value as R;
      }
    }

    throw new Error(`Exceeded maximum step count of ${maxSteps}.`);
  };

  return {func, ...spec};
}

function makeContext<P extends unknown[], R>(
  params: P,
  spec: SkillSpecification<P, R>,
  skillsRepository: ISkillsRepository
) {
  const uuid = uuidv4();
  const call = `${spec.name}(${params.map(p => JSON.stringify(p)).join(', ')})`;
  const invocationContext = skillSpecificationContext(
    spec
  ) as SkillInvocationContext;
  for (const [i, p] of invocationContext.params.entries()) {
    p.value = JSON.stringify(params[i]);
  }
  const skills = skillsRepository
    .allSkills()
    .map(s => skillSpecificationContext(s));
  return {
    ...invocationContext,
    uuid,
    call,
    skills,
  };
}

interface SkillSpecificationContext {
  name: string;
  description: string;
  prototype: string;
  params: {
    type: string;
    name: string;
    description: string;
  }[];
  returns: {
    type: string;
    description: string;
  };
}

interface SkillInvocationContext extends SkillSpecificationContext {
  uuid: string;
  call: string;
  params: {
    type: string;
    name: string;
    description: string;
    value: string;
  }[];
}

function skillSpecificationContext<P extends unknown[], R>(
  s: SkillSpecification<P, R>
): SkillSpecificationContext {
  return {
    ...s,
    prototype: `${s.name}(${s.params.map(p => p.name).join(', ')})`,
    params: s.params.map(p => ({...p, type: renderType(p.type)})),
    returns: {...s.returns, type: renderType(s.returns.type)},
  };
}
