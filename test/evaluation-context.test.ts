import {TokenPosition} from 'typescript-parsec';

import {ASTFunction, numberLiteral} from '../src/dsl/ast-nodes';

import {EvaluationContext} from '../src/dsl/evaluation-context';
import {Skill} from '../src/interfaces';
import {SkillsRepository} from '../src/skills/skills-repository';
import {SymbolTable} from '../src/dsl/symbol-table';
import * as t from '../src/dsl/types';

const position: TokenPosition = {
  index: 0,
  rowBegin: 1,
  rowEnd: 2,
  columnBegin: 3,
  columnEnd: 4,
};

describe('EvaluationContext', () => {
  test('get (memoization)', async () => {
    const add: Skill<[number, number], number> = {
      func: jest.fn((a: number, b: number) => Promise.resolve(a + b)),
      params: [
        {name: 'a', description: 'description for a', type: t.Number},
        {name: 'b', description: 'description for b', type: t.Number},
      ],
      returns: {description: 'sum', type: t.Number},
      name: 'add',
      description: 'adds two numbers',
    };

    const skills = new SkillsRepository();
    skills.add(add);

    const node = new ASTFunction(
      'add',
      [numberLiteral(1, position), numberLiteral(2, position)],
      position
    );

    const symbols = new SymbolTable([
      ['a', node],
      ['b', node],
    ]);

    const evalContext = new EvaluationContext(skills, symbols);

    expect(await evalContext.get('a')).toBe(3);
    expect(add.func).toHaveBeenCalledTimes(1);
    expect(await evalContext.get('a')).toBe(3);
    expect(add.func).toHaveBeenCalledTimes(1);

    expect(await evalContext.get('b')).toBe(3);
    expect(add.func).toHaveBeenCalledTimes(2);
    expect(await evalContext.get('b')).toBe(3);
    expect(add.func).toHaveBeenCalledTimes(2);
  });
});
