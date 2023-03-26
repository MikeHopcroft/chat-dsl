import {TokenPosition} from 'typescript-parsec';

import {
  ASTFunction,
  ASTReference,
  ASTTuple,
  booleanLiteral,
  numberLiteral,
  stringLiteral,
} from '../src/ast';

import {EvaluationContext} from '../src/evaluation-context';
import {Skill} from '../src/interfaces';
import {SkillsRepository} from '../src/skills-repository';
import {SymbolTable} from '../src/symbol-table';
import {TypeCheckingContext} from '../src/type-checking-context';
import * as t from '../src/types';

const position: TokenPosition = {
  index: 0,
  rowBegin: 1,
  rowEnd: 2,
  columnBegin: 3,
  columnEnd: 4,
};

const skills = new SkillsRepository();
const symbols = new SymbolTable();

describe('primitive types', () => {
  test('boolean', async () => {
    const value = true;
    const node = booleanLiteral(value, position);
    expect(node.position).toBe(position);
    expect(node.check()).toEqual(t.Boolean);
    expect(await node.eval()).toEqual(value);
  });

  test('number', async () => {
    const value = 123;
    const node = numberLiteral(value, position);
    expect(node.position).toBe(position);
    expect(node.check()).toEqual(t.Number);
    expect(await node.eval()).toEqual(value);
  });

  test('string', async () => {
    const value = 'hello';
    const node = stringLiteral(value, position);
    expect(node.position).toBe(position);
    expect(node.check()).toEqual(t.String);
    expect(await node.eval()).toEqual(value);
  });
});

describe('compound types', () => {
  test('function (valid)', async () => {
    const add: Skill<[number, number], number> = {
      func: jest.fn((a: number, b: number) => a + b),
      paramsType: t.Tuple(t.Number, t.Number),
      returnType: t.Number,
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

    const tcContext = new TypeCheckingContext(skills, symbols);
    const evalContext = new EvaluationContext(skills, symbols);

    expect(node.position).toBe(position);
    expect(node.check(tcContext)).toEqual(t.Number);
    await expect(await node.eval(evalContext)).toEqual(3);
    expect(add.func).toHaveBeenCalledWith(1, 2);
    expect(add.func).toHaveBeenCalledTimes(1);
  });

  test('function (type mismatch)', async () => {
    const add: Skill<[number, number], number> = {
      func: jest.fn((a: number, b: number) => a + b),
      paramsType: t.Tuple(t.Number, t.Number),
      returnType: t.Number,
      name: 'add',
      description: 'adds two numbers',
    };

    const skills = new SkillsRepository();
    skills.add(add);

    const node = new ASTFunction(
      'add',
      [stringLiteral('hello', position), numberLiteral(2, position)],
      position
    );

    const tcContext = new TypeCheckingContext(skills, symbols);

    expect(node.position).toBe(position);
    expect(() => node.check(tcContext)).toThrow('Type mismatch');
  });

  test('reference (valid)', async () => {
    const value = 123;
    const symbols = new SymbolTable([['a', numberLiteral(value, position)]]);
    const node = new ASTReference('a', position);

    const tcContext = new TypeCheckingContext(skills, symbols);
    const evalContext = new EvaluationContext(skills, symbols);

    expect(node.position).toBe(position);
    expect(node.check(tcContext)).toEqual(t.Number);
    await expect(await node.eval(evalContext)).toEqual(value);
  });

  test('reference (invalid)', async () => {
    const symbols = new SymbolTable();
    const node = new ASTReference('a', position);

    const tcContext = new TypeCheckingContext(skills, symbols);
    const evalContext = new EvaluationContext(skills, symbols);

    expect(() => node.check(tcContext)).toThrow('Unknown symbol "a".');
    await expect(async () => await node.eval(evalContext)).rejects.toThrow(
      'Unknown symbol "a".'
    );
  });

  test('tuple', async () => {
    const node = new ASTTuple(
      [
        booleanLiteral(false, position),
        numberLiteral(1, position),
        stringLiteral('hello', position),
        new ASTTuple(
          [numberLiteral(2, position), stringLiteral('world', position)],
          position
        ),
      ],
      position
    );

    const tcContext = new TypeCheckingContext(skills, symbols);
    const evalContext = new EvaluationContext(skills, symbols);

    expect(node.position).toBe(position);
    expect(node.check(tcContext)).toEqual(
      t.Tuple(t.Boolean, t.Number, t.String, t.Tuple(t.Number, t.String))
    );
    await expect(await node.eval(evalContext)).toEqual([
      false,
      1,
      'hello',
      [2, 'world'],
    ]);
  });

  // Cycles
});

// describe('Symbols', () => {
//   test('number', () => {
//     expect(true).toBe(true);
//   });
// });
// describe('Context', () => {
//   test('number', () => {
//     expect(true).toBe(true);
//   });
// });
