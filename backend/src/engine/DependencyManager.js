class DependencyManager {
  constructor() {
    this.graph = new Map();
  }

  addDependency(cellId, dependsOn) {
    if (!this.graph.has(cellId)) {
      this.graph.set(cellId, { dependencies: new Set(), dependents: new Set() });
    }
    if (!this.graph.has(dependsOn)) {
      this.graph.set(dependsOn, { dependencies: new Set(), dependents: new Set() });
    }
    
    this.graph.get(cellId).dependencies.add(dependsOn);
    this.graph.get(dependsOn).dependents.add(cellId);
  }

  getAffectedCells(cellId) {
    const affected = new Set();
    const queue = [cellId];
    
    while (queue.length > 0) {
      const current = queue.shift();
      const node = this.graph.get(current);
      
      if (node) {
        for (const dependent of node.dependents) {
          if (!affected.has(dependent)) {
            affected.add(dependent);
            queue.push(dependent);
          }
        }
      }
    }
    
    return Array.from(affected);
  }

  getCalculationOrder(cells) {
    // トポロジカルソートを実装
    const sorted = [];
    const visited = new Set();
    const visiting = new Set();
    
    const visit = (cellId) => {
      if (visiting.has(cellId)) {
        throw new Error('Circular dependency detected');
      }
      if (visited.has(cellId)) return;
      
      visiting.add(cellId);
      
      const node = this.graph.get(cellId);
      if (node) {
        for (const dep of node.dependencies) {
          visit(dep);
        }
      }
      
      visiting.delete(cellId);
      visited.add(cellId);
      sorted.push(cellId);
    };
    
    for (const cellId of cells) {
      visit(cellId);
    }
    
    return sorted;
  }
}

module.exports = DependencyManager;