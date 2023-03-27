import {SkillError} from '../src/errors';
import {Skill} from '../src/interfaces';
import {run} from '../src/program';
import {SkillsRepository} from '../src/skills-repository';
import * as t from '../src/types';

///////////////////////////////////////////////////////////////////////////////
//
// Sample skills for unit tests
//
///////////////////////////////////////////////////////////////////////////////
const add: Skill<[number, number], number> = {
  func: (a: number, b: number) => a + b,
  paramsType: t.Tuple(t.Number, t.Number),
  returnType: t.Number,
  name: 'add',
  description: 'adds two numbers',
};

const mul: Skill<[number, number], number> = {
  func: (a: number, b: number) => a * b,
  paramsType: t.Tuple(t.Number, t.Number),
  returnType: t.Number,
  name: 'mul',
  description: 'multiples two numbers',
};

const reverse: Skill<[string], string> = {
  func: (s: string) => s.split('').reverse().join(''),
  paramsType: t.Tuple(t.String),
  returnType: t.String,
  name: 'reverse',
  description: 'reverses a string',
};

const skills = new SkillsRepository();
skills.add(add);
skills.add(mul);
skills.add(reverse);

///////////////////////////////////////////////////////////////////////////////
//
// Unit tests
//
///////////////////////////////////////////////////////////////////////////////
describe('primitive types', () => {
  test('boolean', async () => {
    const result = await run('return true');
    expect(result).toBe(true);
  });

  test('number', async () => {
    const result = await run('return 123');
    expect(result).toBe(123);
  });

  test('number (negative)', async () => {
    const result = await run('return -123');
    expect(result).toBe(-123);
  });

  test('string', async () => {
    const result = await run('return "hello"');
    expect(result).toBe('hello');
  });
});

describe('tuples', () => {
  test('empty', async () => {
    const tuple = [] as unknown[];
    const result = await run(`return ${JSON.stringify(tuple)}`);
    expect(result).toEqual(tuple);
  });

  test('simple', async () => {
    const tuple = [123, 'hello', false];
    const result = await run(`return ${JSON.stringify(tuple)}`);
    expect(result).toEqual(tuple);
  });

  test('nested', async () => {
    const tuple = [123, 'hello', true, [false, [1]]];
    const result = await run(`return ${JSON.stringify(tuple)}`);
    expect(result).toEqual(tuple);
  });
});

test('comprehensive', async () => {
  const values = [
    // Simple literals
    true,
    false,
    123,
    -456,
    'hello',

    // Tuple literals
    [],
    [123, 'hello', false],
    [123, 'hello', true, [false, [1]]],
  ];

  for (const value of values) {
    const result = await run(`return ${JSON.stringify(value)}`);
    expect(result).toEqual(value);
  }
});

describe('references', () => {
  test('simple', async () => {
    const cases: [string, number][] = [['a = 5 return a', 5]];

    for (const [input, expected] of cases) {
      const result = await run(input);
      expect(result).toEqual(expected);
    }
  });
});

describe('skills', () => {
  test('valid', async () => {
    const cases: [string, unknown][] = [
      ['return add(1,2)', 3],
      ['return mul(3, 4)', 12],
      ['return mul(3, add(1, 2))', 9],
      ['return reverse("hello")', 'olleh'],
    ];

    for (const [input, expected] of cases) {
      const result = await run(input, skills);
      expect(result).toEqual(expected);
    }
  });

  test('errors', async () => {
    const cases: [string, Error][] = [
      ['return foobar(1,2)', new SkillError('Unknown skill "foobar".')],
      ['return mul()', new TypeError('Type mismatch')],
      ['return mul(1)', new TypeError('Type mismatch')],
      ['return mul("hello")', new TypeError('Type mismatch')],
    ];

    for (const [input, error] of cases) {
      await expect(async () => await run(input, skills)).rejects.toThrow(error);
    }
  });
});

test('comments and white space', async () => {
  const cases: [string, any][] = [
    ['  \t\n  a  = 1 b=2 return add(a\n\n, b)', 3],
    ['a=123 // this is a comment\nreturn a', 123],
  ];

  for (const [input, expected] of cases) {
    const result = await run(input, skills);
    expect(result).toEqual(expected);
  }
});
