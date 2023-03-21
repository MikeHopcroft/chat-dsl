// An Evaluator is a function that evaluates an expression in a specific
// Context.
//   * The expression is baked into the Evaluator at the time the
//     Evaluator is created.
//   * Evaluators can be created with factories such as func(), literal(),
//     and reference().
//   * The Context provides access to a Symbols object that maps identifers
//     to Evaluators. It also memoizes the Promises returned by Evaluators.
//   * Evaluators are async functions. They always return Promises.
export type Evaluator<R> = (context: Context) => Promise<R>;

// The Symbols class is used during the compilation stage.
// The Symbols class maintains a mapping from identifiers to Evaluators.
// In an architecture with compile and execute stages, the Symbols class
// is created in the compile stage. The execution stage does not modify
// the Symbols table, so it can be used for multiple executions.
//
// Note that while Evaluators are strongly typed, this typing is lost
// when accessing an Evaluator via the Symbols class.
export class Symbols {
  symbols = new Map<string, Evaluator<unknown>>();

  // Construct a Symbols table, initialized with an array of
  // pairs [string, Evaluator<unknown>].
  constructor(bindings: [string, Evaluator<unknown>][] = []) {
    for (const binding of bindings) {
      this.add(binding[0], binding[1]);
    }
  }

  // Add another [string, Evaluator<unknown>] binding to the Symbols table.
  add<T>(name: string, value: Evaluator<T>) {
    if (this.symbols.has(name)) {
      throw new Error(`Duplicate binding for symbol "${name}".`);
    }
    this.symbols.set(name, value);
  }

  // Returns the Evaluator bound to a specified name.
  get(name: string): Evaluator<unknown> {
    const value = this.symbols.get(name);
    if (value === undefined) {
      throw new Error(`Unknown symbol "${name}".`);
    }
    return value;
  }
}

// The Context class is used during the execution stage.
// A new Context should be created for each top-level evaluation.
// It maintains a mapping from variable identifiers to the Promises
// returned by the corresponding Evaluators.
//
// The first call to Context.get() for a given identifier uses the
// Symbols table to look up the appropriate Evaluator. This Evaluator
// is invoked and the resulting Promise is memoized for future calls
// to Context.get().
export class Context {
  symbols: Symbols;
  promises = new Map<string, Promise<unknown>>();

  // Construct a Context, based on a Symbols table.
  constructor(symbols: Symbols) {
    this.symbols = symbols;
  }

  // Returns the Promise associated with a given identifier.
  // The first call for a given identifier will look up the associated
  // Evaluator. This Evaluator will be invoked and its resulting Promise
  // will be memoized for future calls.
  get(name: string): Promise<unknown> {
    let promise = this.promises.get(name);
    if (promise === undefined) {
      // We've never evaluated this identifier.
      // Look up the associated Evaluator.
      const value = this.symbols.get(name);
      if (value === undefined) {
        throw new Error(`Reference to unknown symbol "${name}".`);
      }

      // Evaluate it
      promise = value(this);

      //Memoize the resulting Promise.
      this.promises.set(name, promise);
    }
    return promise;
  }
}

type Promisify<T extends readonly unknown[] | []> = {
  -readonly [P in keyof T]: Promise<T[P]>;
};

type Evaluatorize<T extends readonly unknown[] | []> = {
  -readonly [P in keyof T]: (context: Context) => Promise<T[P]>;
};

// Factory to create an Evaluator for a given function and set of parameters.
export function func<P extends unknown[], R>(
  f: (...params: P) => R,
  params: Evaluatorize<P>
): Evaluator<R> {
  return async (context: Context) => {
    // These links explain why we have to type assert to Promisify<P> after map.
    // https://stackoverflow.com/questions/57913193/how-to-use-array-map-with-tuples-in-typescript
    // https://stackoverflow.com/questions/65335982/how-to-map-a-typescript-tuple-into-a-new-tuple-using-array-map
    const promises = params.map(f => f(context)) as Promisify<P>;
    const awaitedParams = await Promise.all(promises);
    return await f(...awaitedParams);
  };
}

// Factory to create an Evaluator for a symbolic reference.
export function reference<V>(name: string): Evaluator<V> {
  return (context: Context) => {
    const promise = context.get(name);
    return promise as Promise<V>;
  };
}

type Literal = string | number | boolean | Array<Literal>;

// Factory to create an Evaluator for a literal value.
export function literal<V extends Literal>(value: V): Evaluator<V> {
  return () => Promise.resolve(value);
}
