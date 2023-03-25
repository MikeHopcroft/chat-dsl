// import {FunctionDeclaration} from '../src/ast';
// import * as t from '../src/types';
import {ISkillsRepository, Skill} from './interfaces';

export class SkillsRepository implements ISkillsRepository {
  skills = new Map<string, Skill<unknown[], unknown>>();

  constructor(skills: Skill<unknown[], unknown>[] = []) {
    for (const skill of skills) {
      this.add(skill);
    }
  }

  add<P extends unknown[], R>(skill: Skill<P, R>) {
    if (this.skills.has(skill.name)) {
      throw new Error(`Duplicate binding for skill "${skill.name}".`);
    }
    // TODO: sort out typing
    this.skills.set(skill.name, skill as unknown as Skill<unknown[], unknown>);
  }

  get(name: string): Skill<unknown[], unknown> {
    const skill = this.skills.get(name);
    if (skill === undefined) {
      throw new Error(`Unknown skill "${name}".`);
    }
    return skill;
  }
}

export const allSkills = new SkillsRepository();

// const add: Skill<number[], number> = {
//   func: {
//     func: (a: number, b: number) => a + b,
//     paramsType: t.Tuple(t.Number, t.Number),
//     returnType: t.Number,
//   } as FunctionDeclaration<[number, number], number>,
//   name: 'add',
//   description: 'adds two numbers',
// };

// const mul: Skill<number[], number> = {
//   func: {
//     func: (a: number, b: number) => a * b,
//     paramsType: t.Tuple(t.Number, t.Number),
//     returnType: t.Number,
//   } as FunctionDeclaration<[number, number], number>,
//   name: 'mul',
//   description: 'multiplies two numbers',
// };

// allSkills.add(add);
// allSkills.add(mul);
