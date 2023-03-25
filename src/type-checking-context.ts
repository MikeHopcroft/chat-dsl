import {
  ASTNode,
  ASTNodeBase,
  ISymbolTable,
  ITypeCheckingContext,
} from './interfaces';

export class TypeCheckingContext implements ITypeCheckingContext {
  symbols: ISymbolTable;
  visited = new Map<string, boolean>();
  path: ASTNodeBase[] = [];

  constructor(symbols: ISymbolTable) {
    this.symbols = symbols;
  }

  lookup(symbol: string): ASTNode<unknown> {
    if (this.visited.get(symbol)) {
      // We've found a cycle.
      throw new CycleDetectedError(this.path, symbol);
    }
    return this.symbols.get(symbol);
  }

  push(node: ASTNodeBase) {
    this.path.push(node);
  }

  pop() {
    this.path.pop();
  }

  enterScope(symbol: string) {
    this.visited.set(symbol, true);
  }

  exitScope(symbol: string) {
    this.visited.set(symbol, true);
  }
}

export class CycleDetectedError extends Error {
  path: ASTNodeBase[];
  symbol: string;
  constructor(path: ASTNodeBase[], symbol: string) {
    super('Cycle detected');
    this.path = path;
    this.symbol = symbol;
  }
}
