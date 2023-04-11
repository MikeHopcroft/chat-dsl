import * as t from './types';

import {SkillSpecification} from './interfaces';

export function renderSkill<P extends unknown[], R>(
  skill: SkillSpecification<P, R>
) {
  const lines: string[] = [];
  lines.push(`* ${skill.name}(${skill.params.map(p => p.name).join(', ')})`);
  lines.push(`  * Description: ${skill.description}`);
  lines.push('  * Parameters:');

  for (const p of skill.params) {
    lines.push(`    * ${p.name}: ${t.renderType(p.type)} - ${p.description}`);
  }

  lines.push('  * Returns:');
  lines.push(
    `    * ${t.renderType(skill.returns.type)} - ${skill.returns.description}`
  );
  return lines.join('\n');
}
