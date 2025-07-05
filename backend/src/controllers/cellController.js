const Cell = require('../models/Cell');

// 数式計算関数（クラス外で定義）
function calculateFormula(expression, rowCells, table) {
  console.log('calculateFormula called with:', { expression, rowCells, table });
  
  switch (expression.type) {
    case 'add':
      const addValues = calculateOperands(expression.operands, rowCells, table);
      console.log('Add operation values:', addValues);
      return addValues.reduce((sum, val) => sum + val, 0);
    
    case 'subtract':
      const subtractValues = calculateOperands(expression.operands, rowCells, table);
      console.log('Subtract operation values:', subtractValues);
      return subtractValues.reduce((result, val, index) => 
        index === 0 ? val : result - val
      );
    
    case 'multiply':
      const multiplyValues = calculateOperands(expression.operands, rowCells, table);
      console.log('Multiply operation values:', multiplyValues);
      return multiplyValues.reduce((product, val) => product * val, 1);
    
    case 'divide':
      const divideValues = calculateOperands(expression.operands, rowCells, table);
      console.log('Divide operation values:', divideValues);
      return divideValues.reduce((result, val, index) => 
        index === 0 ? val : result / val
      );
    
    case 'constant':
      console.log('Constant value:', expression.value);
      return expression.value;
    
    case 'cell_reference':
      const cell = rowCells.find(c => c.column_id === expression.column);
      console.log('Cell reference lookup:', { 
        column: expression.column, 
        cell: cell,
        availableCells: rowCells.map(c => ({column_id: c.column_id, value: c.value}))
      });
      return cell ? parseFloat(cell.value) || 0 : 0;
    
    default:
      throw new Error(`Unknown expression type: ${expression.type}`);
  }
}

function calculateOperands(operands, rowCells, table) {
  return operands.map(operand => calculateFormula(operand, rowCells, table));
}

