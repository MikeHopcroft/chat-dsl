import {TokenPosition} from 'typescript-parsec';

import {
  booleanLiteral,
  numberLiteral,
  stringLiteral,
  SymbolTable,
} from '../src/dsl';

const position: TokenPosition = {
  index: 0,
  rowBegin: 1,
  rowEnd: 2,
  columnBegin: 3,
  columnEnd: 4,
};

const n1 = booleanLiteral(true, position);
const n2 = numberLiteral(123, position);
const n3 = stringLiteral('hello', position);

test('construct', () => {
  const symbols = new SymbolTable([
    ['a', n1],
    ['b', n2],
    ['c', n3],
  ]);
  const values = [...symbols.symbols.values()];
  expect(values[0]).toEqual(n1);
  expect(values[1]).toEqual(n2);
  expect(values[2]).toEqual(n3);
  expect(values.length).toBe(3);
});

test('construct (duplicates)', () => {
  expect(
    () =>
      new SymbolTable([
        ['a', n1],
        ['b', n2],
        ['c', n3],
        ['a', n2],
      ])
  ).toThrow('Duplicate binding for symbol "a".');
});

test('add', () => {
  const symbols = new SymbolTable();
  symbols.add('a', n1);
  symbols.add('b', n2);
  symbols.add('c', n3);
  const values = [...symbols.symbols.values()];
  expect(values[0]).toEqual(n1);
  expect(values[1]).toEqual(n2);
  expect(values[2]).toEqual(n3);
  expect(values.length).toBe(3);
});

test('add (duplicate)', () => {
  const symbols = new SymbolTable();
  symbols.add('a', n1);
  symbols.add('b', n2);
  symbols.add('c', n3);
  expect(() => symbols.add('a', n2)).toThrow(
    'Duplicate binding for symbol "a".'
  );
});

test('get (valid)', () => {
  const symbols = new SymbolTable([
    ['a', n1],
    ['b', n2],
    ['c', n3],
  ]);
  expect(symbols.get('a')).toBe(n1);
});

test('get (invalid)', () => {
  const symbols = new SymbolTable([
    ['b', n2],
    ['c', n3],
  ]);
  expect(() => symbols.get('a')).toThrow('Unknown symbol "a".');
});
