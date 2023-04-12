import {SkillError} from './errors';
import {ISkillsRepository, Skill} from './interfaces';
import {renderSkill} from './skills';

export class SkillsRepository implements ISkillsRepository {
  skills = new Map<string, Skill<unknown[], unknown>>();

  constructor(skills: Skill<unknown[], unknown>[] = []) {
    for (const skill of skills) {
      this.add(skill);
    }
  }

  add<P extends unknown[], R>(skill: Skill<P, R>) {
    if (this.skills.has(skill.name)) {
      throw new SkillError(`Duplicate binding for skill "${skill.name}".`);
    }
    // TODO: sort out typing
    this.skills.set(skill.name, skill as unknown as Skill<unknown[], unknown>);
  }

  get(name: string): Skill<unknown[], unknown> {
    const skill = this.skills.get(name);
    if (skill === undefined) {
      throw new SkillError(`Unknown skill "${name}".`);
    }
    return skill;
  }

  allSkills(): Skill<unknown[], unknown>[] {
    return [...this.skills.values()];
  }

  render(): string {
    const sections: string[] = [];
    for (const skill of this.skills.values()) {
      sections.push(renderSkill(skill));
    }
    return sections.join('\n');
  }
}
