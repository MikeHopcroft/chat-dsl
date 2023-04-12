import {SymbolError} from './errors';
import {ASTNode} from '../interfaces';

// The Symbols class is used during the compilation stage.
// The Symbols class maintains a mapping from identifiers to Evaluators.
// In an architecture with compile and execute stages, the Symbols class
// is created in the compile stage. The execution stage does not modify
// the Symbols table, so it can be used for multiple executions.
//
// Note that while Evaluators are strongly typed, this typing is lost
// when accessing an Evaluator via the Symbols class.
export class SymbolTable {
  symbols = new Map<string, ASTNode<unknown>>();

  // Construct a Symbols table, initialized with an array of
  // pairs [string, Evaluator<unknown>].
  constructor(bindings: [string, ASTNode<unknown>][] = []) {
    for (const binding of bindings) {
      this.add(binding[0], binding[1]);
    }
  }

  // Add another [string, Evaluator<unknown>] binding to the Symbols table.
  add<T>(name: string, value: ASTNode<T>) {
    if (this.symbols.has(name)) {
      throw new SymbolError(`Duplicate binding for symbol "${name}".`);
    }
    this.symbols.set(name, value);
  }

  // Returns the Evaluator bound to a specified name.
  get(name: string): ASTNode<unknown> {
    const value = this.symbols.get(name);
    if (value === undefined) {
      throw new SymbolError(`Unknown symbol "${name}".`);
    }
    return value;
  }
}
