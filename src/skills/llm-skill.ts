import Handlebars from 'handlebars';
import {v4 as uuidv4} from 'uuid';

import {renderType} from '../dsl/types';
import {ISkillsRepository, Skill, SkillSpecification} from '../interfaces';

import {invokeLLM} from '../skills/invoke-llm';
import {evaluate} from './parseResult';

export function llmSkill<P extends unknown[], R>(
  spec: SkillSpecification<P, R>,
  skills: ISkillsRepository,
  template: string
): Skill<P, R> {
  const compiled = Handlebars.compile(template);

  const func = async (...params: unknown[]): Promise<R> => {
    const context = makeContext(params, spec, skills);
    const prompt = compiled(context);

    //
    // Call out to the LLM
    //
    const result = await invokeLLM(prompt, context.uuid, context.call);

    //
    // Parse the result field
    //
    const r = await evaluate(result, skills);
    console.log(`Parsed result = ${JSON.stringify(r)}`);
    return r as R;
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
