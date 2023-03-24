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
