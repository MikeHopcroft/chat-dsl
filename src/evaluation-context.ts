import {IEvaluationContext, ISymbolTable} from './interfaces';

// The Context class is used during the execution stage.
// A new Context should be created for each top-level evaluation.
// It maintains a mapping from variable identifiers to the Promises
// returned by the corresponding Evaluators.
//
// The first call to Context.get() for a given identifier uses the
// Symbols table to look up the appropriate Evaluator. This Evaluator
// is invoked and the resulting Promise is memoized for future calls
// to Context.get().
export class EvaluationContext implements IEvaluationContext {
  symbols: ISymbolTable;
  promises = new Map<string, Promise<unknown>>();

  // Construct a Context, based on a Symbols table.
  constructor(symbols: ISymbolTable) {
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
      const node = this.symbols.get(name);

      // Evaluate it
      promise = node.eval(this);

      // Memoize the resulting Promise.
      this.promises.set(name, promise);
    }
    return promise;
  }
}
