import {run} from '../src/program';

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

  // test('negative', async () => {
  //   const tuple = -123;
  //   const result = await run(`return ${JSON.stringify(tuple)}`);
  //   expect(result).toEqual(tuple);
  // });

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

describe('comprehensive', () => {
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
