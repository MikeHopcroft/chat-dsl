import {
  checkForCycles,
  Context,
  formatError,
  func,
  literal,
  reference,
  Symbols,
} from './eval';

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Example of a skill who's implementation is async.
function add(...numbers: number[]) {
  const text = JSON.stringify(numbers).slice(1, -1).replace(',', ' + ');
  console.log(`add: ${text}`);
  return sleep(1000).then(() => numbers.reduce((p, c) => p + c, 0));
}

// Example of another skill who's implementation is async.
function mul(head: number, ...tail: number[]) {
  const text = JSON.stringify([head, ...tail])
    .slice(1, -1)
    .replace(',', ' * ');
  console.log(`multiply: ${text}`);
  return sleep(1000).then(() => tail.reduce((p, c) => p * c, head));
}

// Example of a skill that is not async.
function sub(x: number, y: number) {
  console.log(`sub: ${x} - ${y}`);
  return x - y;
}

// This example computes a - 1, where
//   a = b + c
//   b = 2
//   c = d * 3
//   d = 4
async function go() {
  //
  // Compilation stage
  //
  let line = 1;
  const symbols = new Symbols();

  // 1: a = b + c
  symbols.add(
    'a',
    func(
      add,
      [reference<number>('b', line), reference<number>('c', line)],
      line
    )
  );
  line++;

  // 2: b = 2
  symbols.add('b', literal(2, line));
  line++;

  // 3: c = d * 3
  symbols.add(
    'c',
    func(mul, [reference<number>('d', line), literal(3, line)], line)
  );
  line++;

  // // 4: d = 4
  // symbols.add('d', literal(4, line++));
  // 4: d = a
  symbols.add('d', reference<number>('a', line));
  line++;

  // 5: return a - 1
  const expr = func(
    sub,
    [reference<number>('a', line), literal(1, line)],
    line
  );
  line++;

  try {
    //
    // Validation stage
    //
    checkForCycles(symbols, expr);

    //
    // Execution stage
    //
    const context = new Context(symbols);
    console.log('starting async evaluation');
    const result = await expr(context);
    console.log('finished async evaluation');
    console.log(`result = ${result}`);
  } catch (e) {
    formatError(e);
  }
}

go();
