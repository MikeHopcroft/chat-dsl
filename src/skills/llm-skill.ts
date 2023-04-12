import Handlebars from 'handlebars';

import {ISkillsRepository, Skill, SkillSpecification} from '../interfaces';
import {result} from '../program';
import {renderType} from '../dsl/types';

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
  const specContext = skillSpecificationContext(spec);
  for (const [i, p] of specContext.params.entries()) {
    (p as any).value = JSON.stringify(params[i]);
  }
  const skills = skillsRepository
    .allSkills()
    .map(s => skillSpecificationContext(s));
  return {
    call,
    ...specContext,
    skills,
  };
}

function skillSpecificationContext<P extends unknown[], R>(
  s: SkillSpecification<P, R>
) {
  return {
    ...s,
    prototype: `${s.name}(${s.params.map(p => p.name).join(', ')})`,
    params: s.params.map(p => ({...p, type: renderType(p.type)})),
    returns: {...s.returns, type: renderType(s.returns.type)},
  };
}
