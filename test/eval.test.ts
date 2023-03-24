import {TokenPosition} from 'typescript-parsec';

import {
  ASTFunction,
  ASTReference,
  booleanLiteral,
  // Context,
  // func,
  FunctionDeclaration,
  numberLiteral,
  // reference,
  stringLiteral,
  // Symbols,
} from '../src/ast';

import {EvaluationContext} from '../src/evaluation-context';
// import {IEvaluationContext, ITypeCheckingContext} from '../src/interfaces';
import {SymbolTable} from '../src/symbols';
import {TypeCheckingContext} from '../src/type-checking-context';
import * as t from '../src/types';

const position: TokenPosition = {
  index: 0,
  rowBegin: 1,
  rowEnd: 2,
  columnBegin: 3,
  columnEnd: 4,
};

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
  test('function2', async () => {
    const add: FunctionDeclaration<[number, number], number> = {
      func: jest.fn((a: number, b: number) => a + b),
      paramsType: t.Tuple(t.Number, t.Number),
      returnType: t.Number,
    };
    const node = new ASTFunction(
      add,
      [numberLiteral(1, position), numberLiteral(2, position)],
      position
    );

    const tcContext = new TypeCheckingContext(symbols);
    const evalContext = new EvaluationContext(symbols);

    expect(node.position).toBe(position);
    expect(node.check(tcContext)).toEqual(t.Number);
    expect(await node.eval(evalContext)).toEqual(3);
    expect(add.func).toHaveBeenCalledWith(1, 2);
    expect(add.func).toHaveBeenCalledTimes(1);
  });

  // test('function (invalid)', async () => {
  //   const f = (a: number, b: number) => a + b;

  //   const add: FunctionDeclaration<[unknown, unknown], number> = {
  //     func: jest.fn(f as (a: unknown, b: unknown) => number),
  //     paramsType: t.Tuple(t.Number, t.Number),
  //     returnType: t.Number,
  //   };
  //   const node = new ASTFunction(
  //     add,
  //     [stringLiteral('hello', position), numberLiteral(2, position)],
  //     position
  //   );

  //   const tcContext = new TypeCheckingContext(symbols);
  //   const evalContext = new EvaluationContext(symbols);

  //   expect(node.position).toBe(position);
  //   expect(node.check(tcContext)).toEqual(t.Number);
  //   expect(await node.eval(evalContext)).toEqual(3);
  //   expect(add.func).toHaveBeenCalledWith(1, 2);
  //   expect(add.func).toHaveBeenCalledTimes(1);
  // });

  test('reference (valid)', async () => {
    const value = 123;
    const symbols = new SymbolTable([['a', numberLiteral(value, position)]]);
    const node = new ASTReference('a', position);

    const tcContext = new TypeCheckingContext(symbols);
    const evalContext = new EvaluationContext(symbols);

    expect(node.position).toBe(position);
    expect(node.check(tcContext)).toEqual(t.Number);
    expect(await node.eval(evalContext)).toEqual(value);
  });

  test('reference (invalid)', async () => {
    const symbols = new SymbolTable();
    const node = new ASTReference('a', position);

    const tcContext = new TypeCheckingContext(symbols);
    const evalContext = new EvaluationContext(symbols);

    expect(() => node.check(tcContext)).toThrow('Unknown symbol "a".');
    expect(async () => await node.eval(evalContext)).toThrow(
      'Unknown symbol "a".'
    );
  });
  // Failed reference
  // Tuple
  // Cycles
  // Type mismatch
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
