import {TokenPosition} from 'typescript-parsec';

import {
  booleanLiteral,
  Context,
  func,
  numberLiteral,
  reference,
  stringLiteral,
  Symbols,
} from '../src/eval';

const position: TokenPosition = {
  index: 0,
  rowBegin: 1,
  rowEnd: 2,
  columnBegin: 3,
  columnEnd: 4,
};

const symbols = new Symbols();

describe('primitive types', () => {
  test('boolean', async () => {
    const value = true;
    const expression = booleanLiteral(value, position);
    const context = new Context(symbols);
    expect(expression.position).toBe(position);
    expect(await expression(context)).toEqual(value);
  });

  test('number', async () => {
    const value = 123;
    const expression = numberLiteral(value, position);
    const context = new Context(symbols);
    expect(expression.position).toBe(position);
    expect(await expression(context)).toEqual(value);
  });

  test('string', async () => {
    const value = 'hello';
    const expression = stringLiteral(value, position);
    const context = new Context(symbols);
    expect(expression.position).toBe(position);
    expect(await expression(context)).toEqual(value);
  });
});

describe('compound types', () => {
  test('function', async () => {
    const add = (a: number, b: number) => a + b;
    const expression = func(
      add,
      [numberLiteral(1, position), numberLiteral(2, position)],
      position
    );
    const context = new Context(symbols);
    expect(expression.position).toBe(position);
    expect(await expression(context)).toEqual(3);
  });

  test('reference', async () => {
    const value = 123;
    const symbols = new Symbols([['a', numberLiteral(value, position)]]);
    const expression = reference('a', position);
    const context = new Context(symbols);
    expect(expression.position).toBe(position);
    expect(await expression(context)).toEqual(value);
  });

  // Failed reference

  // Tuple
});

describe('Symbols', () => {
  test('number', () => {
    expect(true).toBe(true);
  });
});
describe('Context', () => {
  test('number', () => {
    expect(true).toBe(true);
  });
});
