import {TokenPosition} from 'typescript-parsec';

import {
  ASTFunction,
  ASTReference,
  CycleDetectedError,
  numberLiteral,
  SymbolTable,
  TypeCheckingContext,
} from '../../src/dsl';

import * as t from '../../src/dsl/types';
import {Skill} from '../../src/interfaces';
import {SkillsRepository} from '../../src/skills';

function advance(position: TokenPosition): TokenPosition {
  return {
    ...position,
    rowBegin: position.rowBegin + 1,
    rowEnd: position.rowEnd + 1,
  };
}

// TODO: consider implementing the following tests:
// test('lookup', () => {});
// test('push', () => {});
// test('pop', () => {});
// test('enterScope', () => {});
// test('exitScope', () => {});

test('cycle detection', () => {
  let position: TokenPosition = {
    index: 0,
    rowBegin: 1,
    rowEnd: 2,
    columnBegin: 3,
    columnEnd: 4,
  };

  const add: Skill<[number, number], number> = {
    func: (a: number, b: number) => Promise.resolve(a + b),
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

  const symbols = new SymbolTable();
  symbols.add(
    'a',
    new ASTFunction(
      'add',
      [numberLiteral(1, position), new ASTReference<number>('b', position)],
      position
    )
  );
  position = advance(position);

  symbols.add(
    'b',
    new ASTFunction(
      'add',
      [numberLiteral(2, position), new ASTReference<number>('c', position)],
      position
    )
  );
  position = advance(position);

  symbols.add('c', new ASTReference<number>('a', position));
  position = advance(position);

  const node = new ASTFunction(
    'add',
    [numberLiteral(3, position), new ASTReference<number>('a', position)],
    position
  );

  const context = new TypeCheckingContext(skills, symbols);
  expect(() => node.check(context)).toThrow(CycleDetectedError);
});
