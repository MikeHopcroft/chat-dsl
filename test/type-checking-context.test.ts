import {TokenPosition} from 'typescript-parsec';

import {
  ASTFunction,
  ASTReference,
  FunctionDeclaration,
  numberLiteral,
} from '../src/ast';
import {SymbolTable} from '../src/symbol-table';
import {
  CycleDetectedError,
  TypeCheckingContext,
} from '../src/type-checking-context';
import * as t from '../src/types';

function advance(position: TokenPosition): TokenPosition {
  return {
    ...position,
    rowBegin: position.rowBegin + 1,
    rowEnd: position.rowEnd + 1,
  };
}

describe('TypeCheckingContext', () => {
  test('lookup', () => {});
  test('push', () => {});
  test('pop', () => {});
  test('enterScope', () => {});
  test('exitScope', () => {});
  test('cycle detection', () => {
    let position: TokenPosition = {
      index: 0,
      rowBegin: 1,
      rowEnd: 2,
      columnBegin: 3,
      columnEnd: 4,
    };

    const add: FunctionDeclaration<[number, number], number> = {
      func: (a: number, b: number) => a + b,
      paramsType: t.Tuple(t.Number, t.Number),
      returnType: t.Number,
    };

    const symbols = new SymbolTable();
    symbols.add(
      'a',
      new ASTFunction(
        add,
        [numberLiteral(1, position), new ASTReference<number>('b', position)],
        position
      )
    );
    position = advance(position);

    symbols.add(
      'b',
      new ASTFunction(
        add,
        [numberLiteral(2, position), new ASTReference<number>('c', position)],
        position
      )
    );
    position = advance(position);

    symbols.add('c', new ASTReference<number>('a', position));
    position = advance(position);

    const node = new ASTFunction(
      add,
      [numberLiteral(3, position), new ASTReference<number>('a', position)],
      position
    );

    const context = new TypeCheckingContext(symbols);
    expect(() => node.check(context)).toThrow(CycleDetectedError);
  });
});