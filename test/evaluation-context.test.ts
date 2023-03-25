import {TokenPosition} from 'typescript-parsec';

import {ASTFunction, FunctionDeclaration, numberLiteral} from '../src/ast';

import {EvaluationContext} from '../src/evaluation-context';
import {SymbolTable} from '../src/symbol-table';
import * as t from '../src/types';

const position: TokenPosition = {
  index: 0,
  rowBegin: 1,
  rowEnd: 2,
  columnBegin: 3,
  columnEnd: 4,
};

describe('EvaluationContext', () => {
  test('get (memoization)', async () => {
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
    const symbols = new SymbolTable([
      ['a', node],
      ['b', node],
    ]);

    const evalContext = new EvaluationContext(symbols);

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