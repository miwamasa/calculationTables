class FormulaEngine {
  constructor(cellService, redis) {
    this.cellService = cellService;
    this.redis = redis;
  }

  async evaluateFormula(formula, context) {
    try {
      // キャッシュチェック
      const cacheKey = this.getCacheKey(formula, context);
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      // 計算実行
      const result = await this.evaluate(formula.expression, context);
      
      // 結果をキャッシュ
      await this.redis.setex(cacheKey, 300, JSON.stringify(result));
      
      return result;
    } catch (error) {
      throw new Error(`Formula evaluation error: ${error.message}`);
    }
  }

  async evaluate(expression, context) {
    switch (expression.type) {
      case 'constant':
        return expression.value;
      
      case 'cell_reference':
        return await this.getCellValue(expression, context);
      
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        return await this.evaluateBinaryOp(expression, context);
      
      case 'sum':
      case 'average':
      case 'count':
        return await this.evaluateAggregation(expression, context);
      
      case 'if':
        return await this.evaluateConditional(expression, context);
      
      default:
        throw new Error(`Unknown expression type: ${expression.type}`);
    }
  }

  async evaluateBinaryOp(expression, context) {
    const left = await this.evaluate(expression.operands[0], context);
    const right = await this.evaluate(expression.operands[1], context);
    
    switch (expression.type) {
      case 'add': return left + right;
      case 'subtract': return left - right;
      case 'multiply': return left * right;
      case 'divide': return right !== 0 ? left / right : null;
    }
  }

  async getCellValue(expression, context) {
    const tableId = expression.table === 'current' ? context.tableId : expression.table;
    const rowId = expression.row === 'current' ? context.rowId : expression.row;
    const columnId = expression.column;
    
    const cell = await this.cellService.getCell(tableId, rowId, columnId);
    return cell ? cell.value : null;
  }

  getCacheKey(formula, context) {
    return `formula:${formula._id}:${context.tableId}:${context.rowId}`;
  }
}

module.exports = FormulaEngine;