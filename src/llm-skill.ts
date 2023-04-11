import {Skill, SkillSpecification} from './interfaces';
import {result} from './program';
import {renderSkill} from './skills';
import {SkillsRepository} from './skills-repository';

export function llmSkill<P extends unknown[], R>(
  spec: SkillSpecification<P, R>,
  skills: SkillsRepository
): Skill<P, R> {
  const func = async (...params: unknown[]): Promise<R> => {
    //
    // Create the prompt
    //
    const lines: string[] = [];

    // Introduction
    lines.push(
      `You are an LLM that computes the value of the \`${spec.name}\` function.`,
      `Here is documentation for the \`${spec.name}\` function.`
    );

    // Documentation for this function
    lines.push(renderSkill(spec));

    // Information about available skills.
    // Can this be injected from the context?
    lines.push('\nYou have the following skills available to you:');
    lines.push(skills.render());

    // Information about the actual parameters passed.
    lines.push('\nHere are the values of the parameters:');
    for (const [i, p] of params.entries()) {
      lines.push(`* ${spec.params[i].name} = ${JSON.stringify(p)}`);
    }

    console.log(lines.join('\n'));

    //
    // Call out to the LLM
    //

    //
    // Parse the result field
    //
    const text = '[1, "hi", true]';
    console.log(text);
    const r = await result(text);
    console.log(`Result = ${JSON.stringify(r)}`);
    // const r = undefined as unknown;
    return r as R;
  };

  return {func, ...spec};
}
