export type Evaluator<R> = () => Promise<R>;

type Promisify<T extends readonly unknown[] | []> = {
  -readonly [P in keyof T]: Promise<T[P]>;
};

type Evaluatorize<T extends readonly unknown[] | []> = {
  -readonly [P in keyof T]: () => Promise<T[P]>;
};

function functionEvaluator<P extends unknown[], R>(
  f: (...params: P) => R,
  params: Evaluatorize<P>
): Evaluator<R> {
  return async () => {
    // https://stackoverflow.com/questions/57913193/how-to-use-array-map-with-tuples-in-typescript
    // https://stackoverflow.com/questions/65335982/how-to-map-a-typescript-tuple-into-a-new-tuple-using-array-map
    const promises = params.map(f => f()) as Promisify<P>;
    const awaitedParams = await Promise.all(promises);
    return await f(...awaitedParams);
  };
}

class Symbols {
  symbols: Map<string, Evaluator<any>>;

  constructor(initial: [string, Evaluator<any>][] = []) {
    this.symbols = new Map(initial);
  }

  add<T>(name: string, value: Evaluator<T>) {
    if (this.symbols.has(name)) {
      throw new Error(`Duplicate symbol "${name}".`);
    }
    this.symbols.set(name, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  get(name: string): Evaluator<unknown> {
    const value = this.symbols.get(name);
    if (value === undefined) {
      throw new Error(`Unknown symbol "${name}".`);
    }
    return value;
  }
}

class Context {
  symbols: Symbols;
  promises = new Map<string, Promise<any>>();

  constructor(symbols: Symbols) {
    this.symbols = symbols;
  }

  get(name: string): Promise<unknown> {
    let promise = this.promises.get(name);
    if (promise === undefined) {
      const value = this.symbols.get(name);
      if (value === undefined) {
        throw new Error(`Reference to unknown symbol "${name}".`);
      }
      promise = value();
      this.promises.set(name, promise);
    }
    return promise;
  }
}

// TODO: move context to Evaluator<V> parameter.
// Don't want to capture context at variableEvaluator creation.
function variableEvaluator<V>(context: Context, name: string): Evaluator<V> {
  return () => {
    const promise = context.get(name);
    return promise as Promise<V>;
  };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function literalEvaluator<V>(value: V): Evaluator<V> {
  return () => sleep(1000).then(() => Promise.resolve(value));
}

function add(...numbers: number[]) {
  return numbers.reduce((p, c) => p + c, 0);
}

function mul(head: number, ...tail: number[]) {
  return tail.reduce((p, c) => p * c, head);
}

async function go() {
  console.log(`add(1,2,3) = ${add(1, 2, 3)}`);
  console.log(`mul(4,5,6) = ${mul(4, 5, 6)}`);
  console.log(`mul(4) = ${mul(4)}`);

  const l = literalEvaluator(5);
  const lv = await l();
  console.log(`lv = ${lv}`);

  const m = literalEvaluator(true);
  const mv = await m();
  console.log(`mv = ${mv}`);

  const expr = functionEvaluator(add, [
    literalEvaluator(1),
    literalEvaluator(2),
  ]);

  // const expr2 = functionEvaluator(mul, []);

  const e = await expr();
  console.log(`e = ${e}`);
}

go();
