import {CycleDetectedError} from './errors';
import {
  ASTNode,
  ASTNodeBase,
  ISkillsRepository,
  ISymbolTable,
  ITypeCheckingContext,
  Skill,
} from './interfaces';

export class TypeCheckingContext implements ITypeCheckingContext {
  skills: ISkillsRepository;
  symbols: ISymbolTable;
  visited = new Map<string, boolean>();
  path: ASTNodeBase[] = [];

  constructor(skills: ISkillsRepository, symbols: ISymbolTable) {
    this.skills = skills;
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

  skill(name: string): Skill<unknown[], unknown> {
    return this.skills.get(name);
  }
}
