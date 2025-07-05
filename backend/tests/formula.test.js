const FormulaEngine = require('../src/engine/FormulaEngine');

describe('FormulaEngine', () => {
  let engine;
  
  beforeEach(() => {
    engine = new FormulaEngine();
  });
  
  test('should evaluate simple arithmetic', async () => {
    const formula = {
      type: 'add',
      operands: [
        { type: 'constant', value: 5 },
        { type: 'constant', value: 3 }
      ]
    };
    
    const result = await engine.evaluate(formula, {});
    expect(result).toBe(8);
  });
  
  test('should handle cell references', async () => {
    // モックデータを設定
    engine.cellService = {
      getCell: jest.fn().mockResolvedValue({ value: 10 })
    };
    
    const formula = {
      type: 'multiply',
      operands: [
        { type: 'cell_reference', table: 'current', column: 'A', row: '1' },
        { type: 'constant', value: 2 }
      ]
    };
    
    const result = await engine.evaluate(formula, { tableId: 'table1', rowId: '1' });
    expect(result).toBe(20);
  });
});