import Handlebars from 'handlebars';

import {renderType} from '../dsl/types';
import {ISkillsRepository, Skill, SkillSpecification} from '../interfaces';

import {result} from './result';

export function llmSkill<P extends unknown[], R>(
  spec: SkillSpecification<P, R>,
  skills: ISkillsRepository,
  template: string
): Skill<P, R> {
  const compiled = Handlebars.compile(template);

  const func = async (...params: unknown[]): Promise<R> => {
    const context = makeContext(params, spec, skills);
    // console.log(JSON.stringify(context, null, 2));

    console.log(compiled(context));

    //
    // Call out to the LLM
    //
    console.log('Pretending to call the LLM');

    //
    // Parse the result field
    //
    const text = '[1, "hi", true]';
    console.log(`Assume that LLM returned ${JSON.stringify(text)}`);
    const r = await result(text);
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