class CellController {
  async createCell(req, res) {
    try {
      const { table_id, row_id, column_id, value, type, formula_id } = req.body;
      
      const cell = new Cell({
        table_id,
        row_id,
        column_id,
        value,
        type,
        formula_id
      });
      
      await cell.save();
      
      res.status(201).json(cell);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCell(req, res) {
    try {
      const { id } = req.params;
      const cell = await Cell.findById(id).populate('formula_id');
      
      if (!cell) {
        return res.status(404).json({ error: 'Cell not found' });
      }
      
      res.json(cell);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCell(req, res) {
    try {
      const { id } = req.params;
      const { value, type, formula_id } = req.body;
      
      const cell = await Cell.findByIdAndUpdate(
        id,
        { 
          value, 
          type, 
          formula_id,
          updated_at: new Date() 
        },
        { new: true, upsert: true }
      );
      
      res.json(cell);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCell(req, res) {
    try {
      const { id } = req.params;
      
      const cell = await Cell.findByIdAndDelete(id);
      
      if (!cell) {
        return res.status(404).json({ error: 'Cell not found' });
      }
      
      res.json({ message: 'Cell deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCellsByTable(req, res) {
    try {
      const { tableId } = req.params;
      const cells = await Cell.find({ table_id: tableId }).populate('formula_id');
      
      res.json(cells);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateOrCreateCell(req, res) {
    try {
      const { tableId, rowId, columnId } = req.params;
      const { value, type } = req.body;
      
      const cell = await Cell.findOneAndUpdate(
        { table_id: tableId, row_id: rowId, column_id: columnId },
        { 
          value, 
          type: type || 'string',
          updated_at: new Date() 
        },
        { new: true, upsert: true }
      );
      
      res.json(cell);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSampleData(req, res) {
    try {
      const { tableId } = req.params;
      const Table = require('../models/Table');
      
      // テーブル情報を取得
      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
      
      // 既存のセルを削除
      await Cell.deleteMany({ table_id: tableId });
      
      // テーブルの列情報を使用してサンプルデータを作成
      const sampleCells = [];
      for (let row = 1; row <= 5; row++) {
        table.columns.forEach((column, colIndex) => {
          let value = '';
          let type = column.type;
          
          if (column.type === 'string') {
            value = `商品${row}`;
          } else if (column.type === 'number') {
            if (colIndex === 1) { // 単価
              value = 1000 + (row * 100);
            } else if (colIndex === 2) { // 数量
              value = row * 2;
            } else if (colIndex === 3) { // 合計
              value = (1000 + (row * 100)) * (row * 2);
            }
          } else if (column.type === 'formula') {
            value = (1000 + (row * 100)) * (row * 2);
            type = 'number'; // 計算結果は数値
          }
          
          sampleCells.push({
            table_id: tableId,
            row_id: `row_${row}`,
            column_id: column.id,
            value: value,
            type: type
          });
        });
      }
      
      const createdCells = await Cell.insertMany(sampleCells);
      res.json(createdCells);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addRow(req, res) {
    try {
      const { tableId } = req.params;
      const Table = require('../models/Table');
      
      // テーブル情報を取得
      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
      
      // 新しい行IDを生成
      const existingCells = await Cell.find({ table_id: tableId });
      const existingRowIds = [...new Set(existingCells.map(cell => cell.row_id))];
      const nextRowNumber = existingRowIds.length + 1;
      const newRowId = `row_${nextRowNumber}`;
      
      // 各列に対して空のセルを作成
      const newCells = table.columns.map(column => ({
        table_id: tableId,
        row_id: newRowId,
        column_id: column.id,
        value: '',
        type: column.type === 'formula' ? 'number' : column.type
      }));
      
      const createdCells = await Cell.insertMany(newCells);
      res.json(createdCells);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteRow(req, res) {
    try {
      const { tableId, rowId } = req.params;
      
      const deletedCells = await Cell.deleteMany({ 
        table_id: tableId, 
        row_id: rowId 
      });
      
      res.json({ 
        message: 'Row deleted successfully', 
        deletedCount: deletedCells.deletedCount 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async applyFormulaToCell(req, res) {
    try {
      const { tableId, rowId, columnId } = req.params;
      const { formulaId } = req.body;
      
      console.log('=== applyFormulaToCell Debug ===');
      console.log('Request params:', { tableId, rowId, columnId, formulaId });
      
      const Formula = require('../models/Formula');
      const Table = require('../models/Table');
      const CalculationHistory = require('../models/CalculationHistory');
      
      // 数式とテーブル情報を取得
      const [formula, table] = await Promise.all([
        Formula.findById(formulaId),
        Table.findById(tableId)
      ]);
      
      console.log('Formula:', formula);
      console.log('Table:', table);
      
      if (!formula) {
        return res.status(404).json({ error: 'Formula not found' });
      }
      
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
      
      // 同じ行の他のセルデータを取得
      const rowCells = await Cell.find({ 
        table_id: tableId, 
        row_id: rowId 
      });
      
      console.log('Row cells:', rowCells);
      console.log('Formula expression:', formula.expression);
      
      // 数式を計算
      const result = calculateFormula(formula.expression, rowCells, table);
      
      console.log('Calculation result:', result);
      
      // セルを更新
      const cell = await Cell.findOneAndUpdate(
        { table_id: tableId, row_id: rowId, column_id: columnId },
        { 
          value: result,
          type: 'number',
          formula_id: formulaId,
          updated_at: new Date() 
        },
        { new: true, upsert: true }
      );
      
      console.log('Updated cell:', cell);
      
      // 計算履歴を保存
      const historyEntry = new CalculationHistory({
        table_id: tableId,
        row_id: rowId,
        column_id: columnId,
        formula_id: formulaId,
        formula_name: formula.name,
        formula_expression: formula.expression,
        calculated_value: result,
        applied_at: new Date()
      });
      
      await historyEntry.save();
      console.log('Calculation history saved:', historyEntry);
      
      res.json(cell);
    } catch (error) {
      console.error('Error in applyFormulaToCell:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getCalculationHistory(req, res) {
    try {
      const { tableId } = req.params;
      const CalculationHistory = require('../models/CalculationHistory');
      
      const history = await CalculationHistory.find({ table_id: tableId })
        .sort({ applied_at: -1 })
        .limit(100);
      
      res.json(history);
    } catch (error) {
      console.error('Error fetching calculation history:', error);
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new CellController();